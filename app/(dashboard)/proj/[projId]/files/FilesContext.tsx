'use client';

import { useSelectedLayoutSegment } from "next/navigation";
import { OpenAI } from "openai";
import { createContext, useContext, useState } from "react";

const FilesContext = createContext<{
    files: OpenAI.Files.FileObject[];
    selectedFileId?: string;
    setFiles: (files: OpenAI.Files.FileObject[]) => void;
}>({ files: [], setFiles: () => {} });

interface FilesProviderProps {
  children: React.ReactNode;
  initialFiles: OpenAI.Files.FileObject[];
}

export function FilesProvider({ children, initialFiles }: FilesProviderProps) {
  const segment = useSelectedLayoutSegment();
  const [files, setFilesState] = useState(initialFiles);
  
  return (
    <FilesContext.Provider 
      value={{ 
        files,
        selectedFileId: segment ?? undefined,
        setFiles: (files) => {
          setFilesState(files);
        }
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
