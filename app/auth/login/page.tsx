"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Package, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        let errorMessage = "Invalid email or password. Please try again."

        if (result.code === "email_not_verified" || result.error === "email_not_verified" || result.error.includes("Email not verified")) {
          errorMessage = "Your email is not verified. Please check your email for the verification code."
        }

        toast({
          title: "Sign in failed",
          description: errorMessage,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--parchment)] p-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-[var(--action-blue)]" />
            <span className="text-[21px] font-semibold tracking-[0.231px] text-[var(--ink)]">
              Product Ledger
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[18px] border border-[var(--hairline)] bg-[var(--canvas)] p-8">
          <div className="text-center mb-6">
            <h1 className="text-[28px] font-semibold tracking-[-0.28px] text-[var(--ink)]">
              Sign in
            </h1>
            <p className="text-[14px] tracking-[-0.224px] text-[var(--ink-muted-48)] mt-1">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-[12px] tracking-[-0.12px] text-[var(--action-blue)] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} required className="pr-10" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted-48)] hover:text-[var(--ink)] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[14px] tracking-[-0.224px] text-[var(--ink-muted-48)]">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-[var(--action-blue)] hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[var(--parchment)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--action-blue)] border-t-transparent" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
