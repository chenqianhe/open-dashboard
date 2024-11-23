import { cn } from "@/lib/utils"
import type { OpenAI } from "openai"

interface BatchListProps {
  batches: OpenAI.Batches.Batch[]
  selectedBatchId?: string
}

export function BatchList({ batches, selectedBatchId }: BatchListProps) {
  return (
    <div className="divide-y">
      {batches.map((batch) => (
        <a
          key={batch.id}
          href={`/batches/${batch.id}`}
          className={cn(
            "block p-4 hover:bg-muted/50 transition-colors",
            selectedBatchId === batch.id && "bg-muted"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="font-medium">{batch.id}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(batch.created_at * 1000).toLocaleString()}
              </p>
            </div>
            <BatchStatusBadge status={batch.status} />
          </div>
        </a>
      ))}
    </div>
  )
}

function BatchStatusBadge({ status }: { status: OpenAI.Batches.Batch["status"] }) {
  const statusConfig = {
    validating: { label: "Validating", className: "bg-yellow-100 text-yellow-800" },
    in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-800" },
    completed: { label: "Completed", className: "bg-green-100 text-green-800" },
    failed: { label: "Failed", className: "bg-red-100 text-red-800" },
    expired: { label: "Expired", className: "bg-gray-100 text-gray-800" },
    cancelling: { label: "Cancelling", className: "bg-gray-100 text-gray-800" },
    cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-800" },
    finalizing: { label: "Finalizing", className: "bg-blue-100 text-blue-800" }
  } satisfies Record<OpenAI.Batches.Batch["status"], { label: string; className: string }>

  const config = statusConfig[status]

  return (
    <span className={cn("px-2 py-1 text-xs rounded-full", config.className)}>
      {config.label}
    </span>
  )
} 