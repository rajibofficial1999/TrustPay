"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/contexts/auth-context";
import { Captions, ChevronDown, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";

const NavbarDropdown = ({ user }: { user: IUser }) => {
  const { setAuthUser } = useAuthContext();

  const handleSignOut = async () => {
    try {
      setAuthUser(null);
      await signOut();
      toast("Successfully signed out.");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 cursor-pointer flex items-center outline-none border-none focus:outline-none focus:border-none font-semibold">
          <div>{user?.fullName || user.email}</div>
          <ChevronDown className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5 w-56">
        <DropdownMenuItem className="cursor-pointer py-2" asChild>
          <Link href="/my-account">
            <User />
            <span>My account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer py-2" asChild>
          <Link href="/transactions">
            <Captions />
            <span>Transactions</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer py-2 text-destructive/80 hover:!text-destructive/80"
          onClick={handleSignOut}
        >
          <LogOut className="text-destructive/80" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarDropdown;
