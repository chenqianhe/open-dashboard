'use client';

import { useSelectedLayoutSegment } from "next/navigation";
import OpenAI from "openai";
import { createContext, useContext, useState } from "react";

export const BatchesContext = createContext<{
    batches: OpenAI.Batches.Batch[],
    selectedBatchId?: string,
    setBatches: (batches: OpenAI.Batches.Batch[]) => void;
}>({ batches: [], setBatches: () => {} });

export function BatchesProvider({ 
  children, 
  initialBatches 
}: { 
  children: React.ReactNode; 
  initialBatches: OpenAI.Batches.Batch[]; 
}) {
  const segment = useSelectedLayoutSegment()
  const [batches, setBatchesState] = useState(initialBatches);

  return (
    <BatchesContext.Provider value={{ 
        batches, 
        selectedBatchId: segment ?? undefined,
        setBatches: (batches) => {
            setBatchesState(batches);
        }
    }}>
      {children}
    </BatchesContext.Provider>
  );
}

export function useBatches() {
  const context = useContext(BatchesContext);
  if (context === undefined) {
    throw new Error('useBatches must be used within a BatchesProvider');
  }
  return context;
}
