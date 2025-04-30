import { Suspense } from "react"
import { CustomerLedgerView } from "@/components/ledger/customer-ledger-view"
import { LedgerSkeleton } from "@/components/ledger/ledger-skeleton"

export default function LedgerPage() {
  return (
    <div className="flex-1 h-full">
      <Suspense fallback={<LedgerSkeleton />}>
        <CustomerLedgerView />
      </Suspense>
    </div>
  )
}