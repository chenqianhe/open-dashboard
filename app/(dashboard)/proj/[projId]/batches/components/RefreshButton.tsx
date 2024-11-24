'use client';

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefreshButton({ onRefresh }: { onRefresh?: () => Promise<void> }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
        if (onRefresh) {
            await onRefresh();
        } else {
            router.refresh();
        }
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRefresh}
      className="h-5 w-5"
    >
      <RefreshCw 
        className={`h-2 w-2 ${isRefreshing ? 'animate-spin' : ''}`}
      />
    </Button>
  );
}