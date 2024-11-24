import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ModeToggle } from "@/components/ModeToggle";
import { ProjectProvider } from "./project-context";
import { getProjects } from "@/lib/get-projects";

export const runtime = 'edge';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = await getProjects();
  return (
    <div className="flex flex-col h-full w-full min-h-0">
      <ProjectProvider projects={projects}>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 h-screen flex flex-col px-4 py-2 min-h-0">
            <div className="flex-none flex flex-row items-center gap-2">
              <SidebarTrigger />
              <BreadcrumbNav />
              <div className="flex-1" />
              <ModeToggle />
            </div>
            {children}
          </main>
        </SidebarProvider>
      </ProjectProvider>
    </div>
  );
}
