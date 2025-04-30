"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { LayoutDashboard, FileText, Package, Users, AlertTriangle, BarChart, Settings, UserCog } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function SideNav({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Get user permissions
  const permissions = session?.user?.permissions || []
  const isAdmin = session?.user?.role === "admin"

  // Check specific permissions
  const canViewLedger = permissions.includes("ledger_view")
  const canViewProducts = permissions.includes("products_view")
  const canViewCustomers = permissions.includes("customers_view")
  const canViewReports = permissions.includes("reports_view")
  const canViewUsers = permissions.includes("users_view")
  const canViewSettings = permissions.includes("settings_view")

  return (
    <div className={cn("pb-12 border-r ", className)} {...props}>
      <div className="space-y-4 w-[220px] py-4 max-sm:hidden">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
          <div className="space-y-1">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>

            {canViewLedger && (
              <Button
                variant={pathname.startsWith("/ledger") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/ledger">
                  <FileText className="mr-2 h-4 w-4" />
                  Ledger
                </Link>
              </Button>
            )}

            {canViewProducts && (
              <Button
                variant={pathname.startsWith("/products") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/products">
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </Link>
              </Button>
            )}

            {canViewCustomers && (
              <Button
                variant={pathname.startsWith("/customers") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/customers">
                  <Users className="mr-2 h-4 w-4" />
                  Customers
                </Link>
              </Button>
            )}

            {/* {canViewLedger && (
              <Button
                variant={pathname.startsWith("/overdue") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/overdue">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Overdue
                </Link>
              </Button>
            )} */}

            {/* {canViewReports && (
              <Button
                variant={pathname.startsWith("/reports") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/reports">
                  <BarChart className="mr-2 h-4 w-4" />
                  Reports
                </Link>
              </Button>
            )} */}
          </div>
        </div>

        {isAdmin && (
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin</h2>
            <div className="space-y-1">
              {canViewUsers && (
                <Button
                  variant={pathname.startsWith("/admin/users") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/admin/users">
                    <UserCog className="mr-2 h-4 w-4" />
                    User Management
                  </Link>
                </Button>
              )}

              {canViewSettings && (
                <Button
                  variant={pathname.startsWith("/admin/settings") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Company Settings
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}