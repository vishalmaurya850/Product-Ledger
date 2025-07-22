import { BarChart3, CreditCard, DollarSign, Package, Settings, ShieldCheck } from "lucide-react"

export function LandingFeatures() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 mx-auto md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Product Ledger provides all the tools you need to manage your business finances effectively.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Ledger Management</h3>
            <p className="text-center text-muted-foreground">
              Track all your cash inflows and outflows with detailed ledger entries.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold">Inventory Tracking</h3>
            <p className="text-center text-muted-foreground">
              Manage your product inventory with real-time stock updates and alerts.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <BarChart3 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold">Overdue Management</h3>
            <p className="text-center text-muted-foreground">
              Automatically calculate interest on overdue payments based on your rules.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <CreditCard className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold">Customer Management</h3>
            <p className="text-center text-muted-foreground">
              Keep track of all your customers and their transaction history.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Settings className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold">Customizable Settings</h3>
            <p className="text-center text-muted-foreground">
              Configure interest rates, grace periods, and other system parameters.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <ShieldCheck className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">Secure Admin Portal</h3>
            <p className="text-center text-muted-foreground">
              Manage your entire system from a secure, role-based admin portal.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}