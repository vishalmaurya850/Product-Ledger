import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

// Simple in-memory rate limiter
const rateLimit = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 100 // 100 requests per minute per IP

// Suspicious activity tracking
const suspiciousActivity = new Map<string, number>()
const SUSPICIOUS_THRESHOLD = 10 // Block after 10 suspicious attempts

// Request size limit (in bytes)
const MAX_REQUEST_SIZE = 10 * 1024 * 1024 // 10MB

function isRateLimited(ip: string) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW

  const requestLog = rateLimit.get(ip) || []
  const requestsInWindow = requestLog.filter((timestamp: number) => timestamp > windowStart)

  if (requestsInWindow.length >= MAX_REQUESTS) {
    return true
  }

  requestsInWindow.push(now)
  rateLimit.set(ip, requestsInWindow)
  
  if (rateLimit.size > 5000) {
      rateLimit.clear()
  }
  
  return false
}

function checkSuspiciousPatterns(url: string, headers: Headers): boolean {
  const urlLower = url.toLowerCase()
  const userAgent = headers.get("user-agent")?.toLowerCase() || ""
  
  // Check for common attack patterns
  const suspiciousPatterns = [
    /union.*select/i,
    /select.*from/i,
    /<script/i,
    /javascript:/i,
    /\.\.%2f/i,
    /\.\.%5c/i,
    /%00/i,
    /etc\/passwd/i,
    /windows\/system/i,
    /cmd\.exe/i,
    /\/bin\/bash/i,
    /eval\(/i,
    /exec\(/i,
    /phpinfo/i,
    /base64_decode/i,
  ]
  
  // Check URL for suspicious patterns
  if (suspiciousPatterns.some(pattern => pattern.test(urlLower))) {
    return true
  }
  
  // Check for suspicious user agents (bots, scanners)
  const suspiciousAgents = [
    "sqlmap",
    "nikto",
    "nmap",
    "masscan",
    "nessus",
    "openvas",
    "metasploit",
    "havij",
    "acunetix",
    "burp",
  ]
  
  if (suspiciousAgents.some(agent => userAgent.includes(agent))) {
    return true
  }
  
  return false
}

function recordSuspiciousActivity(ip: string): boolean {
  const count = (suspiciousActivity.get(ip) || 0) + 1
  suspiciousActivity.set(ip, count)
  
  // Cleanup old entries periodically
  if (suspiciousActivity.size > 1000) {
    suspiciousActivity.clear()
  }
  
  return count >= SUSPICIOUS_THRESHOLD
}

function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Get IP address
  // @ts-ignore
  const ip = req.ip || req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1"
  
  // Check if IP is blocked due to suspicious activity
  const suspiciousCount = suspiciousActivity.get(ip) || 0
  if (suspiciousCount >= SUSPICIOUS_THRESHOLD) {
    console.warn(`Blocked suspicious IP: ${ip}`)
    return new NextResponse("Forbidden", { status: 403 })
  }
  
  // Rate Limiting
  if (isRateLimited(ip)) {
    console.warn(`Rate limit exceeded for IP: ${ip}`)
    return new NextResponse("Too Many Requests", { status: 429 })
  }
  
  // Check for suspicious patterns
  if (checkSuspiciousPatterns(req.url, req.headers)) {
    console.warn(`Suspicious activity detected from IP: ${ip}, URL: ${pathname}`)
    const shouldBlock = recordSuspiciousActivity(ip)
    if (shouldBlock) {
      return new NextResponse("Forbidden", { status: 403 })
    }
  }
  
  // Check request size for POST/PUT/PATCH requests
  const contentLength = req.headers.get("content-length")
  if (contentLength && Number.parseInt(contentLength) > MAX_REQUEST_SIZE) {
    console.warn(`Request size too large from IP: ${ip}`)
    return new NextResponse("Request Entity Too Large", { status: 413 })
  }

  // Public paths that don't require authentication
  const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password","/privacy", "/terms", "/cookie", "/about", "/blog", "/careers", "/contact", "/features","/pricing","/changelog","/roadmap"]
  if (publicPaths.includes(pathname) || publicPaths.some((path) => pathname.startsWith(`${path}/`))) {
    return NextResponse.next()
  }

  // API routes that don't require authentication
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/api/cron/update-overdue" ||
    pathname.startsWith("/api/email")
  ) {
    return NextResponse.next()
  }

  // If not authenticated, redirect to login
  if (!session?.user) {
    // Protect uploads folder
    if (pathname.startsWith("/uploads")) {
       return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    const url = new URL("/auth/login", req.url)
    url.searchParams.set("callbackUrl", encodeURI(req.url))
    return NextResponse.redirect(url)
  }

  // Check permissions for specific routes
  const userPermissions = (session.user.permissions as string[]) || []
  const userRole = session.user.role as string

  // Admin routes - only accessible by admins
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Ledger routes - require ledger_view permission
  if (
    (pathname.startsWith("/ledger") || pathname.startsWith("/api/ledger")) &&
    !userPermissions.includes("ledger_view") &&
    userRole !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Products routes - require products_view permission
  if (
    (pathname.startsWith("/products") || pathname.startsWith("/api/products")) &&
    !userPermissions.includes("products_view") &&
    userRole !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Customers routes - require customers_view permission
  if (
    (pathname.startsWith("/customers") || pathname.startsWith("/api/customers")) &&
    !userPermissions.includes("customers_view") &&
    userRole !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Reports routes - require reports_view permission
  if (
    (pathname.startsWith("/reports") || pathname.startsWith("/api/reports")) &&
    !userPermissions.includes("reports_view") &&
    userRole !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Settings routes - require settings_view permission
  if (pathname.startsWith("/settings") && !userPermissions.includes("settings_view") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
  
  // Add security headers to response
  const response = NextResponse.next()
  
  // Add CSRF token to response for state-changing requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const csrfToken = generateCSRFToken()
    response.cookies.set("csrf-token", csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
    })
  }

  return response
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
