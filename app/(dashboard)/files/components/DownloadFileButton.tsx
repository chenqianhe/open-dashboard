import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";

interface DownloadFileButtonProps {
    fileId: string;
    children: ReactNode;
    linkMode?: boolean;
}

export function DownloadFileButton({ fileId, children, linkMode = false }: DownloadFileButtonProps) {
    return linkMode ? (
        <a 
            href={`/api/files/${fileId}/content`} 
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
                target="_blank" 
                rel="noopener noreferrer"
            >
                {children}
            </a>
        </Button>
    );
}
