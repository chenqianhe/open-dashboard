import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";

interface DownloadOutputButtonProps {
    projId: string;
    fileId: string;
    children: ReactNode;
    linkMode?: boolean;
}

export function DownloadOutputButton({ projId, fileId, children, linkMode = false }: DownloadOutputButtonProps) {
    return linkMode ? (
        <a 
            href={`/api/projects/${projId}/files/${fileId}/content`} 
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
                href={`/api/projects/${projId}/files/${fileId}/content`} 
                target="_blank" 
                rel="noopener noreferrer"
            >
                {children}
            </a>
        </Button>
    );
}
