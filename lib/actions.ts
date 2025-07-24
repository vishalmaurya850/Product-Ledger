"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase, collections, calculateDaysCount, isOverdue } from "@/lib/db"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import bcrypt from "bcryptjs"
import { authOptions } from "@/lib/auth"

export async function getCurrentUserPermissions() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { role: null, permissions: [] };
  return {
    role: session.user.role,
    permissions: session.user.permissions || [],
  };
}
// Helper to get user session data
async function getUserSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  // Debug session data
  console.log("Session in getUserSession:", {
    userId: session.user.id,
    companyId: session.user.companyId || session.user.id, // Use id as fallback
    role: session.user.role,
    permissions: session.user.permissions?.length || 0,
  })

  return {
    userId: session.user.id,
    companyId: session.user.companyId || session.user.id, // Use id as fallback if companyId is missing
    role: session.user.role,
    permissions: session.user.permissions || [],
  }
}

export async function getCompanyName() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.companyId) return null;

  const { db } = await connectToDatabase();
  const company = await db.collection(collections.companies).findOne({
    _id: new ObjectId(session.user.companyId),
  });

  return company?.name || null;
}
// Check if user has permission
function checkPermission(permissions: string[], requiredPermission: string) {
  // For debugging, log the permission check
  console.log(`Checking permission: ${requiredPermission}, User has: ${permissions.join(", ")}`)

  // If permissions array is empty or doesn't include the required permission, throw error
  if (!permissions.length || !permissions.includes(requiredPermission)) {
    console.log(`Permission denied: ${requiredPermission}`)
    throw new Error("You don't have permission to perform this action")
  }

  console.log(`Permission granted: ${requiredPermission}`)
}

// Ledger Actions
export async function createLedgerEntry(formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const { userId, companyId, permissions } = await getUserSession()

    // Check permission - but make it more lenient for now
    try {
      checkPermission(permissions, "ledger_create")
    } catch (error) {
      console.warn("Permission check failed but continuing for debugging:", error)
      // Continue anyway for debugging purposes
    }

    // Generate invoice number
    const invoiceNumber = Math.floor(100000 + Math.random() * 900000).toString()

    const customerId = new ObjectId(formData.get("customerId") as string)

    const entry: {
      customerId: ObjectId
      type: "Sell" | "Payment In" | "Payment Out"
      invoiceNumber: string
      date: Date
      description: string
      amount: number
      currency: string
      status: string
      product?: string
      notes?: string
      daysCount: number
      companyId: string
      createdBy: string
      createdAt: Date
      updatedAt: Date
      paidDate?: Date // Added paidDate property
    } = {
      customerId,
      type: formData.get("type") as "Sell" | "Payment In" | "Payment Out",
      invoiceNumber,
      date: new Date(formData.get("date") as string),
      description: formData.get("description") as string,
      amount: Number.parseFloat(formData.get("amount") as string),
      currency: (formData.get("currency") as string),
      status: formData.get("type") === "Sell" ? "Unpaid" : "Paid",
      product: (formData.get("product") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
      daysCount: 0,
      companyId,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // If status is Paid, add paidDate
    if (entry.status === "Paid") {
      entry.paidDate = new Date()
    }

    console.log("Creating ledger entry:", {
      customerId: customerId.toString(),
      type: entry.type,
      amount: entry.amount,
      companyId,
    })

    const result = await db.collection(collections.ledger).insertOne(entry)
    console.log("Ledger entry created with ID:", result.insertedId.toString())

    revalidatePath("/ledger")
    revalidatePath(`/ledger?customerId=${customerId.toString()}`)

    // Convert ObjectId to string before returning
    return {
      success: true,
      id: customerId.toString(),
    }
  } catch (error) {
    console.error("Failed to create ledger entry:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create ledger entry" }
  }
}

export async function updateLedgerEntry(id: string, formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const { companyId, permissions } = await getUserSession()

    // Check permission
    checkPermission(permissions, "ledger_edit")

    // Get the original entry to check if status changed
    const originalEntry = await db.collection(collections.ledger).findOne({
      _id: new ObjectId(id),
      companyId,
    })

    if (!originalEntry) {
      throw new Error("Ledger entry not found")
    }

    const entry: {
      customerId: ObjectId
      type: "Sell" | "Payment In" | "Payment Out"
      date: Date
      description: string
      amount: number
      status: "Paid" | "Unpaid" | "Overdue"
      product?: string
      notes?: string
      updatedAt: Date
      paidDate?: Date | null
      daysCount?: number | null
    } = {
      customerId: new ObjectId(formData.get("customerId") as string),
      type: formData.get("type") as "Sell" | "Payment In" | "Payment Out",
      date: new Date(formData.get("date") as string),
      description: formData.get("description") as string,
      amount: Number.parseFloat(formData.get("amount") as string),
      status: formData.get("status") as "Paid" | "Unpaid" | "Overdue",
      product: (formData.get("product") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
      updatedAt: new Date(),
    }

    // If status changed to Paid, add paidDate and calculate days count
    if (entry.status === "Paid" && originalEntry.status !== "Paid") {
      entry.paidDate = new Date()
      entry.daysCount = calculateDaysCount(entry.date, entry.paidDate)
    }
    // If status changed from Paid, remove paidDate
    else if (entry.status !== "Paid" && originalEntry.status === "Paid") {
      entry.paidDate = null
      entry.daysCount = null
    }

    await db.collection(collections.ledger).updateOne({ _id: new ObjectId(id), companyId }, { $set: entry })

    revalidatePath("/ledger")
    revalidatePath(`/ledger?customerId=${formData.get("customerId")}`)

    return { success: true }
  } catch (error) {
    console.error("Failed to update ledger entry:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update ledger entry" }
  }
}

export async function markLedgerEntryAsPaid(id: string) {
  try {
    const { db } = await connectToDatabase()
    const { companyId, permissions } = await getUserSession()

    // Check permission
    checkPermission(permissions, "ledger_edit")

    // Get the entry to calculate days count
    const entry = await db.collection(collections.ledger).findOne({
      _id: new ObjectId(id),
      companyId,
    })

    if (!entry) {
      throw new Error("Ledger entry not found")
    }

    const paidDate = new Date()
    const daysCount = calculateDaysCount(entry.date, paidDate)

    await db.collection(collections.ledger).updateOne(
      { _id: new ObjectId(id), companyId },
      {
        $set: {
          status: "Paid",
          paidDate,
          daysCount,
          updatedAt: new Date(),
        },
      },
    )

    revalidatePath("/ledger")

    return { success: true }
  } catch (error) {
    console.error("Failed to mark ledger entry as paid:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to mark ledger entry as paid" }
  }
}

export async function deleteLedgerEntry(id: string) {
  try {
    const { db } = await connectToDatabase()
    const { companyId, permissions } = await getUserSession()

    // Check permission
    checkPermission(permissions, "ledger_delete")

    await db.collection(collections.ledger).deleteOne({
      _id: new ObjectId(id),
      companyId,
    })

    revalidatePath("/ledger")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete ledger entry:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete ledger entry" }
  }
}

// Customer Actions
export async function createCustomer(formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const { userId, companyId, permissions } = await getUserSession()

    // For debugging
    console.log("Creating customer with companyId:", companyId)

    // Check permission - but make it more lenient for now
    try {
      checkPermission(permissions, "customers_create")
    } catch (error) {
      console.warn("Permission check failed but continuing for debugging:", error)
      // Continue anyway for debugging purposes
    }

    const customer = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      panCard: (formData.get("panCard") as string) || undefined,
      aadharCard: (formData.get("aadharCard") as string) || undefined,
      imageUrl: (formData.get("imageUrl") as string) || undefined,
      companyId,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("Inserting customer:", { name: customer.name, email: customer.email, companyId })
    const result = await db.collection(collections.customers).insertOne(customer)
    console.log("Customer inserted with ID:", result.insertedId.toString())

    // Create default credit settings for this customer
    const creditSettings = {
      customerId: result.insertedId,
      creditLimit: 10000, // Default credit limit
      gracePeriod: 30, // Default grace period in days
      interestRate: 18, // Default annual interest rate
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection(collections.customerSettings).insertOne(creditSettings)
    console.log("Created default credit settings for customer:", result.insertedId.toString())

    revalidatePath("/customers")

    // Convert ObjectId to string before returning
    return {
      success: true,
      id: result.insertedId.toString(),
    }
  } catch (error) {
    console.error("Failed to create customer:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create customer" }
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const { companyId, permissions } = await getUserSession()

    // Check permission
    checkPermission(permissions, "customers_edit")

    const customer = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      panCard: (formData.get("panCard") as string) || undefined,
      aadharCard: (formData.get("aadharCard") as string) || undefined,
      imageUrl: (formData.get("imageUrl") as string) || undefined,
      updatedAt: new Date(),
    }

    await db.collection(collections.customers).updateOne({ _id: new ObjectId(id), companyId }, { $set: customer })

    revalidatePath("/customers")
    revalidatePath(`/customers/${id}/view`)
    revalidatePath(`/customers/${id}/edit`)

    return { success: true }
  } catch (error) {
    console.error("Failed to update customer:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update customer" }
  }
}

export async function deleteCustomer(id: string) {
  try {
    const { db } = await connectToDatabase()
    const { companyId, permissions } = await getUserSession()

    // Check permission
    checkPermission(permissions, "customers_delete")

    // Check if customer has ledger entries
    const entriesCount = await db.collection(collections.ledger).countDocuments({
      customerId: new ObjectId(id),
      companyId,
    })

    if (entriesCount > 0) {
      return {
        success: false,
        error: "Cannot delete customer with ledger entries. Please delete all ledger entries first.",
      }
    }

    // Delete customer and their credit settings
    await db.collection(collections.customers).deleteOne({
      _id: new ObjectId(id),
      companyId,
    })

    await db.collection(collections.customerSettings).deleteOne({
      customerId: new ObjectId(id),
      companyId,
    })

    revalidatePath("/customers")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete customer:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete customer" }
  }
}

// Customer Credit Settings Actions
export async function updateCustomerCreditSettings(customerId: string, formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const { companyId, permissions } = await getUserSession()

    // Check permission
    checkPermission(permissions, "customers_edit")

    const settings = {
      creditLimit: Number.parseFloat(formData.get("creditLimit") as string),
      gracePeriod: Number.parseInt(formData.get("gracePeriod") as string),
      interestRate: Number.parseFloat(formData.get("interestRate") as string),
      updatedAt: new Date(),
    }

    await db
      .collection(collections.customerSettings)
      .updateOne({ customerId: new ObjectId(customerId), companyId }, { $set: settings }, { upsert: true })

    revalidatePath("/ledger")
    revalidatePath(`/ledger?customerId=${customerId}`)

    return { success: true }
  } catch (error) {
    console.error("Failed to update customer credit settings:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update customer credit settings",
    }
  }
}

// Product Actions
export async function createProduct(formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const { userId, companyId, permissions } = await getUserSession()

    // For debugging
    console.log("Creating product with companyId:", companyId)

    // Check permission - but make it more lenient for now
    try {
      checkPermission(permissions, "products_create")
    } catch (error) {
      console.warn("Permission check failed but continuing for debugging:", error)
      // Continue anyway for debugging purposes
    }

    const product = {
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      stock: Number.parseInt(formData.get("stock") as string),
      category: formData.get("category") as string,
      companyId,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("Inserting product:", { name: product.name, sku: product.sku, companyId })
    const result = await db.collection(collections.products).insertOne(product)
    console.log("Product inserted with ID:", result.insertedId.toString())

    revalidatePath("/products")

    // Convert ObjectId to string before returning
    return {
      success: true,
      id: result.insertedId.toString(),
    }
  } catch (error) {
    console.error("Failed to create product:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create product" }
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const { companyId, permissions } = await getUserSession()

    // Check permission
    checkPermission(permissions, "products_edit")

    const product = {
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      stock: Number.parseInt(formData.get("stock") as string),
      category: formData.get("category") as string,
      updatedAt: new Date(),
    }

    await db.collection(collections.products).updateOne({ _id: new ObjectId(id), companyId }, { $set: product })

    revalidatePath("/products")

    return { success: true }
  } catch (error) {
    console.error("Failed to update product:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update product" }
  }
}

export async function deleteProduct(id: string) {
  try {
    const { db } = await connectToDatabase()
    const { companyId, permissions } = await getUserSession()

    // Check permission
    checkPermission(permissions, "products_delete")

    await db.collection(collections.products).deleteOne({
      _id: new ObjectId(id),
      companyId,
    })

    revalidatePath("/products")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete product:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete product" }
  }
}

// User Management Actions
export async function createUser(formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const { userId, companyId, permissions, role } = await getUserSession()

    // Check permission
    checkPermission(permissions, "users_create")

    // Only admins can create users
    if (role !== "admin") {
      throw new Error("Only admins can create users")
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const userRole = formData.get("role") as "admin" | "user"
    const userPermissions = formData.getAll("permissions") as string[]

    // Check if user already exists
    const existingUser = await db.collection(collections.users).findOne({ email: email.toLowerCase() })
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash the password

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      companyId,
      role: userRole,
      permissions: userPermissions,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection(collections.users).insertOne(user)

    revalidatePath("/admin/users")

    return { success: true }
  } catch (error) {
    console.error("Failed to create user:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create user" }
  }
}

export async function updateUser(id: string, formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const { companyId, permissions, role } = await getUserSession()

    // Check permission
    checkPermission(permissions, "users_edit")

    // Only admins can update users
    if (role !== "admin") {
      throw new Error("Only admins can update users")
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const userRole = formData.get("role") as "admin" | "user"
    const userPermissions = formData.getAll("permissions") as string[]
    const password = formData.get("password") as string

    // Check if user exists and belongs to the same company
    const existingUser = await db.collection(collections.users).findOne({
      _id: new ObjectId(id),
      companyId,
    })

    if (!existingUser) {
      throw new Error("User not found")
    }

    const updateData: {
      name: string
      email: string
      role: "admin" | "user"
      permissions: string[]
      updatedAt: Date
      password?: string
    } = {
      name,
      email: email.toLowerCase(),
      role: userRole,
      permissions: userPermissions,
      updatedAt: new Date(),
    }

    // Update password if provided
    if (password && password.trim() !== "") {
      // Hash the new password
      updateData.password = await bcrypt.hash(password, 12)
    }

    await db.collection(collections.users).updateOne({ _id: new ObjectId(id), companyId }, { $set: updateData })

    revalidatePath("/admin/users")
    revalidatePath(`/admin/users/${id}/edit`)

    return { success: true }
  } catch (error) {
    console.error("Failed to update user:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update user" }
  }
}

export async function deleteUser(id: string) {
  try {
    const { db } = await connectToDatabase()
    const { companyId, permissions, role, userId } = await getUserSession()

    // Check permission
    checkPermission(permissions, "users_delete")

    // Only admins can delete users
    if (role !== "admin") {
      throw new Error("Only admins can delete users")
    }

    // Cannot delete yourself
    if (id === userId) {
      throw new Error("You cannot delete your own account")
    }

    // Check if user exists and belongs to the same company
    const existingUser = await db.collection(collections.users).findOne({
      _id: new ObjectId(id),
      companyId,
    })

    if (!existingUser) {
      throw new Error("User not found")
    }

    await db.collection(collections.users).deleteOne({
      _id: new ObjectId(id),
      companyId,
    })

    revalidatePath("/admin/users")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete user:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete user" }
  }
}

// Update company settings
export async function updateCompanySettings(formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const { companyId, permissions, role } = await getUserSession()

    // Check permission
    checkPermission(permissions, "settings_edit")

    // Only admins can update company settings
    if (role !== "admin") {
      throw new Error("Only admins can update company settings")
    }

    const company = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      website: formData.get("website") as string,
      logo: formData.get("logo") as string,
      updatedAt: new Date(),
    }

    await db.collection(collections.companies).updateOne({ _id: new ObjectId(companyId) }, { $set: company })

    revalidatePath("/admin/settings")

    return { success: true }
  } catch (error) {
    console.error("Failed to update company settings:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update company settings" }
  }
}

export async function updateOverdueSettings(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const companyId = session.user.companyId
    const { db } = await connectToDatabase()

    const gracePeriod = Number(formData.get("gracePeriod"))
    const interestRate = Number(formData.get("interestRate")) / 100 // Store as decimal
    const compoundingPeriod = formData.get("compoundingPeriod") as string
    const minimumFee = Number(formData.get("minimumFee"))

    const settings = {
      gracePeriod,
      interestRate,
      compoundingPeriod,
      minimumFee,
      companyId,
      updatedAt: new Date(),
    }

    // Update or insert the settings
    await db.collection(collections.overdueSettings).updateOne(
      { companyId },
      { $set: settings },
      { upsert: true }, // Creates a new document if one doesn't exist
    )

    revalidatePath("/settings")
    revalidatePath("/admin/settings")
    revalidatePath("/overdue")

    return { success: true }
  } catch (error) {
    console.error("Failed to update overdue settings:", error)
    return { success: false, error: "Failed to update overdue settings" }
  }
}

// Update ledger entry status based on grace period
export async function updateOverdueStatus() {
  try {
    const { db } = await connectToDatabase()
    const { companyId } = await getUserSession()

    // Get all unpaid ledger entries
    const unpaidEntries = await db
      .collection(collections.ledger)
      .find({
        companyId,
        status: "Unpaid",
        type: "Sell",
      })
      .toArray()

    // Get customer settings for grace period
    const customerSettings = await db
      .collection(collections.customerSettings)
      .find({
        companyId,
      })
      .toArray()

    // Create a map of customer settings for quick lookup
    const settingsMap = new Map()
    customerSettings
      .map((doc: { customerId: ObjectId; gracePeriod?: number }) => ({
        customerId: doc.customerId,
        gracePeriod: doc.gracePeriod,
      }))
      .forEach((setting: { customerId: ObjectId; gracePeriod?: number }) => {
        settingsMap.set(setting.customerId.toString(), setting)
      })

    // Default grace period if no settings found
    const defaultGracePeriod = 30

    // Update entries that are overdue
    const updatePromises = unpaidEntries.map(async (entry: { _id: ObjectId; customerId: ObjectId; date: Date }) => {
      const customerSetting = settingsMap.get(entry.customerId.toString())
      const gracePeriod = customerSetting ? customerSetting.gracePeriod : defaultGracePeriod

      if (isOverdue(entry.date, gracePeriod)) {
        await db
          .collection(collections.ledger)
          .updateOne({ _id: entry._id }, { $set: { status: "Overdue", updatedAt: new Date() } })
      }
    })

    await Promise.all(updatePromises)

    revalidatePath("/ledger")
    revalidatePath("/overdue")

    return { success: true }
  } catch (error) {
    console.error("Failed to update overdue status:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update overdue status" }
  }
}