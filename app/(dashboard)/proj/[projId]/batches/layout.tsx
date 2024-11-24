import React from "react";
import { BatchList } from "./components/BatchList"
import { listBatches } from "@/lib/openai/list-batches"
import { BatchesProvider } from "./BatchesContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreateBatchDialog } from "./components/CreateBatchDialog";
import { RefreshBatchesButton } from "./components/RefreshBatchesButton";
import OpenAI from "openai";

export const runtime = "edge";

export default async function BatchesLayout({ 
  children,
  params: { projId }
}: { 
  children: React.ReactNode;
  params: { projId: string };
}) {
  let batchesResult: { success: boolean; data: OpenAI.Batches.Batch[] } | { success: false; error: string } = { success: false, data: [] };
  try {
    batchesResult = await listBatches(projId, { offset: 0, limit: 100, refresh: false });
  } catch (error) {
    console.error(error);
  }

  return (
    <BatchesProvider initialBatches={batchesResult.success ? batchesResult.data : []}>
      <div className="flex-1 flex flex-col h-full min-h-0">
          {/* Header - full width */}
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">Batches</h1>
                <RefreshBatchesButton projId={projId} />
            </div>
            <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="https://platform.openai.com/docs/guides/batch" target="_blank" rel="noreferrer noopener">Learn more</Link>
                </Button>
                <CreateBatchDialog projId={projId} />
            </div>
        </div>

        {/* Content area - split into two columns */}
        <div className="flex-1 min-h-0 min-w-0 grid grid-cols-2">
            {/* Left sidebar - 50% width */}
            <div className="border-r min-h-0">
                <nav className="overflow-y-auto h-full w-full">
                    <BatchList projId={projId} />
                </nav>
            </div>

            {/* Right content area - 50% width */}
            <div className="overflow-y-auto">
                {children}
            </div>
        </div>
      </div>
    </BatchesProvider>
  )
}
