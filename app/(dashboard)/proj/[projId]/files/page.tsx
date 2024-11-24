'use client';

import { redirect } from "next/navigation";
import { useFiles } from "./FilesContext";

export default function FilesPage({ params }: { params: { projId: string } }) {
  const { files } = useFiles();

  console.log("current files", files);
  
  if (files.length !== 0) {
    return redirect(`/proj/${params.projId}/files/${files[0].id}`);
  }

  return (
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
  );
} 