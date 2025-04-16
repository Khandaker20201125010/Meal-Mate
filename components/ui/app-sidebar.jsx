"use client";

import {
  UserCircle,
  UtensilsCrossed,
  Users,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Admin-specific menu
const adminMenu = [
  { title: "Profile", url: "/dashboard/profile", icon: UserCircle },
  { title: "Add Menu", url: "/dashboard/addMenu", icon: UtensilsCrossed },
  { title: "Manage User", url: "/dashboard/manage-users", icon: Users },
  { title: "Manage Menu", url: "/dashboard/manage-menu", icon: ClipboardList },
  { title: "All Bookings", url: "/dashboard/bookings", icon: CalendarCheck },
];

// User-only menu
const userMenu = [
  { title: "Manage Users", url: "/dashboard/admin/users", icon: Users },
];

// role can be 'admin' or 'user'
export function AppSidebar({ role = "user" }) {
  const pathname = usePathname();

  return (
    <Sidebar className=' '>
      <SidebarContent>
        {/* ✅ Admin Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4 w-[330px]">
              {adminMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="block w-[330px]">
                      <div
                        className={`flex w-[330px] items-center gap-2 overflow-hidden  p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 ${pathname === item.url ? "bg-gray-100" : ""
                          }`}
                      >
                        <item.icon size={20} />
                        <span className="text-xl">{item.title}</span>
                      </div>
                    </Link>

                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ✅ User Section */}
        {role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>User</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {userMenu.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <div
                          className={`flex  gap-2 px- py-1 ${pathname === item.url ? "bg-gray-100" : ""
                            }`}
                        >
                          <item.icon size={18} />
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
