"use server"

import { revalidatePath } from "next/cache"
import { db, calculateDaysCount, isOverdue } from "@/lib/db"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function getCurrentUserPermissions() {
  const session = await auth();
  if (!session?.user) return { role: null, permissions: [] };
  return {
    role: session.user.role,
    permissions: session.user.permissions || [],
  };
}
// Helper to get user session data
async function getUserSession() {
  const session = await auth()
  if (!session?.user?.id) {
    return null // Callers will need to check for null
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
  const session = await auth();
  if (!session?.user?.companyId) return null;

  const company = await db.company.findUnique({
    where: { id: session.user.companyId },
  });

  return company?.name || null;
}
// Check if user has permission
function checkPermission(permissions: string[], requiredPermission: string): { allowed: boolean; message?: string } {
  console.log(`Checking permission: ${requiredPermission}, User has: ${permissions.join(", ")}`)

  if (!permissions.length || !permissions.includes(requiredPermission)) {
    console.log(`Permission denied: ${requiredPermission}`)
    return { 
      allowed: false, 
      message: `You don't have permission to perform this action. Required: ${requiredPermission}` 
    }
  }

  console.log(`Permission granted: ${requiredPermission}`)
  return { allowed: true }
}

// Ledger Actions
export async function createLedgerEntry(formData: FormData) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { userId, companyId, permissions } = session

    // Check permission
    const permCheck = checkPermission(permissions, "ledger_create")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    // Generate invoice number
    const invoiceNumber = Math.floor(100000 + Math.random() * 900000).toString()

    const customerId = formData.get("customerId") as string

<<<<<<< HEAD
    const type = formData.get("type") as string
    const status = type === "Sell" ? "Unpaid" : "Paid"
    const date = new Date(formData.get("date") as string)
    
    let paidDate: Date | null = null
    if (status === "Paid") {
      paidDate = new Date()
=======
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
>>>>>>> 5d2afdf1da669018d0f5aae77b62470d7f05bce3
    }

    const entry = await db.ledgerEntry.create({
      data: {
        customerId,
        type,
        invoiceNumber,
        date,
        description: formData.get("description") as string,
        amount: Number.parseFloat(formData.get("amount") as string),
        status,
        product: (formData.get("product") as string) || undefined,
        notes: (formData.get("notes") as string) || undefined,
        daysCount: 0,
        companyId,
        createdBy: userId,
        paidDate,
      }
    })

    console.log("Ledger entry created with ID:", entry.id)

    revalidatePath("/ledger")
    revalidatePath(`/ledger?customerId=${customerId}`)

    return {
      success: true,
      id: customerId,
      message: "Ledger entry created successfully"
    }
  } catch (error) {
    console.error("Failed to create ledger entry:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create ledger entry" }
  }
}

export async function updateLedgerEntry(id: string, formData: FormData) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { companyId, permissions } = session

    // Check permission
    const permCheck = checkPermission(permissions, "ledger_edit")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    // Get the original entry to check if status changed
    const originalEntry = await db.ledgerEntry.findUnique({
      where: { id, companyId },
    })

    if (!originalEntry) {
      throw new Error("Ledger entry not found")
    }

    const status = formData.get("status") as string
    const date = new Date(formData.get("date") as string)
    
    let paidDate = originalEntry.paidDate
    let daysCount = originalEntry.daysCount

    // If status changed to Paid, add paidDate and calculate days count
    if (status === "Paid" && originalEntry.status !== "Paid") {
      paidDate = new Date()
      daysCount = calculateDaysCount(date, paidDate)
    }
    // If status changed from Paid, remove paidDate
    else if (status !== "Paid" && originalEntry.status === "Paid") {
      paidDate = null
      daysCount = null
    }

    await db.ledgerEntry.update({
      where: { id },
      data: {
        customerId: formData.get("customerId") as string,
        type: formData.get("type") as string,
        date,
        description: formData.get("description") as string,
        amount: Number.parseFloat(formData.get("amount") as string),
        status,
        product: (formData.get("product") as string) || undefined,
        notes: (formData.get("notes") as string) || undefined,
        paidDate,
        daysCount,
      }
    })

    revalidatePath("/ledger")
    revalidatePath(`/ledger?customerId=${formData.get("customerId")}`)

    return { success: true, message: "Ledger entry updated successfully" }
  } catch (error) {
    console.error("Failed to update ledger entry:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update ledger entry" }
  }
}

export async function markLedgerEntryAsPaid(id: string) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { companyId, permissions } = session

    // Check permission
    const permCheck = checkPermission(permissions, "ledger_edit")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    // Get the entry to calculate days count
    const entry = await db.ledgerEntry.findUnique({
      where: { id, companyId },
    })

    if (!entry) {
      return { success: false, error: "Ledger entry not found" }
    }

    const paidDate = new Date()
    const daysCount = calculateDaysCount(entry.date, paidDate)

    await db.ledgerEntry.update({
      where: { id },
      data: {
        status: "Paid",
        paidDate,
        daysCount,
      }
    })

    revalidatePath("/ledger")

    return { success: true }
  } catch (error) {
    console.error("Failed to mark ledger entry as paid:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to mark ledger entry as paid" }
  }
}

export async function deleteLedgerEntry(id: string) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { companyId, permissions } = session

    // Check permission
    const permCheck = checkPermission(permissions, "ledger_delete")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    await db.ledgerEntry.delete({
      where: { id, companyId },
    })

    revalidatePath("/ledger")

    return { success: true, message: "Ledger entry deleted successfully" }
  } catch (error) {
    console.error("Failed to delete ledger entry:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete ledger entry" }
  }
}

// Customer Actions
export async function createCustomer(formData: FormData) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { userId, companyId, permissions } = session

    console.log("Creating customer with companyId:", companyId)

    // Check permission
    const permCheck = checkPermission(permissions, "customers_create")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    const customer = await db.customer.create({
      data: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        panCard: (formData.get("panCard") as string) || undefined,
        aadharCard: (formData.get("aadharCard") as string) || undefined,
        imageUrl: (formData.get("imageUrl") as string) || undefined,
        companyId,
        createdBy: userId,
      }
    })

    console.log("Customer inserted with ID:", customer.id)

    // Create default credit settings for this customer
    await db.customerCreditSettings.create({
      data: {
        customerId: customer.id,
        creditLimit: 10000, // Default credit limit
        gracePeriod: 30, // Default grace period in days
        interestRate: 18, // Default annual interest rate
        companyId,
      }
    })
    
    console.log("Created default credit settings for customer:", customer.id)

    revalidatePath("/customers")

    return {
      success: true,
      id: customer.id,
      message: "Customer created successfully"
    }
  } catch (error) {
    console.error("Failed to create customer:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create customer" }
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { companyId, permissions } = session

    // Check permission
    const permCheck = checkPermission(permissions, "customers_edit")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    await db.customer.update({
      where: { id, companyId },
      data: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        panCard: (formData.get("panCard") as string) || undefined,
        aadharCard: (formData.get("aadharCard") as string) || undefined,
        imageUrl: (formData.get("imageUrl") as string) || undefined,
      }
    })

    revalidatePath("/customers")
    revalidatePath(`/customers/${id}/view`)
    revalidatePath(`/customers/${id}/edit`)

    return { success: true, message: "Customer updated successfully" }
  } catch (error) {
    console.error("Failed to update customer:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update customer" }
  }
}

export async function deleteCustomer(id: string) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { companyId, permissions } = session

    // Check permission
    const permCheck = checkPermission(permissions, "customers_delete")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    // Check if customer has ledger entries
    const entriesCount = await db.ledgerEntry.count({
      where: {
        customerId: id,
        companyId,
      }
    })

    if (entriesCount > 0) {
      return {
        success: false,
        error: "Cannot delete customer with ledger entries. Please delete all ledger entries first.",
      }
    }

    // Delete customer and their credit settings
    // Prisma handles cascade delete if configured, but let's be explicit or rely on schema
    // Schema doesn't seem to have cascade delete on relations explicitly defined in the snippet I saw, 
    // but usually one deletes dependent records first.
    
    await db.customerCreditSettings.deleteMany({
      where: { customerId: id, companyId }
    })

    await db.customer.delete({
      where: { id, companyId }
    })

    revalidatePath("/customers")

    return { success: true, message: "Customer deleted successfully" }
  } catch (error) {
    console.error("Failed to delete customer:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete customer" }
  }
}

// Customer Credit Settings Actions
export async function updateCustomerCreditSettings(customerId: string, formData: FormData) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { companyId, permissions } = session

    // Check permission
    const permCheck = checkPermission(permissions, "customers_edit")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    const creditLimit = Number.parseFloat(formData.get("creditLimit") as string)
    const gracePeriod = Number.parseInt(formData.get("gracePeriod") as string)
    const interestRate = Number.parseFloat(formData.get("interestRate") as string)

    // Find existing settings to get ID for upsert, or just use findFirst
    const existingSettings = await db.customerCreditSettings.findFirst({
      where: { customerId, companyId }
    })

    if (existingSettings) {
      await db.customerCreditSettings.update({
        where: { id: existingSettings.id },
        data: { creditLimit, gracePeriod, interestRate }
      })
    } else {
      await db.customerCreditSettings.create({
        data: {
          customerId,
          companyId,
          creditLimit,
          gracePeriod,
          interestRate
        }
      })
    }

    revalidatePath("/ledger")
    revalidatePath(`/ledger?customerId=${customerId}`)

    return { success: true, message: "Credit settings updated successfully" }
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
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { userId, companyId, permissions } = session

    // For debugging
    console.log("Creating product with companyId:", companyId)

    // Check permission
    const permCheck = checkPermission(permissions, "products_create")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    const product = await db.product.create({
      data: {
        name: formData.get("name") as string,
        sku: formData.get("sku") as string,
        description: formData.get("description") as string,
        price: Number.parseFloat(formData.get("price") as string),
        stock: Number.parseInt(formData.get("stock") as string),
        category: formData.get("category") as string,
        companyId,
        createdBy: userId,
      }
    })

    console.log("Product inserted with ID:", product.id)

    revalidatePath("/products")

    return {
      success: true,
      id: product.id,
      message: "Product created successfully"
    }
  } catch (error) {
    console.error("Failed to create product:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create product" }
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { companyId, permissions } = session

    // Check permission
    const permCheck = checkPermission(permissions, "products_edit")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    await db.product.update({
      where: { id, companyId },
      data: {
        name: formData.get("name") as string,
        sku: formData.get("sku") as string,
        description: formData.get("description") as string,
        price: Number.parseFloat(formData.get("price") as string),
        stock: Number.parseInt(formData.get("stock") as string),
        category: formData.get("category") as string,
      }
    })

    revalidatePath("/products")

    return { success: true, message: "Product updated successfully" }
  } catch (error) {
    console.error("Failed to update product:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update product" }
  }
}

export async function deleteProduct(id: string) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { companyId, permissions } = session

    // Check permission
    const permCheck = checkPermission(permissions, "products_delete")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    await db.product.delete({
      where: { id, companyId }
    })

    revalidatePath("/products")

    return { success: true, message: "Product deleted successfully" }
  } catch (error) {
    console.error("Failed to delete product:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete product" }
  }
}

// User Management Actions
export async function createUser(formData: FormData) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { userId, companyId, permissions, role } = session

    // Check permission
    const permCheck = checkPermission(permissions, "users_create")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    // Only admins can create users
    if (role !== "admin") {
      return { success: false, error: "Only admins can create users", unauthorized: true }
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const userRole = formData.get("role") as string
    const userPermissions = formData.getAll("permissions") as string[]

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existingUser) {
      return { success: false, error: "User with this email already exists" }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        companyId,
        role: userRole,
        permissions: userPermissions,
        createdBy: userId,
      }
    })

    revalidatePath("/admin/users")

    return { success: true, message: "User created successfully" }
  } catch (error) {
    console.error("Failed to create user:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create user" }
  }
}

export async function updateUser(id: string, formData: FormData) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { companyId, permissions, role } = session

    // Check permission
    const permCheck = checkPermission(permissions, "users_edit")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    // Only admins can update users
    if (role !== "admin") {
      return { success: false, error: "Only admins can update users", unauthorized: true }
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const userRole = formData.get("role") as string
    const userPermissions = formData.getAll("permissions") as string[]
    const password = formData.get("password") as string

    // Check if user exists and belongs to the same company
    const existingUser = await db.user.findUnique({
      where: { id, companyId }
    })

    if (!existingUser) {
      return { success: false, error: "User not found" }
    }

    const updateData: any = {
      name,
      email: email.toLowerCase(),
      role: userRole,
      permissions: userPermissions,
    }

    // Update password if provided
    if (password && password.trim() !== "") {
      // Hash the new password
      updateData.password = await bcrypt.hash(password, 12)
    }

    await db.user.update({
      where: { id },
      data: updateData
    })

    revalidatePath("/admin/users")
    revalidatePath(`/admin/users/${id}/edit`)

    return { success: true, message: "User updated successfully" }
  } catch (error) {
    console.error("Failed to update user:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update user" }
  }
}

export async function deleteUser(id: string) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { companyId, permissions, role, userId } = session

    // Check permission
    const permCheck = checkPermission(permissions, "users_delete")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    // Only admins can delete users
    if (role !== "admin") {
      return { success: false, error: "Only admins can delete users", unauthorized: true }
    }

    // Cannot delete yourself
    if (id === userId) {
      return { success: false, error: "You cannot delete your own account" }
    }

    // Check if user exists and belongs to the same company
    const existingUser = await db.user.findUnique({
      where: { id, companyId }
    })

    if (!existingUser) {
      return { success: false, error: "User not found" }
    }

    await db.user.delete({
      where: { id }
    })

    revalidatePath("/admin/users")

    return { success: true, message: "User deleted successfully" }
  } catch (error) {
    console.error("Failed to delete user:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete user" }
  }
}

// Update company settings
export async function updateCompanySettings(formData: FormData) {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { companyId, permissions, role } = session

    // Check permission
    const permCheck = checkPermission(permissions, "settings_edit")
    if (!permCheck.allowed) {
      return { success: false, error: permCheck.message, unauthorized: true }
    }

    // Only admins can update company settings
    if (role !== "admin") {
      return { success: false, error: "Only admins can update company settings", unauthorized: true }
    }

    await db.company.update({
      where: { id: companyId },
      data: {
        name: formData.get("name") as string,
        address: formData.get("address") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        website: formData.get("website") as string,
        logo: formData.get("logo") as string,
      }
    })

    revalidatePath("/admin/settings")

    return { success: true, message: "Company settings updated successfully" }
  } catch (error) {
    console.error("Failed to update company settings:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update company settings" }
  }
}

export async function updateOverdueSettings(formData: FormData) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const companyId = session.user.companyId as string
    
    const gracePeriod = Number(formData.get("gracePeriod"))
    const interestRate = Number(formData.get("interestRate")) / 100 // Store as decimal
    const compoundingPeriod = formData.get("compoundingPeriod") as string
    const minimumFee = Number(formData.get("minimumFee"))

    // Update or insert the settings
    await db.overdueSettings.upsert({
      where: { companyId },
      update: {
        gracePeriod,
        interestRate,
        compoundingPeriod,
        minimumFee,
      },
      create: {
        companyId,
        gracePeriod,
        interestRate,
        compoundingPeriod,
        minimumFee,
      }
    })

    revalidatePath("/settings")
    revalidatePath("/admin/settings")
    revalidatePath("/overdue")

    return { success: true, message: "Overdue settings updated successfully" }
  } catch (error) {
    console.error("Failed to update overdue settings:", error)
    return { success: false, error: "Failed to update overdue settings" }
  }
}

// Update ledger entry status based on grace period
export async function updateOverdueStatus() {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, error: "Not authenticated", unauthorized: true }
    }
    const { companyId } = session

    // Get all unpaid ledger entries
    const unpaidEntries = await db.ledgerEntry.findMany({
      where: {
        companyId,
        status: "Unpaid",
        type: "Sell",
      }
    })

    // Get customer settings for grace period
    const customerSettings = await db.customerCreditSettings.findMany({
      where: { companyId }
    })

    // Create a map of customer settings for quick lookup
    const settingsMap = new Map()
    customerSettings.forEach((setting: any) => {
      settingsMap.set(setting.customerId, setting)
    })

    // Default grace period if no settings found
    const defaultGracePeriod = 30

    // Update entries that are overdue
    const updatePromises = unpaidEntries.map(async (entry: any) => {
      const customerSetting = settingsMap.get(entry.customerId)
      const gracePeriod = customerSetting ? customerSetting.gracePeriod : defaultGracePeriod

      if (isOverdue(entry.date, gracePeriod)) {
        await db.ledgerEntry.update({
          where: { id: entry.id },
          data: { status: "Overdue" }
        })
      }
    })

    await Promise.all(updatePromises)

    revalidatePath("/ledger")
    revalidatePath("/overdue")

    return { success: true, message: "Payment recorded successfully" }
  } catch (error) {
    console.error("Failed to update overdue status:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update overdue status" }
  }
}