"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"

export function SideNav({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const permissions = session?.user?.permissions || []
  const isAdmin = session?.user?.role === "admin"

  const canViewLedger = permissions.includes("ledger_view")
  const canViewProducts = permissions.includes("products_view")
  const canViewCustomers = permissions.includes("customers_view")
  const canViewUsers = permissions.includes("users_view")
  const canViewSettings = permissions.includes("settings_view")

  const navItems = [
    { title: "Dashboard", href: "/dashboard", visible: true },
    { title: "Ledger", href: "/ledger", visible: canViewLedger },
    { title: "Products", href: "/products", visible: canViewProducts },
    { title: "Customers", href: "/customers", visible: canViewCustomers },
  ]

  const adminItems = [
    { title: "User Management", href: "/admin/users", visible: canViewUsers },
    { title: "Company Settings", href: "/admin/settings", visible: canViewSettings },
  ]

  return (
    <div className={cn("border-r border-[var(--border-subtle)] bg-[var(--canvas)]", className)} {...props}>
      <div className="w-[200px] py-5 max-md:hidden">
        <div className="px-3">
          <nav className="space-y-0.5">
            {navItems.filter(i => i.visible).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-[8px] px-3 py-2 text-[14px] transition-colors",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "bg-[var(--accent-cyan-glow)] text-[var(--accent-cyan)] font-semibold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--ink)]"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {isAdmin && (
          <div className="mt-6 px-3">
            <p className="px-3 mb-2 text-[11px] font-semibold tracking-[0.5px] text-[var(--text-secondary)] uppercase">
              Admin
            </p>
            <nav className="space-y-0.5">
              {adminItems.filter(i => i.visible).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-[8px] px-3 py-2 text-[14px] transition-colors",
                    pathname.startsWith(item.href)
                      ? "bg-[var(--accent-cyan-glow)] text-[var(--accent-cyan)] font-semibold"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--ink)]"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
