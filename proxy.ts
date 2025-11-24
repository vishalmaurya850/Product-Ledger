import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Public paths that don't require authentication
<<<<<<< HEAD:proxy.ts
  const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password","/privacy", "/terms", "/cookie", "/about", "/blog", "/careers", "/contact", "/features","/pricing","/changelog","/roadmap"]
=======
  const publicPaths = ["/","/cookie","/policy","/terms", "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"]
>>>>>>> 5d2afdf1da669018d0f5aae77b62470d7f05bce3:middleware.ts
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

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
