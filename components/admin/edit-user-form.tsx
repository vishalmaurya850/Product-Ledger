"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { updateUser } from "@/lib/actions"
import { availablePermissions } from "@/lib/permissions" // Import from permissions.ts instead of db.ts

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().optional(),
  role: z.enum(["admin", "user"]),
  permissions: z.array(z.string()).refine((val) => val.length > 0, {
    message: "You must select at least one permission",
  }),
})

interface EditUserFormProps {
  user: {
    _id: string
    name: string
    email: string
    role: "admin" | "user"
    permissions: string[]
  }
}

export function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      permissions: user.permissions,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("email", values.email)
      formData.append("role", values.role)

      // Add password only if provided
      if (values.password) {
        formData.append("password", values.password)
      }

      // Add each permission
      values.permissions.forEach((permission) => {
        formData.append("permissions", permission)
      })

      const result = await updateUser(user._id, formData)

      if (result.success) {
        toast({
          title: "User updated",
          description: "The user has been updated successfully",
        })
        router.push("/admin/users")
      } else {
        throw new Error(result.error || "Failed to update user")
      }
    } catch (error: any) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Group permissions by module
  const permissionsByModule: Record<string, typeof availablePermissions> = {}
  availablePermissions.forEach((permission) => {
    if (!permissionsByModule[permission.module]) {
      permissionsByModule[permission.module] = []
    }
    permissionsByModule[permission.module].push(permission)
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user's full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter user's email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Leave blank to keep current password" {...field} />
              </FormControl>
              <FormDescription>Only fill this if you want to change the user's password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Role</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="admin" />
                    </FormControl>
                    <FormLabel className="font-normal">Admin (Full access to all features)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="user" />
                    </FormControl>
                    <FormLabel className="font-normal">User (Limited access based on permissions)</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="permissions"
          render={() => (
            <FormItem>
              <FormLabel>Permissions</FormLabel>
              <FormDescription>Select the permissions this user should have</FormDescription>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                  <div key={module} className="border rounded-md p-4">
                    <h3 className="font-medium capitalize mb-2">{module}</h3>
                    <div className="space-y-2">
                      {modulePermissions.map((permission) => (
                        <FormField
                          key={`${module}-${permission.name}`}
                          control={form.control}
                          name="permissions"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(permission.name)}
                                  onCheckedChange={(checked) => {
                                    const updatedPermissions = checked
                                      ? [...field.value, permission.name]
                                      : field.value?.filter((value) => value !== permission.name)
                                    field.onChange(updatedPermissions)
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{permission.description}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

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
      </form>
    </Form>
  )
}
