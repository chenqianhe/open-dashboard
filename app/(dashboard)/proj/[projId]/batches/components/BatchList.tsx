'use client';

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useBatches } from "../BatchesContext";
import { BatchStatusBadge } from "./BatchStatusBadge";

export function BatchList({ projId }: { projId: string }) {
  const { batches, selectedBatchId } = useBatches();
  return (
    batches.length > 0 ? (
      <div className="divide-y">
        {batches.map((batch) => (
          <Link
          key={batch.id}
          href={`/proj/${projId}/batches/${batch.id}`}
          className={cn(
            "block p-4 hover:bg-muted/50 transition-colors",
            selectedBatchId === batch.id && "bg-muted"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className={cn("font-medium break-all", selectedBatchId === batch.id && "font-bold")}>
                {batch.id}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(batch.created_at * 1000).toLocaleString()}
              </p>
            </div>
            <BatchStatusBadge status={batch.status} />
          </div>
        </Link>
        ))}
      </div>
    ) : (
      <div className="p-4 text-sm text-red-600">
        Failed to load batches
      </div>
    )
  )
}
