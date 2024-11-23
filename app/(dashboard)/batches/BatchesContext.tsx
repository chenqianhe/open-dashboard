'use client';

import { useSelectedLayoutSegment } from "next/navigation";
import OpenAI from "openai";
import { createContext, useContext } from "react";

export const BatchesContext = createContext<{
    batches: OpenAI.Batches.Batch[],
    selectedBatchId?: string
}>({ batches: [] });

export function BatchesProvider({ 
  children, 
  batches 
}: { 
  children: React.ReactNode; 
  batches: OpenAI.Batches.Batch[]; 
}) {
  const segment = useSelectedLayoutSegment()
  return (
    <BatchesContext.Provider value={{ batches, selectedBatchId: segment ?? undefined }}>
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
