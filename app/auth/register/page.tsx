"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, Eye, EyeOff, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"register" | "verify">("register")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")

  async function onRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const emailInput = formData.get("email") as string
    const password = formData.get("password") as string
    const companyName = formData.get("companyName") as string

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: emailInput,
          password,
          companyName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      setEmail(emailInput)
      setStep("verify")
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code.",
      })
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Verification failed")
      }

      toast({
        title: "Account Verified",
        description: "Your account has been verified. You can now log in.",
      })

      router.push("/auth/login")
    } catch (error) {
      console.error("Verification error:", error)
      toast({
        title: "Verification failed",
        description:
          error instanceof Error ? error.message : "Invalid OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function resendOtp() {
    setIsLoading(true)
    try {
        // We can reuse the register endpoint or create a specific resend endpoint.
        // For simplicity, let's assume the user just re-registers or we add a resend endpoint later.
        // But wait, re-registering with same details triggers "User exists" logic which resends OTP if unverified.
        // However, we don't have the password here to re-submit.
        // So we should probably have a resend endpoint.
        // For now, let's just tell them to go back if they need to resend, or implement a simple resend.
        
        // Actually, let's just use a simple resend logic if we can.
        // But without a dedicated endpoint, it's tricky.
        // Let's skip the resend button logic for this iteration or make it a TODO.
        // Or better, create a simple resend endpoint.
        
        // Let's stick to the core flow first.
        toast({
            title: "Info",
            description: "To resend OTP, please try registering again.",
        })
    } finally {
        setIsLoading(false)
    }
  }

  if (step === "verify") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Package className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl">Verify Email</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <form onSubmit={onVerify}>
            <CardContent className="space-y-4 flex flex-col items-center">
              <div className="space-y-2 w-full flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading ? "Verifying..." : "Verify Account"}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => setStep("register")}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Registration
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Package className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <form onSubmit={onRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" name="companyName" placeholder="Acme Inc." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} required className="pr-10" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with uppercase, lowercase, number, and special character.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending OTP..." : "Create Account"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
