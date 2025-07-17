import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer } from "vaul";
import CustomButton from "./custom-button";
import { Button } from "./ui/button";

interface AppAlertDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void | Promise<void>;
  text: string;
  confrimProcessing: boolean;
  title?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  cancelButtonClassName?: string;
  confirmButtonClassName?: string;
  warningText?: string;
}

const AppAlertDialog = ({
  open,
  setOpen,
  onConfirm,
  text,
  title,
  confrimProcessing,
  cancelButtonText,
  confirmButtonText,
  cancelButtonClassName,
  confirmButtonClassName,
  warningText,
}: AppAlertDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const { isMobile } = useMediaQuery();
  if (isMobile) {
    return (
      <Drawer.Root open={open} onOpenChange={(value) => setOpen(value)}>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-gray-100 bg-opacity-10 backdrop-blur" />
        <Drawer.Portal>
          <Drawer.Content className="fixed !max-w-none bottom-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t border-gray-200 bg-white">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
            </div>

            <div className="p-6">
              <Drawer.Title className="font-semibold text-lg text-foreground/80">
                {title || "Are you absolutely sure?"}
              </Drawer.Title>
              <Drawer.Description className="text-foreground/80">
                {text}
              </Drawer.Description>

              <div>
                {warningText && (
                  <div className="flex items-start gap-1 mt-4 text-start italic">
                    <TriangleAlert className="size-4 text-yellow-600" />
                    <span className="text-sm text-destructive/70 -mt-0.5">
                      <span className="font-semibold">Importand</span>:{" "}
                      {warningText}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-6 pb-5 gap-2">
                <Button
                  onClick={() => setOpen(false)}
                  variant="outline"
                  className="rounded-full"
                >
                  {cancelButtonText || "Cancel"}
                </Button>
                <Button
                  disabled={confrimProcessing}
                  className="rounded-full"
                  onClick={handleConfirm}
                >
                  {confrimProcessing && (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  )}
                  {confirmButtonText || "Confirm"}
                </Button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span>{text}</span>
            {warningText && (
              <div className="flex items-start gap-1 mt-4 text-start italic">
                <TriangleAlert className="size-4 text-yellow-600" />
                <span className="text-sm text-destructive/70 -mt-0.5">
                  <span className="font-semibold">Importand</span>:{" "}
                  {warningText}
                </span>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={cn("cursor-pointer", cancelButtonClassName)}
            onClick={() => setOpen(false)}
          >
            {cancelButtonText || "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn("cursor-pointer", confirmButtonClassName)}
            onClick={handleConfirm}
            disabled={confrimProcessing}
          >
            {confrimProcessing && (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            )}
            {confirmButtonText || "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AppAlertDialog;
