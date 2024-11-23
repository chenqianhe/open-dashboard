'use client';

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useContext, useState } from "react";
import { BatchesContext } from "../BatchesContext";
import OpenAI from "openai";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function RefreshBatchesButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { setBatches } = useContext(BatchesContext);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
        const batchesResult = await fetch("/api/batches?refresh=true&limit=100&offset=0");
        if (batchesResult.ok) {
            const batches = await batchesResult.json() as { success: boolean, data: OpenAI.Batches.Batch[], error?: string };
            if (batches.success) {
                setBatches(batches.data);
            } else {
                toast({
                    title: "Failed to refresh batches",
                    description: batches.error,
                    variant: "destructive"
                });
            }
        } else {
            toast({
                title: "Failed to refresh batches",
                description: "Please try again later",
                variant: "destructive"
            });
        }
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="h-6 w-6 mt-1 hover:bg-muted/50 transition-colors"
          >
            <RefreshCw 
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Refresh batches and clean caches</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}