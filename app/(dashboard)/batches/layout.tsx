import React from "react";
import { BatchList } from "./components/BatchList"
import { listBatches } from "@/lib/openai/list-batches"
import { BatchesProvider } from "./BatchesContext";

export const runtime = "edge";

export default async function BatchesLayout({ 
  children
}: { 
  children: React.ReactNode;
}) {
  const batchesResult = await listBatches();

  return (
    <BatchesProvider batches={batchesResult.success ? batchesResult.data : []}>
      <div className="flex flex-col h-full">
          {/* Header - full width */}
        <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-semibold">Batches</h1>
            <div className="flex gap-2">
            <button className="text-sm text-muted-foreground hover:text-foreground">
                Learn more
            </button>
            <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md">
                Create
            </button>
            </div>
        </div>

        {/* Content area - split into two columns */}
        <div className="flex-1 min-h-0 min-w-0 grid grid-cols-2">
            {/* Left sidebar - 50% width */}
            <div className="border-r">
                <nav className="overflow-y-auto h-full w-full">
                    {batchesResult.success ? (
                    <BatchList batches={batchesResult.data} />
                    ) : (
                    <div className="p-4 text-sm text-red-600">
                        Failed to load batches
                    </div>
                    )}
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
