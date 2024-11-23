'use client';

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CancelBatchButtonProps {
  batchId: string;
}

export function CancelBatchButton({ batchId }: CancelBatchButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const result = await fetch(`/api/batches/${batchId}/cancel`, {
        method: "POST",
      });
      if (result.ok) {
        const data = await result.json() as { success: boolean, error?: string };
        if (data.success) {
          toast({
            title: "Batch cancelled",
            description: "The batch has been cancelled successfully.",
          });
          router.refresh();
        } else {
          toast({
            title: "Failed to cancel batch",
            description: data.error,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Failed to cancel batch",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Failed to cancel batch",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button 
      variant="destructive" 
      onClick={handleCancel}
      disabled={isLoading}
    >
      {isLoading ? (
        <span>
          Cancelling...
        </span>
      ) : (
        <span>Cancel Batch</span>
      )}
    </Button>
  );
} 