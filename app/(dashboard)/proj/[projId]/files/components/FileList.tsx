'use client';

import { OpenAI } from "openai";
import { useFiles } from "../FilesContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FileText, HardDrive } from "lucide-react";
import { useEffect, useState } from "react";

interface FileListProps {
  projId: string;
}

export function FileList({ projId }: FileListProps) {
  const { selectedFileId: currentFileId, files } = useFiles();

  const [groupedFiles, setGroupedFiles] = useState<Record<string, OpenAI.Files.FileObject[]>>({});

  useEffect(() => {
    const grouped = files.reduce((groups, file) => {
      const date = new Date(file.created_at * 1000).toLocaleDateString();

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(file);
      return groups;
    }, {} as Record<string, OpenAI.Files.FileObject[]>);

    setGroupedFiles(grouped);
  }, [files]);

  return (
    <div className="divide-y">
      <div className="space-y-6 p-4">
        {Object.entries(groupedFiles).map(([date, dateFiles]) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              {date}
            </h3>
            <div className="space-y-2">
              {dateFiles.map((file) => (
                <Link
                  key={file.id}
                  href={`/proj/${projId}/files/${file.id}`}
                  className={cn(
                    "block p-3 rounded-lg transition-colors",
                    "hover:bg-muted/50",
                    currentFileId === file.id && "bg-muted"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium break-all">
                          {file.filename}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <HardDrive className="h-3 w-3" />
                          <span>{formatBytes(file.bytes)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {file.purpose}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {files.length === 0 && (
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
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-lg font-medium mb-2">No files found</h2>
              <p className="text-sm">Upload a new file to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
} 