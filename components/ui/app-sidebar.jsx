"use client";

import {
  UserCircle,
  UtensilsCrossed,
  Users,
  ClipboardList,
  CalendarCheck,
  ChevronUp,
  Crown,
  ScrollText
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useSession } from "next-auth/react";



// Admin-specific menu
const adminMenu = [
  { title: "Profile", url: "/dashboard/profile", icon: UserCircle },
  { title: "Add Menu", url: "/dashboard/add-menu", icon: UtensilsCrossed },
  { title: "Manage User", url: "/dashboard/manage-users", icon: Users },
  { title: "Manage Menu", url: "/dashboard/manage-menu", icon: ClipboardList },
  { title: "All Bookings", url: "/dashboard/all-bookings", icon: CalendarCheck },
  { title: "Payment History", url: "/dashboard/payment-History", icon: ScrollText },
];

// User-only menu
const userMenu = [
  { title: "Profile", url: "/dashboard/profile", icon: UserCircle },
  { title: "My Orders", url: "/dashboard/my-orders", icon: ClipboardList },
  { title: "My Bookings", url: "/dashboard/my-bookings", icon: CalendarCheck },
  { title: "Payment History", url: "/dashboard/payment-History", icon: ScrollText },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const role = session?.user?.role;
  const email = session?.user?.email;

  return (
    <Sidebar className=" ">
      <SidebarHeader />
      <SidebarContent>
        {/* ✅ Admin Section */}
        {role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-4 w-full">
                {adminMenu.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="block w-[330px]">
                        <div
                          className={`flex w-[250px] items-center gap-2 overflow-hidden p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-gray-100 data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 ${pathname === item.url ? "bg-gray-100" : ""}`}
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
        )}

        {/* ✅ User Section */}
        {role === "customer" && (
          <SidebarGroup>
            <SidebarGroupLabel>My DashBoard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-4 w-full">
                {userMenu.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <div
                           className={`flex w-[250px] items-center gap-2 overflow-hidden p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-gray-100 data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 ${pathname === item.url ? "bg-gray-100" : ""}`}
                        >
                          <item.icon size={18} />
                          <span className="text-xl">{item.title}</span>
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
      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || "https://i.ibb.co.com/PfGH0x7/c-HJpdm-F0-ZS9sci9pb-WFn-ZXMvd2-Vic2l0-ZS8y-MDIz-LTAx-L3-Jt-Nj-A5-LXNvb-Glka-WNvbi13-LTAw-Mi1w-Ln-Bu.jpg"} alt={session?.user?.name || "User"} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-orange-600">
                  {session?.user?.name || "Anonymous"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {session?.user?.email || "No email"}
                </span>
              </div>

              <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-full p-1 m-2">
            <DropdownMenuItem className='hover:bg-yellow-100 bg-yellow-400'>Upgrade to Pro <Crown className="text-back" /></DropdownMenuItem>
            <DropdownMenuItem><Link href="/">Home</Link></DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
