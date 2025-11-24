import { Suspense } from "react"
import { InvoiceContent } from "@/components/invoices/invoice-content"
import { Loader2 } from "lucide-react"

interface InvoicePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params
  
  return (
    <div className="container mx-auto py-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <InvoiceContent invoiceId={id} />
      </Suspense>
    </div>
  )
}
