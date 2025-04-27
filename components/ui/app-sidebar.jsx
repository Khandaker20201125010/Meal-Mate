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
import { usePathname, useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { Button } from "./button";
import { loadStripe } from "@stripe/stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Elements } from "@stripe/react-stripe-js";
import SubscriptionCheckoutForm from "@/src/app/(Dashboard)/Componenets/Payments/SubscriptionCheckoutForm";
import Swal from "sweetalert2";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Admin-specific menu
const adminMenu = [
  { title: "Profile", url: "/dashboard/profile", icon: UserCircle },
  { title: "Add Menu", url: "/dashboard/add-menu", icon: UtensilsCrossed },
  { title: "Manage User", url: "/dashboard/manage-users", icon: Users },
  { title: "Manage Menu", url: "/dashboard/manage-menu", icon: ClipboardList },
  { title: "All Bookings", url: "/dashboard/all-bookings", icon: CalendarCheck },
  { title: "Check Reservation", url: "/dashboard/check-reservation", icon: CalendarCheck },
  { title: "Payment History", url: "/dashboard/payment-History", icon: ScrollText },
];

// User-only menu
const userMenu = [
  { title: "Profile", url: "/dashboard/profile", icon: UserCircle },
  { title: "My Orders", url: "/dashboard/my-orders", icon: ClipboardList },
  { title: "My Bookings", url: "/dashboard/my-bookings", icon: CalendarCheck },
  { title: "my Reservation", url: "/dashboard/my-reservation", icon: CalendarCheck },
  { title: "Payment History", url: "/dashboard/payment-History", icon: ScrollText },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role;
  const email = session?.user?.email;

  // State for modals
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgradeToPro = () => {
    setIsSubscriptionModalOpen(true);
  };

  const handleSuccess = () => {
    setIsSubscriptionModalOpen(false);

    // Create a simple confetti effect using CSS
    const showConfetti = () => {
      const colors = ['#f97316', '#22c55e', '#3b82f6', '#eab308', '#a855f7'];
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '9999';

      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = '-10px';
        confetti.style.opacity = '0.8';

        const animation = confetti.animate(
          [
            { transform: 'translateY(0) rotate(0deg)', opacity: 0.8 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
          ],
          {
            duration: 2000 + Math.random() * 3000,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
          }
        );

        animation.onfinish = () => confetti.remove();
        container.appendChild(confetti);
      }

      document.body.appendChild(container);
      setTimeout(() => container.remove(), 3000);
    };

    Swal.fire({
      title: '<strong>Premium Activated!</strong>',
      html: `
        <div class="text-center">
          <div class="animate-bounce mb-4">
            <svg class="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <p class="text-lg text-gray-700">You're now part of our MealMate Pro family!</p>
          <p class="text-sm text-gray-500 mt-2">Check your email for subscription details.</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: 'Got it!',
      confirmButtonColor: '#f97316',
      background: '#fff7ed',
      backdrop: 'rgba(0,0,0,0.4)',
      timer: 8000,
      timerProgressBar: true,
      didOpen: () => {
        showConfetti();
        // Use browser's built-in audio if available
        if (typeof window !== 'undefined' && window.Audio) {
          try {
            // Simple beep sound using the Web Audio API
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'triangle';
            oscillator.frequency.value = 880;
            gainNode.gain.value = 0.1;

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
            oscillator.stop(audioCtx.currentTime + 1);
          } catch (e) {
            console.log('Audio playback error:', e);
          }
        }
      }
    });
  };

  return (
    <Sidebar className=" ">
      <SidebarHeader />
      <SidebarContent>
        {/* Admin Section */}
        {role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>('MEALMATE') Admin Dashboard</SidebarGroupLabel>
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

        {/* User Section */}
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
            <DropdownMenuItem
              className='hover:bg-yellow-100 bg-yellow-400'
              onClick={handleUpgradeToPro}
            >
              Upgrade to Pro <Crown className="text-back" />
            </DropdownMenuItem>
            <DropdownMenuItem><Link href="/">Home</Link></DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await signOut({ redirect: false });
                router.push('/login');
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      {/* Subscription Modal */}
      <Dialog open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">Upgrade to Pro   <Crown className="text-yellow-500" /></DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Get access to premium features for just $9/month!
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Crown className="text-yellow-500" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="text-yellow-500" />
                <span>Advanced discount</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="text-yellow-500" />
                <span>Exclusive features</span>
              </div>
            </div>

            <Elements stripe={stripePromise}>
              <SubscriptionCheckoutForm
                email={session?.user?.email}
                onSuccess={handleSuccess}
              />
            </Elements>
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}