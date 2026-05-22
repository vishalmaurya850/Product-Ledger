"use client"

import { Menu, User, LogOut, Package } from "lucide-react"
import { useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function TopNav({ companyName }: { companyName?: string | null }) {
  const [isMounted, setIsMounted] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <header className="sticky top-0 z-50 h-[48px] bg-[var(--surface-black)]" />
  }

  return (
    <header className="sticky top-0 z-50 flex h-[48px] items-center justify-between bg-[var(--surface-black)] border-b border-[var(--border-subtle)] px-4 sm:px-6">
      {/* Left: Mobile menu + Logo */}
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden text-white/70 hover:text-white transition-colors p-1">
              <Menu className="h-[18px] w-[18px]" />
              <span className="sr-only">Toggle navigation menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 border-none bg-[var(--canvas)]">
            <MobileSideNav />
          </SheetContent>
        </Sheet>

        <Link href="/dashboard" className="flex items-center gap-2">
          <Package className="h-[18px] w-[18px] text-[var(--accent-cyan)]" />
          <span className="text-[14px] font-semibold text-white hidden sm:inline">
            Product Ledger
          </span>
        </Link>
      </div>

      {/* Center: Company name */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        {session?.user?.companyName && (
          <span className="text-[13px] font-normal text-white/70">
            {session.user.companyName}
          </span>
        )}
      </div>

      {/* Right: User menu */}
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors rounded-[8px] p-1.5">
              <User className="h-[16px] w-[16px]" />
              <span className="text-[13px] hidden sm:inline">
                {session?.user?.name?.split(" ")[0] || "Account"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-[12px] border-[var(--border-subtle)] bg-[var(--canvas)] shadow-lg">
            <DropdownMenuLabel className="font-normal">
              <p className="text-[14px] font-semibold text-[var(--ink)]">
                {session?.user?.name || "My Account"}
              </p>
              {session?.user?.email && (
                <p className="text-[12px] text-[var(--text-secondary)]">
                  {session.user.email}
                </p>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--border-subtle)]" />
            <DropdownMenuItem asChild className="text-[14px] cursor-pointer rounded-[8px]">
              <Link href={session?.user?.role === "admin" ? "/admin/profile" : "/profile"}>
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-[14px] cursor-pointer rounded-[8px]">
              <Link href="/admin/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[var(--border-subtle)]" />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="text-[14px] cursor-pointer text-[var(--accent-red)] rounded-[8px]"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function MobileSideNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Ledger", href: "/ledger" },
    { title: "Products", href: "/products" },
    { title: "Customers", href: "/customers" },
  ]

  const adminItems = [
    { title: "User Management", href: "/admin/users" },
    { title: "Company Settings", href: "/admin/settings" },
  ]

  const isAdmin = session?.user?.role === "admin"

  return (
    <div className="flex h-full flex-col bg-[var(--canvas)]">
      <div className="flex h-[52px] items-center border-b border-[var(--border-subtle)] px-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[var(--accent-cyan)]" />
          <span className="text-[20px] font-semibold text-[var(--ink)]">
            Product Ledger
          </span>
        </Link>
      </div>

      {session?.user?.companyName && (
        <div className="border-b border-[var(--border-subtle)] py-3 px-5">
          <p className="text-[12px] text-[var(--text-secondary)]">Company</p>
          <p className="text-[14px] font-semibold text-[var(--ink)]">
            {session.user.companyName}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-[8px] px-3 py-2.5 text-[14px] transition-colors",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-[var(--accent-cyan-glow)] text-[var(--accent-cyan)] font-semibold"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--ink)]"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {isAdmin && (
          <div className="mt-6">
            <p className="px-3 mb-2 text-[12px] font-semibold text-[var(--text-secondary)] uppercase">
              Admin
            </p>
            <nav className="space-y-1">
              {adminItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-[8px] px-3 py-2.5 text-[14px] transition-colors",
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

      <div className="border-t border-[var(--border-subtle)] p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center">
            <User className="h-4 w-4 text-[var(--text-secondary)]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[var(--ink)]">
              {session?.user?.name || "User"}
            </p>
            <p className="text-[12px] text-[var(--text-secondary)]">
              {session?.user?.email || ""}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="w-full flex items-center justify-center gap-2 rounded-[8px] border border-[var(--border-subtle)] px-4 py-2 text-[14px] text-[var(--ink)] hover:bg-[var(--surface-elevated)] active:scale-[0.97] transition-all"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
