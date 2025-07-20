import { Suspense } from "react"
import { InvoiceContent } from "@/components/invoices/invoice-content"
import { Loader2 } from "lucide-react"

interface InvoicePageProps {
  params: {
    id: string
  }
}

export default function InvoicePage({ params }: InvoicePageProps) {
  return (
    <div className="container mx-auto py-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <InvoiceContent invoiceId={params.id} />
      </Suspense>
    </div>
  )
}
