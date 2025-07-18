"use client";

import AdminNavbarDropdown from "@/components/admin-navbar-dropdown";
import { AppSidebar } from "@/components/app-sidebar";
import CustomSidebarButton from "@/components/custom-sidebar-button";
import PageLoader from "@/components/page-loader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { pusherClient } from "@/lib/pusher-client";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (session && session.status === "authenticated") {
      const { user } = session.data;
      const channel = pusherClient.subscribe(`private-user-${user.id}`);

      channel.bind("payment-created", (_payment: IPayment) => {
        const audio = new Audio("/media/sound.wav");
        audio.play().catch((err) => {
          console.error("Audio play failed:", err);
        });

        queryClient.invalidateQueries(["admin_payments"] as any);
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [session]);

  if (session && session.status === "loading") {
    return <PageLoader />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full overflow-x-hidden">
        <nav className="flex items-center justify-between w-full border-b h-[60px] px-2">
          <div>
            <CustomSidebarButton />
          </div>
          <div>
            <AdminNavbarDropdown user={session?.data?.user || null} />
          </div>
        </nav>
        <div className="p-[20px]">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default layout;
