import { MongoClient, type ObjectId } from "mongodb"

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || ""
const MONGODB_DB = process.env.MONGODB_DB || "product_ledger"

// Cache the MongoDB connection
let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // If no cached connection, create a new one
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }

  try {
    const client = new MongoClient(MONGODB_URI)

    await client.connect()
    const db = client.db(MONGODB_DB)

    // Cache the connection
    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw new Error("Could not connect to database")
  }
}

// Define collection names
export const collections = {
  ledger: "ledger",
  products: "products",
  customers: "customers",
  customerSettings: "customerSettings",
  users: "users",
  passwordResets: "passwordResets",
  permissions: "permissions",
  companies: "companies",
  overdueSettings: "overdueSettings",
  statusChangeLogs: "statusChangeLogs",
}

// Import permissions from separate file
import { availablePermissions } from "./permissions"
export { availablePermissions }

// Schema for a ledger entry
export interface LedgerEntry {
  _id?: ObjectId
  customerId: ObjectId
  type: "Sell" | "Payment In" | "Payment Out" | "Partial Payment"
  invoiceNumber: string
  amount: number
  date: Date
  dueDate?: Date
  product?: string
  description: string
  status: "Paid" | "Unpaid" | "Overdue"
  paidDate?: Date
  daysCount?: number
  daysElapsed?: number // Days since due date for unpaid/overdue
  overdueStartDate?: Date // When the payment became overdue
  accruedInterest?: number // Interest accumulated due to being overdue
  originalCreditLimit?: number // Store original credit limit before transaction
  notes?: string
  createdAt: Date
  updatedAt: Date
  companyId: string
  createdBy: string
  // Partial payment fields
  partiallyPaid?: boolean
  partialPaymentAmount?: number
  partialPaymentDate?: Date
  remainingAmount?: number
  paidInterest?: number
  relatedEntryId?: ObjectId
  partialPaymentId?: ObjectId
}

// Schema for a product
export interface Product {
  _id?: ObjectId
  name: string
  sku: string
  description?: string
  price: number
  stock: number
  category: string
  createdAt: Date
  updatedAt: Date
  companyId: string
  createdBy: string
}

// Schema for a customer
export interface Customer {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  address: string
  panCard?: string
  aadharCard?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
  companyId: string
  createdBy: string
}

// Schema for customer credit settings
export interface CustomerCreditSettings {
  _id?: ObjectId
  customerId: ObjectId
  creditLimit: number
  gracePeriod: number
  interestRate: number
  companyId: string
  createdAt: Date
  updatedAt: Date
}

// User schema
export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  companyId: string
  role: "admin" | "user"
  permissions: string[]
  createdAt: Date
  updatedAt: Date
  createdBy?: string
}

// Company schema
export interface Company {
  _id?: ObjectId
  name: string
  address?: string
  phone?: string
  email?: string
  website?: string
  logo?: string
  createdAt: Date
  updatedAt: Date
}

// Permission schema
export interface Permission {
  _id?: ObjectId
  name: string
  description: string
  module: "ledger" | "products" | "customers" | "users" | "reports" | "settings"
  action: "view" | "create" | "edit" | "delete"
}

// Password reset schema
export interface PasswordReset {
  _id?: ObjectId
  userId: ObjectId
  token: string
  expires: Date
  createdAt: Date
}

// Status change log schema
export interface StatusChangeLog {
  _id?: ObjectId
  entryId: ObjectId
  customerId: ObjectId
  oldStatus: "Paid" | "Unpaid" | "Overdue"
  newStatus: "Paid" | "Unpaid" | "Overdue"
  reason: string
  interestApplied?: number
  creditLimitChange?: number
  companyId: string
  createdAt: Date
  createdBy: string
}

// Generate a 6-digit invoice number
export function generateInvoiceNumber(): string {
  // Generate a random 6-digit number
  const randomNum = Math.floor(100000 + Math.random() * 900000)
  return randomNum.toString()
}

// Calculate days elapsed since due date (for unpaid entries)
export function calculateDaysElapsed(dueDate: Date): number {
  const today = new Date()
  const due = new Date(dueDate)
  const daysDifference = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, daysDifference)
}

// Calculate days overdue (days past grace period)
export function calculateDaysOverdue(dueDate: Date, gracePeriod: number): number {
  const daysElapsed = calculateDaysElapsed(dueDate)
  return Math.max(0, daysElapsed - gracePeriod)
}

// Calculate interest based on days overdue
export function calculateInterest(amount: number, daysOverdue: number, interestRate: number): number {
  if (daysOverdue <= 0) return 0
  
  const dailyRate = interestRate / 365 / 100
  return amount * dailyRate * daysOverdue
}

// Check if a payment should be marked as overdue
export function shouldBeOverdue(dueDate: Date, status: string, gracePeriod: number): boolean {
  if (status === "Paid") return false
  const daysElapsed = calculateDaysElapsed(dueDate)
  return daysElapsed > gracePeriod
}

// Update entry status based on current date and grace period
export function updateEntryStatus(entry: LedgerEntry, gracePeriod: number): {
  status: "Paid" | "Unpaid" | "Overdue",
  overdueStartDate?: Date,
  daysElapsed: number,
  accruedInterest: number
} {
  if (entry.status === "Paid") {
    return {
      status: "Paid",
      daysElapsed: 0,
      accruedInterest: 0
    }
  }

  if (!entry.dueDate) {
    return {
      status: entry.status,
      daysElapsed: 0,
      accruedInterest: entry.accruedInterest || 0
    }
  }

  const daysElapsed = calculateDaysElapsed(entry.dueDate)
  const daysOverdue = calculateDaysOverdue(entry.dueDate, gracePeriod)
  
  if (daysOverdue > 0) {
    // Should be overdue
    const overdueStartDate = entry.overdueStartDate || (() => {
      const start = new Date(entry.dueDate)
      start.setDate(start.getDate() + gracePeriod)
      return start
    })()
    
    // Calculate interest from CustomerCreditSettings - will be passed as parameter
    const accruedInterest = calculateInterest(entry.amount, daysOverdue, 18) // Default rate, should be passed from settings
    
    return {
      status: "Overdue",
      overdueStartDate,
      daysElapsed,
      accruedInterest
    }
  } else {
    // Still unpaid but within grace period
    return {
      status: "Unpaid",
      daysElapsed,
      accruedInterest: 0
    }
  }
}

// Calculate days overdue (legacy - for backward compatibility)
export function calculateDaysOldOverdue(date: Date, gracePeriod: number): number {
  const today = new Date()
  const creationDate = new Date(date)
  const daysDifference = Math.floor((today.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24))

  return Math.max(0, daysDifference - gracePeriod)
}

// Calculate days count (for paid entries, it's the days until payment)
export function calculateDaysCount(date: Date, paidDate?: Date): number {
  const startDate = new Date(date)
  const endDate = paidDate ? new Date(paidDate) : new Date()

  return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
}

// Check if a ledger entry is overdue (legacy - for backward compatibility)
export function isOverdue(date: Date, gracePeriod: number): boolean {
  const daysOverdue = calculateDaysOldOverdue(date, gracePeriod)
  return daysOverdue > 0
}

// Calculate balance for a ledger entry with enhanced overdue logic
export function calculateBalance(entry: any, interestRate: number, gracePeriod: number): number {
  if (entry.status === "Paid") return 0

  // For partially paid entries, use the remaining amount
  const amount = entry.partiallyPaid ? entry.remainingAmount : entry.amount

  if (entry.status === "Overdue" && entry.dueDate) {
    const daysOverdue = calculateDaysOverdue(entry.dueDate, gracePeriod)
    const interest = calculateInterest(amount, daysOverdue, interestRate)
    return amount + interest
  }

  return amount
}

// Calculate total balance for a customer
export function calculateTotalBalance(entries: any[], interestRate: number, gracePeriod: number): number {
  return entries.reduce((total, entry) => {
    return total + calculateBalance(entry, interestRate, gracePeriod)
  }, 0)
}

// Calculate total credit used by a customer
export function calculateCreditUsed(entries: any[]): number {
  let creditUsed = 0

  entries.forEach((entry) => {
    if (entry.status !== "Paid") {
      if (entry.type === "Sell") {
        // For partially paid entries, use the remaining amount
        const amount = entry.partiallyPaid ? entry.remainingAmount : entry.amount
        creditUsed += amount
      } else if (entry.type === "Payment In") {
        creditUsed -= entry.amount
      }
    }
  })

  return Math.max(0, creditUsed)
}

// Calculate available credit for a customer
export function calculateAvailableCredit(creditLimit: number, entries: any[]): number {
  const creditUsed = calculateCreditUsed(entries)
  return Math.max(0, creditLimit - creditUsed)
}

// Log status change for audit trail
export async function logStatusChange(
  db: any,
  entryId: ObjectId,
  customerId: ObjectId,
  oldStatus: "Paid" | "Unpaid" | "Overdue",
  newStatus: "Paid" | "Unpaid" | "Overdue",
  reason: string,
  companyId: string,
  createdBy: string,
  interestApplied?: number,
  creditLimitChange?: number
): Promise<void> {
  const logEntry: StatusChangeLog = {
    entryId,
    customerId,
    oldStatus,
    newStatus,
    reason,
    interestApplied,
    creditLimitChange,
    companyId,
    createdAt: new Date(),
    createdBy
  }

  try {
    await db.collection(collections.statusChangeLogs).insertOne(logEntry)
  } catch (error) {
    console.error("Failed to log status change:", error)
    // Don't throw error to avoid disrupting main operation
  }
}