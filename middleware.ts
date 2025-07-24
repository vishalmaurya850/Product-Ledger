import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ["/","/cookie","/policy","/terms", "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"]
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

  // Check if user is authenticated
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // If not authenticated, redirect to login
  if (!token) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // Check permissions for specific routes
  const userPermissions = (token.permissions as string[]) || []
  const userRole = token.role as string

  // Admin routes - only accessible by admins
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Ledger routes - require ledger_view permission
  if (
    (pathname.startsWith("/ledger") || pathname.startsWith("/api/ledger")) &&
    !userPermissions.includes("ledger_view") &&
    userRole !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Products routes - require products_view permission
  if (
    (pathname.startsWith("/products") || pathname.startsWith("/api/products")) &&
    !userPermissions.includes("products_view") &&
    userRole !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Customers routes - require customers_view permission
  if (
    (pathname.startsWith("/customers") || pathname.startsWith("/api/customers")) &&
    !userPermissions.includes("customers_view") &&
    userRole !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Reports routes - require reports_view permission
  if (
    (pathname.startsWith("/reports") || pathname.startsWith("/api/reports")) &&
    !userPermissions.includes("reports_view") &&
    userRole !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Settings routes - require settings_view permission
  if (pathname.startsWith("/settings") && !userPermissions.includes("settings_view") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}