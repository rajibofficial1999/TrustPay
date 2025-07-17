"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

const AdminNavbarDropdown = ({ user }: any) => {
  if (!user) {
    return null;
  }

  const firstLetter = user.name.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast("Successfully signed out.");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="size-10 rounded-full p-2 cursor-pointer"
        >
          {firstLetter}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5 w-56">
        <div className="p-2">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
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

export default AdminNavbarDropdown;
