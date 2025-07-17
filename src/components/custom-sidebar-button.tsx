"use client";

import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";

const CustomSidebarButton = () => {
  const { open, toggleSidebar } = useSidebar();

  return (
    <Button
      size="icon"
      variant="ghost"
      className="cursor-pointer"
      onClick={toggleSidebar}
    >
      {open ? (
        <ArrowLeftToLine className="size-5" />
      ) : (
        <ArrowRightToLine className="size-5" />
      )}
    </Button>
  );
};

export default CustomSidebarButton;
