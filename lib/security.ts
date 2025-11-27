/**
 * Security utilities for input validation and sanitization
 * Protects against XSS, SQL injection, and other common attacks
 */

import { z } from "zod"

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return ""
  
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers like onclick=
    .trim()
    .slice(0, 10000) // Limit length to prevent DoS
}

/**
 * Sanitize HTML input (for rich text fields)
 */
export function sanitizeHTML(input: string): string {
  if (typeof input !== "string") return ""
  
  // Allow only safe HTML tags
  const allowedTags = ["p", "br", "strong", "em", "u", "ol", "ul", "li"]
  let sanitized = input
  
  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
  
  // Remove style tags and their content
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
  
  // Remove inline event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, "")
  
  return sanitized.trim().slice(0, 50000)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailSchema = z.string().email()
  return emailSchema.safeParse(email).success
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/
  return phoneRegex.test(phone)
}

/**
 * Validate URL
 */
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(input: any): number | null {
  const parsed = Number.parseFloat(input)
  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return null
  }
  return parsed
}

/**
 * Validate and sanitize numeric input with bounds
 */
export function validateNumber(input: any, min?: number, max?: number): number | null {
  const num = sanitizeNumber(input)
  if (num === null) return null
  
  if (min !== undefined && num < min) return null
  if (max !== undefined && num > max) return null
  
  return num
}

/**
 * Detect SQL injection patterns
 */
export function hasSQLInjectionPattern(input: string): boolean {
  if (typeof input !== "string") return false
  
  const sqlPatterns = [
    /(\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bunion\b|\bexec\b|\bexecute\b)/i,
    /--/,
    /;/,
    /\/\*/,
    /\*\//,
    /xp_/i,
    /sp_/i,
    /'.*or.*'/i,
    /".*or.*"/i,
    /1\s*=\s*1/,
    /1\s*=\s*'1'/,
  ]
  
  return sqlPatterns.some((pattern) => pattern.test(input))
}

/**
 * Detect XSS patterns
 */
export function hasXSSPattern(input: string): boolean {
  if (typeof input !== "string") return false
  
  const xssPatterns = [
    /<script/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<img.*src.*onerror/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
  ]
  
  return xssPatterns.some((pattern) => pattern.test(input))
}

/**
 * Detect path traversal attempts
 */
export function hasPathTraversal(input: string): boolean {
  if (typeof input !== "string") return false
  
  const pathTraversalPatterns = [
    /\.\.\//,
    /\.\.\\/,
    /%2e%2e/i,
    /%252e/i,
    /\.\.%2f/i,
    /\.\.%5c/i,
  ]
  
  return pathTraversalPatterns.some((pattern) => pattern.test(input))
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  filename: string,
  size: number,
  allowedExtensions: string[],
  maxSize: number = 5 * 1024 * 1024 // 5MB default
): { valid: boolean; error?: string } {
  // Check size
  if (size > maxSize) {
    return { valid: false, error: "File size exceeds limit" }
  }
  
  // Check extension
  const ext = filename.split(".").pop()?.toLowerCase()
  if (!ext || !allowedExtensions.includes(ext)) {
    return { valid: false, error: "File type not allowed" }
  }
  
  // Check for path traversal in filename
  if (hasPathTraversal(filename)) {
    return { valid: false, error: "Invalid filename" }
  }
  
  // Check for suspicious patterns in filename
  if (hasXSSPattern(filename) || hasSQLInjectionPattern(filename)) {
    return { valid: false, error: "Invalid filename" }
  }
  
  return { valid: true }
}

/**
 * Generate a secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)
  
  for (let i = 0; i < length; i++) {
    token += chars[randomValues[i] % chars.length]
  }
  
  return token
}

/**
 * Validate date input
 */
export function isValidDate(date: any): boolean {
  const d = new Date(date)
  return !Number.isNaN(d.getTime())
}

/**
 * Sanitize object for database operations
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as Record<string, any>
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      // Check for malicious patterns
      if (hasSQLInjectionPattern(value) || hasXSSPattern(value) || hasPathTraversal(value)) {
        // Log suspicious activity
        console.warn(`Suspicious input detected in field: ${key}`)
        sanitized[key] = sanitizeString(value)
      } else {
        sanitized[key] = sanitizeString(value)
      }
    } else if (typeof value === "number") {
      sanitized[key] = value as any
    } else if (typeof value === "boolean") {
      sanitized[key] = value as any
    } else if (value === null || value === undefined) {
      sanitized[key] = value
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? sanitizeString(item) : item
      )
    } else if (typeof value === "object") {
      sanitized[key] = sanitizeObject(value)
    }
  }
  
  return sanitized as T
}

/**
 * Validation schemas for common inputs
 */
export const validationSchemas = {
  customer: z.object({
    name: z.string().min(1).max(200),
    email: z.string().email().max(200).optional().or(z.literal("")),
    phone: z.string().min(7).max(20).optional().or(z.literal("")),
    address: z.string().max(500).optional().or(z.literal("")),
    panCard: z.string().max(20).optional().or(z.literal("")),
    aadharCard: z.string().max(20).optional().or(z.literal("")),
    imageUrl: z.string().url().max(500).optional().or(z.literal("")),
  }),
  
  product: z.object({
    name: z.string().min(1).max(200),
    description: z.string().max(1000).optional().or(z.literal("")),
    price: z.number().positive().max(999999999),
    unit: z.string().max(50),
    imageUrl: z.string().url().max(500).optional().or(z.literal("")),
  }),
  
  ledgerEntry: z.object({
    customerId: z.string().uuid(),
    type: z.enum(["Sell", "Payment In", "Payment Out"]),
    invoiceNumber: z.string().max(100).optional(),
    amount: z.number().positive().max(999999999),
    description: z.string().max(1000).optional().or(z.literal("")),
    date: z.string().datetime().or(z.date()),
    dueDate: z.string().datetime().or(z.date()).optional().nullable(),
    status: z.enum(["Pending", "Paid", "Overdue", "Cancelled"]).optional(),
  }),
  
  user: z.object({
    name: z.string().min(1).max(200),
    email: z.string().email().max(200),
    role: z.enum(["admin", "user"]).optional(),
    permissions: z.array(z.string()).optional(),
  }),
}

/**
 * Rate limit checker with sliding window
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly windowMs: number
  private readonly maxRequests: number
  
  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }
  
  check(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    const requestLog = this.requests.get(identifier) || []
    const requestsInWindow = requestLog.filter((timestamp) => timestamp > windowStart)
    
    if (requestsInWindow.length >= this.maxRequests) {
      return false // Rate limit exceeded
    }
    
    requestsInWindow.push(now)
    this.requests.set(identifier, requestsInWindow)
    
    // Cleanup old entries
    if (this.requests.size > 10000) {
      this.cleanup()
    }
    
    return true
  }
  
  private cleanup(): void {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    for (const [key, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter((t) => t > windowStart)
      if (validTimestamps.length === 0) {
        this.requests.delete(key)
      } else {
        this.requests.set(key, validTimestamps)
      }
    }
  }
}
