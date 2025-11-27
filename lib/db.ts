import { PrismaClient } from "@prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL ?? ""
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalThis.prisma = db

// Export Prisma types
export type {
  LedgerEntry,
  Product,
  Customer,
  CustomerCreditSettings,
  User,
  Company,
  Permission,
  PasswordReset,
  VerificationToken
} from "@prisma/client"

// Available permissions for the application
export const availablePermissions = [
  { name: "dashboard_view", description: "View Dashboard", module: "dashboard", action: "view" },
  { name: "ledger_view", description: "View Ledger", module: "ledger", action: "view" },
  { name: "ledger_create", description: "Create Ledger Entry", module: "ledger", action: "create" },
  { name: "ledger_edit", description: "Edit Ledger Entry", module: "ledger", action: "edit" },
  { name: "ledger_delete", description: "Delete Ledger Entry", module: "ledger", action: "delete" },
  { name: "products_view", description: "View Products", module: "products", action: "view" },
  { name: "products_create", description: "Create Product", module: "products", action: "create" },
  { name: "products_edit", description: "Edit Product", module: "products", action: "edit" },
  { name: "products_delete", description: "Delete Product", module: "products", action: "delete" },
  { name: "customers_view", description: "View Customers", module: "customers", action: "view" },
  { name: "customers_create", description: "Create Customer", module: "customers", action: "create" },
  { name: "customers_edit", description: "Edit Customer", module: "customers", action: "edit" },
  { name: "customers_delete", description: "Delete Customer", module: "customers", action: "delete" },
  { name: "users_view", description: "View Users", module: "users", action: "view" },
  { name: "users_create", description: "Create User", module: "users", action: "create" },
  { name: "users_edit", description: "Edit User", module: "users", action: "edit" },
  { name: "users_delete", description: "Delete User", module: "users", action: "delete" },
  { name: "reports_view", description: "View Reports", module: "reports", action: "view" },
  { name: "settings_view", description: "View Settings", module: "settings", action: "view" },
  { name: "settings_edit", description: "Edit Settings", module: "settings", action: "edit" },
]

// Generate a 6-digit invoice number
export function generateInvoiceNumber(): string {
  // Generate a random 6-digit number
  const randomNum = Math.floor(100000 + Math.random() * 900000)
  return randomNum.toString()
}

// Calculate days overdue
export function calculateDaysOverdue(date: Date, gracePeriod: number): number {
  const today = new Date()
  const creationDate = new Date(date)
  const daysDifference = Math.floor((today.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24))

  return Math.max(0, daysDifference - gracePeriod)
}

// Calculate interest
export function calculateInterest(amount: number, daysOverdue: number, interestRate: number): number {
  if (daysOverdue <= 0) return 0

  const dailyRate = interestRate / 365 / 100
  return amount * dailyRate * daysOverdue
}

// Calculate days count (for paid entries, it's the days until payment)
export function calculateDaysCount(date: Date, paidDate?: Date | null): number {
  const startDate = new Date(date)
  const endDate = paidDate ? new Date(paidDate) : new Date()

  return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
}

// Check if a ledger entry is overdue
export function isOverdue(date: Date, gracePeriod: number): boolean {
  const daysOverdue = calculateDaysOverdue(date, gracePeriod)
  return daysOverdue > 0
}

// Calculate balance for a ledger entry
export function calculateBalance(entry: any, interestRate: number, gracePeriod: number): number {
  if (entry.status === "Paid") return 0

  // For partially paid entries, use the remaining amount
  const amount = entry.partiallyPaid ? entry.remainingAmount : entry.amount

  if (entry.status === "Overdue") {
    const daysOverdue = calculateDaysOverdue(entry.date, gracePeriod)
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