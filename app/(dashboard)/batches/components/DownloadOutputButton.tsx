import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";

interface DownloadOutputButtonProps {
    fileId: string;
    children: ReactNode;
    linkMode?: boolean;
}

export function DownloadOutputButton({ fileId, children, linkMode = false }: DownloadOutputButtonProps) {
    return linkMode ? (
        <a 
            href={`/api/files/${fileId}/content`} 
            download={`${fileId}.jsonl`} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
        >
            {children}
        </a>
    ) : (
        <Button 
            variant="outline" 
            size="sm"
        >
            <a 
                href={`/api/files/${fileId}/content`} 
                download={`${fileId}.jsonl`} 
                target="_blank" 
                rel="noopener noreferrer"
            >
                {children}
            </a>
        </Button>
    );
}
