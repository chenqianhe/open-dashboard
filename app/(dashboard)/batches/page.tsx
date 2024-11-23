'use client';

import { redirect } from "next/navigation";
import { useBatches } from "./BatchesContext";


export default function BatchesPage() {
  const { batches } = useBatches();
  if (batches.length !== 0) {
    return redirect(`/batches/${batches[0].id}`);
  }
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="text-muted-foreground">
        <svg
          className="w-12 h-12 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h2 className="text-lg font-medium mb-2">No batches found</h2>
        <p className="text-sm">Create a new batch to get started</p>
      </div>
    </div>
  )
}
