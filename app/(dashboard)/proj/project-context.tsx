'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Project } from '@/common/type/project';
import { useParams } from 'next/navigation';

interface ProjectContextType {
  projects: Project[];
  currentProjectId: string | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children, projects }: { children: ReactNode, projects: Project[] }) {
  const params = useParams();
  const currentProjectId = params.projId as string || null;

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProjectId,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
} 