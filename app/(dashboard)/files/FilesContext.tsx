'use client';

import { useSelectedLayoutSegment } from "next/navigation";
import { OpenAI } from "openai";
import { createContext, useContext } from "react";

const FilesContext = createContext<{
    files: OpenAI.Files.FileObject[];
    selectedFileId?: string;
}>({ files: [] });

interface FilesProviderProps {
  children: React.ReactNode;
  files: OpenAI.Files.FileObject[];
}

export function FilesProvider({ children, files }: FilesProviderProps) {
  const segment = useSelectedLayoutSegment();
  return (
    <FilesContext.Provider 
      value={{ 
        files,
        selectedFileId: segment ?? undefined
      }}
    >
      {children}
    </FilesContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
}
