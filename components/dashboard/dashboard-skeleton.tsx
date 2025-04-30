import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="w-full h-[350px] flex items-center justify-center">
      <div className="space-y-4 w-full">
        <Skeleton className="h-[350px] w-full" />
      </div>
    </div>
  )
}
