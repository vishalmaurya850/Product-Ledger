"use client"

import { Bell, Menu, User, Home, DollarSign, Users, CreditCard, BarChart3, ShieldCheck, Settings } from "lucide-react"
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
import { ThemeToggle } from "@/components/theme-toggle"

export function TopNav({ companyName }: { companyName?: string | null }) {
  const [isMounted, setIsMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <MobileSideNav closeMenu={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Company Name Display */}
      <div className="flex-1">
      {session?.user.companyName && <h2 className="text-lg font-semibold">{session.user.companyName}</h2>}

      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {session?.user?.name || "My Account"}
              {session?.user?.email && <p className="text-xs text-muted-foreground">{session.user.email}</p>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth/login" })} className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function MobileSideNav({closeMenu} : {closeMenu: () => void}) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 font-semibold">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6 text-primary" />
          <span>Product Ledger</span>
        </Link>
      </div>

      {session?.user?.companyName && (
        <div className="border-b py-2 px-4">
          <p className="text-sm text-muted-foreground">Company</p>
          <h3 className="font-medium">{session.user.companyName}</h3>
        </div>
      )}

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={closeMenu}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-accent text-accent-foreground"
                  : "transparent",
              )}
            >
              <item.icon className={`h-5 w-5 ${item.color}`} />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-5 w-5" />
          <div>
            <p className="text-sm font-medium">{session?.user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{session?.user?.email || ""}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

import { LogOut, Package } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    color: "text-blue-500",
  },
  {
    title: "Ledger",
    href: "/ledger",
    icon: DollarSign,
    color: "text-emerald-500",
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
    color: "text-blue-500",
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
    color: "text-purple-500",
  },
  {
    title: "Overdue",
    href: "/overdue",
    icon: CreditCard,
    color: "text-red-500",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    color: "text-amber-500",
  },
  {
    title: "Admin Portal",
    href: "/admin",
    icon: ShieldCheck,
    color: "text-green-500",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    color: "text-gray-500",
  },
]
