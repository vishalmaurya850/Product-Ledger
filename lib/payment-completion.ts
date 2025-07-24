import { connectToDatabase, collections, logStatusChange } from "@/lib/db"
import { ObjectId } from "mongodb"

export interface PaymentCompletionResult {
  success: boolean
  outstandingBalanceReset: boolean
  creditLimitRestored: boolean
  originalCreditLimit: number
  newCreditLimit: number
  totalAmountSettled: number
  creditRestored: number
}

export async function handlePaymentCompletion(
  customerId: ObjectId | string,
  companyId: string,
  entryId: ObjectId | string,
  paymentAmount: number,
  userId: string
): Promise<PaymentCompletionResult> {
  try {
    const { db } = await connectToDatabase()
    const customerObjectId = typeof customerId === 'string' ? new ObjectId(customerId) : customerId
    const entryObjectId = typeof entryId === 'string' ? new ObjectId(entryId) : entryId

    // Get the original entry being paid
    const originalEntry = await db.collection(collections.ledger).findOne({
      _id: entryObjectId,
      companyId,
    })

    if (!originalEntry) {
      throw new Error("Entry not found")
    }

    // Get current customer settings
    const customerSettings = await db.collection(collections.customerSettings).findOne({
      customerId: customerObjectId,
      companyId,
    })

    // Get original credit limit from the entry or current settings
    const originalCreditLimit = originalEntry.originalCreditLimit || customerSettings?.originalCreditLimit || customerSettings?.creditLimit || 10000
    const currentCreditLimit = customerSettings?.creditLimit || 10000

    // Calculate if this payment fully settles the entry
    const currentPaidAmount = originalEntry.paidAmount || 0
    const newPaidAmount = currentPaidAmount + paymentAmount
    const isFullyPaid = newPaidAmount >= originalEntry.amount

    let outstandingBalanceReset = false
    let creditLimitRestored = false
    let creditRestored = 0

    if (isFullyPaid) {
      // Step 1: Reset outstanding balance for this entry to zero
      await db.collection(collections.ledger).updateOne(
        { _id: entryObjectId },
        {
          $set: {
            status: "Paid",
            paidAmount: originalEntry.amount, // Exact amount, no overpayment
            paidDate: new Date(),
            outstandingBalance: 0, // Explicitly reset to zero
            updatedAt: new Date(),
            daysElapsed: 0, // Reset days elapsed when paid
            accruedInterest: 0, // Reset accrued interest when paid
            overdueStartDate: null, // Clear overdue start date
          }
        }
      )
      outstandingBalanceReset = true

      // Step 2: Check if we need to restore credit limit for this customer
      const allCustomerEntries = await db.collection(collections.ledger).find({
        customerId: customerObjectId,
        companyId,
        type: "Sell",
        status: { $ne: "Paid" }
      }).toArray()

      // If no more unpaid entries, restore full credit limit
      if (allCustomerEntries.length === 0) {
        // Restore credit limit to original state
        await db.collection(collections.customerSettings).updateOne(
          { customerId: customerObjectId, companyId },
          {
            $set: {
              creditLimit: originalCreditLimit,
              creditUsed: 0, // Reset credit used to zero
              availableCredit: originalCreditLimit, // Full credit available
              updatedAt: new Date(),
            }
          },
          { upsert: true }
        )

        creditRestored = originalCreditLimit - currentCreditLimit
        creditLimitRestored = true

        // Log the credit restoration
        await logStatusChange(
          db,
          entryObjectId,
          customerObjectId,
          originalEntry.status,
          "Paid",
          `Payment completion: Outstanding balance reset to ₹0, Credit limit restored to ₹${originalCreditLimit.toFixed(2)}`,
          companyId,
          userId,
          0, // No interest when paid
          creditRestored
        )
      } else {
        // Partial restoration: restore credit for this specific entry amount
        const entryAmount = originalEntry.amount
        const newCreditLimit = Math.min(currentCreditLimit + entryAmount, originalCreditLimit)
        
        await db.collection(collections.customerSettings).updateOne(
          { customerId: customerObjectId, companyId },
          {
            $set: {
              creditLimit: newCreditLimit,
              updatedAt: new Date(),
            }
          },
          { upsert: true }
        )

        creditRestored = newCreditLimit - currentCreditLimit
        creditLimitRestored = creditRestored > 0

        // Log the partial credit restoration
        await logStatusChange(
          db,
          entryObjectId,
          customerObjectId,
          originalEntry.status,
          "Paid",
          `Payment completion: Outstanding balance reset to ₹0, Credit limit increased by ₹${creditRestored.toFixed(2)} to ₹${newCreditLimit.toFixed(2)}`,
          companyId,
          userId,
          0, // No interest when paid
          creditRestored
        )
      }

      // Step 3: Update customer's total outstanding balance
      await updateCustomerTotalBalance(customerObjectId, companyId)
    }

    return {
      success: true,
      outstandingBalanceReset,
      creditLimitRestored,
      originalCreditLimit,
      newCreditLimit: creditLimitRestored ? originalCreditLimit : currentCreditLimit + creditRestored,
      totalAmountSettled: paymentAmount,
      creditRestored
    }

  } catch (error) {
    console.error("Payment completion handling failed:", error)
    return {
      success: false,
      outstandingBalanceReset: false,
      creditLimitRestored: false,
      originalCreditLimit: 0,
      newCreditLimit: 0,
      totalAmountSettled: 0,
      creditRestored: 0
    }
  }
}

// Helper function to recalculate customer's total outstanding balance
async function updateCustomerTotalBalance(customerId: ObjectId, companyId: string): Promise<void> {
  const { db } = await connectToDatabase()

  // Get all unpaid entries for this customer
  const unpaidEntries = await db.collection(collections.ledger).find({
    customerId,
    companyId,
    type: "Sell",
    status: { $ne: "Paid" }
  }).toArray()

  // Calculate total outstanding balance
  let totalOutstanding = 0
  for (const entry of unpaidEntries) {
    const entryBalance = entry.amount - (entry.paidAmount || 0) + (entry.accruedInterest || 0)
    totalOutstanding += Math.max(0, entryBalance)
  }

  // Update customer's total outstanding balance
  await db.collection(collections.customerSettings).updateOne(
    { customerId, companyId },
    {
      $set: {
        totalOutstandingBalance: totalOutstanding,
        updatedAt: new Date(),
      }
    },
    { upsert: true }
  )
}

// Function to get customer's current financial status
export async function getCustomerFinancialStatus(
  customerId: ObjectId | string,
  companyId: string
): Promise<{
  totalOutstanding: number
  creditLimit: number
  availableCredit: number
  creditUsed: number
  unpaidEntries: any[]
}> {
  const { db } = await connectToDatabase()
  const customerObjectId = typeof customerId === 'string' ? new ObjectId(customerId) : customerId

  // Get customer settings
  const customerSettings = await db.collection(collections.customerSettings).findOne({
    customerId: customerObjectId,
    companyId,
  }) || { creditLimit: 10000, gracePeriod: 30, interestRate: 18 }

  // Get all unpaid entries
  const unpaidEntries = await db.collection(collections.ledger).find({
    customerId: customerObjectId,
    companyId,
    type: "Sell",
    status: { $ne: "Paid" }
  }).toArray()

  // Calculate totals
  let totalOutstanding = 0
  let creditUsed = 0

  for (const entry of unpaidEntries) {
    const entryBalance = entry.amount - (entry.paidAmount || 0) + (entry.accruedInterest || 0)
    totalOutstanding += Math.max(0, entryBalance)
    creditUsed += entry.amount - (entry.paidAmount || 0)
  }

  const availableCredit = Math.max(0, customerSettings.creditLimit - creditUsed)

  return {
    totalOutstanding,
    creditLimit: customerSettings.creditLimit,
    availableCredit,
    creditUsed,
    unpaidEntries
  }
}
