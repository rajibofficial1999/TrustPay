"use client";

import {
  deletePaymentMethod,
  getPaymentMethods,
} from "@/actions/payment_method";
import AppAlertDialog from "@/components/app-alert-dialog";
import AppTable from "@/components/app-table";
import PhotoPreview from "@/components/photo-preview";

import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableCell, TableRow } from "@/components/ui/table";

import { useMutation, useQuery } from "@tanstack/react-query";
import { LoaderCircle, PenSquare, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const theads = ["Name", "Payment Key", "Image", "Logo", "Action"];

const PaymentMethodPage = () => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const [deleteableId, setDeleteableId] = useState<string | null>(null);

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      toast("Payment method deleted successfully.");
      setOpenConfirm(false);
      setDeleteableId(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const {
    data: paymentMethods,
    isLoading,
    error,
    refetch,
  } = useQuery<IPaymentMethod[]>({
    queryKey: ["paymentMethods"],
    queryFn: getPaymentMethods,
  });

  if (error) {
    toast(error.message);
  }

  return (
    <>
      {isLoading ? (
        <div
          className="flex justify-center items-center"
          style={{ height: "calc(100vh - 100px)" }}
        >
          <LoaderCircle className="size-20 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center my-2">
            <div>
              <h1 className="text-xl font-semibold">Payment Methods</h1>
              <p className="text-sm text-gray-600">
                Manage all payment methods here.
              </p>
            </div>
            <Link
              href="/admin/payment-methods/create"
              className={buttonVariants({})}
            >
              Create payment method
            </Link>
          </div>
          <div className="border rounded-md mt-4">
            <ScrollArea>
              <AppTable theads={theads}>
                {paymentMethods && paymentMethods.length > 0 ? (
                  paymentMethods.map((paymentMethod) => (
                    <TableRow key={paymentMethod._id}>
                      <TableCell className="py-3 font-semibold">
                        {paymentMethod.name}
                      </TableCell>
                      <TableCell className="py-3">
                        {paymentMethod.paymentKey}
                      </TableCell>
                      <TableCell className="py-3">
                        {paymentMethod.image ? (
                          <PhotoPreview
                            src={paymentMethod.image}
                            alt="image"
                            width={40}
                            height={40}
                            className="cursor-pointer border rounded-md"
                          />
                        ) : (
                          <span className="text-yellow-500">No image</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3">
                        {paymentMethod.logo ? (
                          <Image
                            src={paymentMethod.logo || ""}
                            alt="logo"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <span className="text-yellow-500">No logo</span>
                        )}
                      </TableCell>

                      <TableCell className="py-3 space-x-2">
                        <Link
                          href={`/admin/payment-methods/${paymentMethod._id}`}
                          className={buttonVariants({
                            className: "cursor-pointer",
                            variant: "outline",
                            size: "icon",
                          })}
                        >
                          <PenSquare className="size-4 text-blue-500" />
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => {
                            setOpenConfirm(true);
                            setDeleteableId(paymentMethod._id);
                          }}
                        >
                          <Trash className="size-4 text-destructive/80" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={theads.length}
                      className="text-center py-6"
                    >
                      No payment method found.
                    </TableCell>
                  </TableRow>
                )}
              </AppTable>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <AppAlertDialog
            open={openConfirm}
            setOpen={setOpenConfirm}
            onConfirm={() => handleDelete(deleteableId!)}
            text="Are you sure you want to delete this method?"
            confrimProcessing={isDeleting}
          />
        </>
      )}
    </>
  );
};

export default PaymentMethodPage;
