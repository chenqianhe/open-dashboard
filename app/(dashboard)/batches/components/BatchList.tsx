'use client';

import { cn } from "@/lib/utils"
import Link from "next/link"
import type { OpenAI } from "openai"
import { useBatches } from "../BatchesContext";
import { BatchStatusBadge } from "./BatchStatusBadge";

interface BatchListProps {
  batches: OpenAI.Batches.Batch[]
}

export function BatchList({ batches }: BatchListProps) {
  const { selectedBatchId } = useBatches();
  return (
    <div className="divide-y">
      {batches.map((batch) => (
        <Link
          key={batch.id}
          href={`/batches/${batch.id}`}
          className={cn(
            "block p-4 hover:bg-muted/50 transition-colors",
            selectedBatchId === batch.id && "bg-muted"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className={cn("font-medium", selectedBatchId === batch.id && "font-bold")}>
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
  )
}
