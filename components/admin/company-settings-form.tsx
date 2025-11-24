"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { updateCompanySettings } from "@/lib/actions"
import Image from "next/image"

const formSchema = z.object({
  name: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }).optional().or(z.literal("")),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  logo: z.string().optional(),
})

interface CompanySettingsFormProps {
  company: {
    id: string
    name: string
    address?: string
    phone?: string
    email?: string
    website?: string
    logo?: string
  }
  readOnly?: boolean
}

export function CompanySettingsForm({ company, readOnly = false }: CompanySettingsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(company.logo || null)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: company.name,
      address: company.address || "",
      phone: company.phone || "",
      email: company.email || "",
      website: company.website || "",
      logo: company.logo || "",
    },
  })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return

    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function uploadLogo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", company.id); // Add the company ID
    formData.append("type", "company"); // Specify the type as "company"
  
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Failed to upload logo");
    }
  
    const data = await response.json();
    return data.url;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (readOnly) return

    setIsSubmitting(true)

    try {
      let logoUrl = values.logo

      // Upload logo if a new one was selected
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile)
      }

      const formData = new FormData()
      formData.append("name", values.name)

      if (values.address) {
        formData.append("address", values.address)
      }

      if (values.phone) {
        formData.append("phone", values.phone)
      }

      if (values.email) {
        formData.append("email", values.email)
      }

      if (values.website) {
        formData.append("website", values.website)
      }

      if (logoUrl) {
        formData.append("logo", logoUrl)
      }

      const result = await updateCompanySettings(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Company settings have been updated successfully",
        })
        router.refresh()
        return
      }
      
      toast({
        title: result.unauthorized ? "Permission Denied" : "Error",
        description: result.error || "Failed to update company settings",
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error updating company settings:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update company settings",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 border">
              {logoPreview ? (
                <Image
                  src={logoPreview || "/placeholder.svg"}
                  alt="Company Logo"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">No Logo</div>
              )}
            </div>
            {!readOnly && (
              <label
                htmlFor="logo-upload"
                className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                  disabled={readOnly}
                />
              </label>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} disabled={readOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="company@example.com" {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} disabled={readOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter company address" {...field} disabled={readOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!readOnly && (
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
