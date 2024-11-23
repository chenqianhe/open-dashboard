import React from "react";
import { FileList } from "./components/FileList";
import { listFiles } from "@/lib/openai/list-files";
import { FilesProvider } from "./FilesContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileUploadDialog } from "./components/FileUploadDialog";

export const runtime = "edge";

export default async function FilesLayout({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  const filesResult = await listFiles();

  return (
    <FilesProvider files={filesResult.success ? filesResult.data : []}>
      <div className="flex-1 flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex-none flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-semibold">Files</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="https://platform.openai.com/docs/api-reference/files/create" target="_blank" rel="noreferrer noopener">Learn more</Link>
            </Button>
            <FileUploadDialog />
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-h-0 min-w-0 grid grid-cols-2">
          {/* Left sidebar */}
          <div className="border-r min-h-0">
            <nav className="overflow-y-auto h-full w-full">
              {filesResult.success ? (
                <FileList files={filesResult.data} />
              ) : (
                <div className="p-4 text-sm text-red-600">
                  Failed to load files
                </div>
              )}
            </nav>
          </div>

          {/* Right content area */}
          <div className="overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </FilesProvider>
  );
} 