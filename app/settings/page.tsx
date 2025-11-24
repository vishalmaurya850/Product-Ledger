"use client"

import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  gracePeriod: z.coerce.number().int().min(0, { message: "Grace period must be a positive integer" }),
  interestRate: z.coerce.number().min(0, { message: "Interest rate must be a positive number" }),
  compoundingPeriod: z.enum(["daily", "weekly", "monthly"], {
    message: "Please select a compounding period",
  }),
  minimumFee: z.coerce.number().min(0, { message: "Minimum fee must be a positive number" }),
})

export default function SettingsPage() {
  // const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overdue")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      gracePeriod: 7,
      interestRate: 15,
      compoundingPeriod: "daily" as const,
      minimumFee: 5,
    },
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/overdue/settings")
        if (response.ok) {
          const data = await response.json()
          form.reset({
            gracePeriod: data.gracePeriod || 7,
            interestRate: (data.interestRate || 0.15) * 100, // Convert to percentage for UI
            compoundingPeriod: data.compoundingPeriod || "daily",
            minimumFee: data.minimumFee || 5,
          })
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("gracePeriod", values.gracePeriod.toString())
      formData.append("interestRate", values.interestRate.toString())
      formData.append("compoundingPeriod", values.compoundingPeriod)
      formData.append("minimumFee", values.minimumFee.toString())

      // Define the updateOverdueSettings function
            const updateOverdueSettings = async (formData: FormData) => {
              const response = await fetch("/api/overdue/settings", {
                method: "POST",
                body: formData,
              });
              if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                return { success: false, error: "Failed to update settings", unauthorized: response.status === 401 };
              }
              const data = await response.json().catch(() => ({}));
              return { success: true, message: data.message };
            };
      
            const result = await updateOverdueSettings(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Your overdue settings have been updated successfully.",
        })
      } else {
        toast({
          title: result.unauthorized ? "Permission Denied" : "Error",
          description: result.error || "Failed to update settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function onError(errors: any) {
    const errorMessages = Object.values(errors)
      .map((error: any) => error.message)
      .join(", ")
    
    toast({
      title: "Validation Error",
      description: errorMessages || "Please check all required fields",
      variant: "destructive",
    })
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading settings...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overdue">Overdue Settings</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overdue" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Payment Settings</CardTitle>
              <CardDescription>Configure how overdue payments are handled</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="gracePeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grace Period (days)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>Number of days after due date before interest is applied</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interestRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Interest Rate (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormDescription>Annual interest rate applied to overdue payments</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="compoundingPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compounding Period</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>How often interest is compounded on overdue payments</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="minimumFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Fee (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Minimum fee applied to overdue payments regardless of interest calculation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Theme</div>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <span className="text-sm text-muted-foreground ml-2">Select your preferred theme mode</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Notification settings will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
