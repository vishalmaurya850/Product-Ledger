import { BarChart3, CreditCard, DollarSign, Package, Settings, ShieldCheck } from "lucide-react"

export function LandingFeatures() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 mx-auto md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-md">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl transition-all duration-300 hover:text-primary/90">Everything You Need</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed transition-all duration-300 hover:text-foreground/80">
              Product Ledger provides all the tools you need to manage your business finances effectively.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary/30 group">
            <div className="rounded-full bg-primary/10 p-3 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
              <DollarSign className="h-6 w-6 text-primary transition-all duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">Ledger Management</h3>
            <p className="text-center text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
              Track all your cash inflows and outflows with detailed ledger entries.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-blue-500/30 group">
            <div className="rounded-full bg-primary/10 p-3 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:scale-110">
              <Package className="h-6 w-6 text-blue-500 transition-all duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-blue-500">Inventory Tracking</h3>
            <p className="text-center text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
              Manage your product inventory with real-time stock updates and alerts.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-red-500/30 group">
            <div className="rounded-full bg-primary/10 p-3 transition-all duration-300 group-hover:bg-red-500/20 group-hover:scale-110">
              <BarChart3 className="h-6 w-6 text-red-500 transition-all duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-red-500">Overdue Management</h3>
            <p className="text-center text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
              Automatically calculate interest on overdue payments based on your rules.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-purple-500/30 group">
            <div className="rounded-full bg-primary/10 p-3 transition-all duration-300 group-hover:bg-purple-500/20 group-hover:scale-110">
              <CreditCard className="h-6 w-6 text-purple-500 transition-all duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-purple-500">Customer Management</h3>
            <p className="text-center text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
              Keep track of all your customers and their transaction history.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-amber-500/30 group">
            <div className="rounded-full bg-primary/10 p-3 transition-all duration-300 group-hover:bg-amber-500/20 group-hover:scale-110">
              <Settings className="h-6 w-6 text-amber-500 transition-all duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-amber-500">Customizable Settings</h3>
            <p className="text-center text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
              Configure interest rates, grace periods, and other system parameters.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-green-500/30 group">
            <div className="rounded-full bg-primary/10 p-3 transition-all duration-300 group-hover:bg-green-500/20 group-hover:scale-110">
              <ShieldCheck className="h-6 w-6 text-green-500 transition-all duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-green-500">Secure Admin Portal</h3>
            <p className="text-center text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
              Manage your entire system from a secure, role-based admin portal.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}