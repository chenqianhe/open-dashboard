import { cn } from "@/lib/utils";
import OpenAI from "openai";

export function FileStatusBadge({ status }: { status: OpenAI.Files.FileObject["status"] }) {
  const statusConfig = {
    uploaded: { 
      label: "Uploaded", 
      className: "bg-blue-100 text-blue-800" 
    },
    processed: { 
      label: "Ready", 
      className: "bg-green-100 text-green-800" 
    },
    error: { 
      label: "Error", 
      className: "bg-red-100 text-red-800" 
    },
  } satisfies Record<OpenAI.Files.FileObject["status"], { 
    label: string; 
    className: string 
  }>;

  const config = statusConfig[status];

  return (
    <span className={cn("px-2 py-1 text-xs rounded-full", config.className)}>
      {config.label}
    </span>
  );
}