'use client';

import { useRouter } from 'next/navigation';
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import { useProjects } from '@/app/(dashboard)/proj/project-context';
import { nanoid } from 'nanoid';
import { Button } from './ui/button';

export function AppSidebarHeader() {
  const router = useRouter();
  const { projects, currentProjectId } = useProjects();

  const handleProjectSelect = (projectId: string) => {
    if (window.location.pathname.includes("/batches")) {
      router.push(`/proj/${projectId}/batches`);
    } else if (window.location.pathname.includes("/files")) {
      router.push(`/proj/${projectId}/files`);
    } else {
      router.push(`/proj/${projectId}`);
    }
  };

  const createProject = (checkIfExists: boolean = false) => {
    if (projects.length > 0 && checkIfExists) return;
    router.replace(`/proj/${nanoid(5)}`);
  };

  return (
    <SidebarHeader>
      {projects.length === 0 ? (<Button variant="ghost" className='w-full justify-start' onClick={() => createProject(true)}>
        <Plus className="mr-2 h-4 w-4" />
        <span>New Project</span>
      </Button>
      ) : (
        <SidebarMenu>
          <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                {currentProjectId ? (
                  <>
                    {projects.find(project => project.id === currentProjectId)?.name ?? "New Project"}
                    <ChevronDown className="ml-auto" />
                  </>
                ) : (
                  <>
                    Select Project
                    <ChevronDown className="ml-auto" />
                  </>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => handleProjectSelect(project.id)}
                >
                  <span>{project.name}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => createProject(false)}>
                <Plus className="mr-2 h-4 w-4" />
                <span>New Project</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    </SidebarHeader>
  );
}
