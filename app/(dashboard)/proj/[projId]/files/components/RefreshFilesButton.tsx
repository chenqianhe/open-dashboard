'use client';

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import OpenAI from "openai";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFiles } from "../FilesContext";

export function RefreshFilesButton({ projId }: { projId: string }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { setFiles } = useFiles();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
        const filesResult = await fetch(`/api/projects/${projId}/files?refresh=true&limit=100&offset=0`);
        if (filesResult.ok) {
            const files = await filesResult.json() as { success: boolean, data: OpenAI.Files.FileObject[], error?: string };
            if (files.success) {
                setFiles(files.data);
                toast({
                    title: "Files refreshed",
                    description: "Files and caches have been refreshed",
                });
            } else {
                toast({
                    title: "Failed to refresh files",
                    description: files.error,
                    variant: "destructive"
                });
            }
        } else {
            toast({
                title: "Failed to refresh files",
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
          <p>Refresh files and clean caches</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}