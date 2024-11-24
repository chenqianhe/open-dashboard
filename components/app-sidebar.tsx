'use client';

import { Inbox, File, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AppSidebarHeader } from "./app-sidebar-header"
import Link from "next/link"
import { useProjects } from "@/app/(dashboard)/proj/project-context";

export function AppSidebar() {
  const { projects, currentProjectId } = useProjects();

  const items = [
    {
      title: "Config",
      url: `/proj/${currentProjectId}/config`,
      icon: Settings,
    },
    {
      title: "Batches",
      url: `/proj/${currentProjectId}/batches`,
      icon: Inbox,
    },
    {
      title: "Files",
      url: `/proj/${currentProjectId}/files`,
      icon: File,
    },
  ]
  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>DASHBOARD</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild disabled={!currentProjectId || !projects.find(p => p.id === currentProjectId)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
