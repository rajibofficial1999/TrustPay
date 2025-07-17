import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  processing?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  className,
  children,
  size = "default",
  variant = "default",
  processing = false,
  ...props
}) => {
  return (
    <Button
      className={cn("w-full mt-5 rounded-full p-6 cursor-pointer", className)}
      variant={variant}
      disabled={processing}
      size={size}
      {...props}
    >
      {processing && <Loader className="animate-spin size-5" />}
      {children}
    </Button>
  );
};

export default CustomButton;
