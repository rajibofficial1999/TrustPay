"use client";

import { fetchloggedInUser } from "@/actions/auth";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import PageLoader from "@/components/page-loader";
import { useAuthContext } from "@/contexts/auth-context";
import PusherContextProvider from "@/contexts/pusher-context";
import { useScrollContext } from "@/contexts/scroll-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn, parseErrors } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { isScrolled } = useScrollContext();
  const pathname = usePathname();
  const { isMobile } = useMediaQuery();

  const session = useSession();
  const { setAuthUser } = useAuthContext();

  const {
    data: user,
    error,
    isPending,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchloggedInUser,
    enabled: session && session.status === "authenticated",
    retry: false,
  });

  const handleLogout = async () => {
    try {
      await signOut();
      setAuthUser({
        user: null,
        loading: false,
      });
    } catch (error) {
      const messagge = parseErrors(error);
      console.log(messagge);
    }
  };

  useEffect(() => {
    if (!error) {
      setAuthUser({
        user,
        loading: isPending,
      });
    }

    if (!user && !isPending) {
      handleLogout();
    }
  }, [user, error, isPending]);

  if (session && session.status === "loading" && isPending) {
    return <PageLoader />;
  }

  return (
    <PusherContextProvider>
      <div
        className={cn(
          "w-full bg-primary/10 overflow-y-auto overflow-x-hidden",
          {
            "bg-white": !isScrolled && !isMobile && pathname === "/",
          }
        )}
      >
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1 w-full">{children}</div>
          <Footer />
        </div>
      </div>
    </PusherContextProvider>
  );
};

export default RootLayout;
