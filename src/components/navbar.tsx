"use client";

import { useAuthContext } from "@/contexts/auth-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import NavbarDropdown from "./navbar-dropdown";
import { buttonVariants } from "./ui/button";

const Navbar = () => {
  const { user, loading } = useAuthContext();

  const { isMobile } = useMediaQuery();

  return (
    <div
      className={cn("flex justify-between items-center py-4 container", {
        "bg-white shadow-sm": isMobile,
      })}
    >
      <Link href="/">
        <img
          src="/images/logo.png"
          className="hidden sm:block w-40"
          alt="logo"
        />
        <img
          src="/images/logo_mobile.png"
          className="block sm:hidden size-8"
          alt="logo"
        />
      </Link>
      {!loading &&
        (user ? (
          <NavbarDropdown user={user} />
        ) : (
          <Link
            href="/register"
            className={buttonVariants({
              className: "!rounded-full !px-4 py-5",
            })}
          >
            Get Started
          </Link>
        ))}
    </div>
  );
};

export default Navbar;
