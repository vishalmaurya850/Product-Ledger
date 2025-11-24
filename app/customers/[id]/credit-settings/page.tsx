// REMOVE "use client"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { InlineCreditSettings } from "@/components/ledger/credit-limit-settings"
import { Loader2 } from "lucide-react"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

async function getCustomer(id: string) {
  const cookieStore = await cookies();
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/customers/${id}/view`, {
    cache: "no-store",
    headers: {
      "Cookie": cookieStore.toString(),
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch customer: ${response.status}`);
  }

  const data = await response.json();
  return data.customer;
}

async function getCreditSettings(id: string) {
  const cookieStore = await cookies();
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/customers/${id}/credit-settings`, {
    cache: "no-store",
    headers: {
      "Cookie": cookieStore.toString(),
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch credit settings: ${response.status}`);
  }

  return response.json();
}

export default async function CustomerCreditSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const customer = await getCustomer(resolvedParams.id);
  const creditSettings = await getCreditSettings(resolvedParams.id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 ml-3">Credit Settings for {customer.name}</h1>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading credit settings...</span>
          </div>
        }
      >
        <div className="p-4 border-b bg-muted/30">
          <InlineCreditSettings
            customerId={customer.id}
            initialSettings={creditSettings}
            onSettingsUpdate={(updatedSettings) => {
              console.log("Updated credit settings:", updatedSettings);
            }}
          />
        </div>
      </Suspense>
    </div>
  );
}