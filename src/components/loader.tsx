import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

interface LoaderProps {
  className?: string;
  children: React.ReactNode;
  isLoading: boolean;
}

const Loader = ({ className, children, isLoading }: LoaderProps) => {
  return (
    <>
      {isLoading ? (
        <div
          className={cn(
            "w-full flex justify-center items-center py-6",
            className
          )}
        >
          <LoaderIcon className="animate-spin text-foreground/70" />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default Loader;
