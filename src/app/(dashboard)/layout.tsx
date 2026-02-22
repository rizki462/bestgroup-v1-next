'use client'

import AppSidebar from "@/components/common/app-sidebar";
import { DarkModeToggle } from "@/components/common/darkmode-toogle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardBreadcrumb from "./_components/dashboard-breadcrumb";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="overflow-x-hidden">
        <header className="flex justify-between h-16 items-center shrink-0 gap-2 transition-[width, height] ease-linear group-has-data-[collabpsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 ">
            <SidebarTrigger className="cursor-pointer" />
            <Separator
              orientation="vertical"
              className="h-6 data-[orientation=vertical]:h-4 mr-2"
            />

            <DashboardBreadcrumb />

          </div>
          <div className="px-4">
            <DarkModeToggle />
          </div>
        </header>

        <main className="flex flex-1 flex-col item-start gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
