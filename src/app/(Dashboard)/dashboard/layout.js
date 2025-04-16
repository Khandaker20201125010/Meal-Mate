'use client';

import { AppSidebar } from "@/components/ui/app-sidebar";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";





export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full" >
        <SidebarTrigger />
        <div className="w-full lg:px-2 min-h-screen overflow-auto bg-gray-100">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
