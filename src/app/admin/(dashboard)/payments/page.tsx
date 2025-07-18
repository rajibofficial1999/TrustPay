"use client";

import {
  deletePayment,
  getPayments,
  updatePaymentStatus,
} from "@/actions/payment";
import AppAlertDialog from "@/components/app-alert-dialog";
import AppTable from "@/components/app-table";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableCell, TableRow } from "@/components/ui/table";

import { useMutation, useQuery } from "@tanstack/react-query";
import { LoaderCircle, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import PhotoPreview from "@/components/photo-preview";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, parseErrors } from "@/lib/utils";

interface ActionsType {
  [key: string]: PaymentStatus[];
}

const theads = [
  "User email",
  "Payment method",
  "Amount",
  "Phone number",
  "Holder name",
  "Receiver",
  "Screenshots",
  "Status",
  "Action",
];

const actions: ActionsType = {
  pending: ["approved", "cancelled", "failed"],
  approved: ["cancelled", "refunded", "pending", "failed"],
  released: ["cancelled", "refunded", "pending", "failed"],
  refunded: [],
  failed: ["cancelled", "refunded", "pending", "approved"],
  cancelled: ["refunded", "approved", "failed", "pending"],
  refund_requested: ["refunded", "cancelled", "failed", "pending"],
};

const PaymentsPage = () => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const [deleteableId, setDeleteableId] = useState<string | null>(null);

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      toast("Payment deleted successfully.");
      setOpenConfirm(false);
      setDeleteableId(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const {
    data: payments,
    isLoading,
    error,
    refetch,
  } = useQuery<IPayment[]>({
    queryKey: ["admin_payments"],
    queryFn: getPayments,
  });

  if (error) {
    toast(error.message);
  }

  const { mutate: handleStatus, isPending: statusProcessing } = useMutation({
    mutationFn: updatePaymentStatus,
    onSuccess: () => {
      refetch();
      toast("Payment status updated successfully.");
    },
    onError: (error: any) => {
      const message = parseErrors(error);
      toast(message);
    },
  });

  const handleStatusChange = (
    currentPayment: IPayment,
    status: PaymentStatus
  ) => {
    if (status === currentPayment.status) return;

    handleStatus({ id: currentPayment._id, status });
  };

  const filterStatuses = (status: PaymentStatus) => {
    if (actions[status]) {
      return [status, ...actions[status]];
    }
    return [status];
  };

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
              <h1 className="text-xl font-semibold">Payments</h1>
              <p className="text-sm text-gray-600">Manage all payments here.</p>
            </div>
          </div>
          <div className="border rounded-md mt-4">
            <ScrollArea>
              <AppTable theads={theads}>
                {payments && payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell className="py-3 font-semibold">
                        {(payment.user as IUser).email}
                      </TableCell>
                      <TableCell className="py-3">
                        {(payment.paymentMethod as IPaymentMethod).name}
                      </TableCell>

                      <TableCell className="py-3">${payment.amount}</TableCell>

                      <TableCell className="py-3">
                        {payment.phoneNumber}
                      </TableCell>

                      <TableCell className="py-3">
                        {payment.senderAccountHolderName}
                      </TableCell>

                      <TableCell className="py-3">
                        {payment.destinationAcountKey}
                      </TableCell>

                      <TableCell className="py-3">
                        <div
                          className={cn("grid gap-2", {
                            "grid-cols-1":
                              payment.paymentScreenshots.length === 1,
                            "grid-cols-2":
                              payment.paymentScreenshots.length === 2,
                            "grid-cols-3":
                              payment.paymentScreenshots.length >= 3,
                          })}
                        >
                          {payment.paymentScreenshots.map((screenshot) => (
                            <PhotoPreview
                              key={screenshot}
                              src={screenshot}
                              alt="screenshot"
                              className="rounded-md cursor-pointer w-full h-16 object-cover border"
                              width={40}
                              height={40}
                            />
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="py-3 ">
                        <Select
                          defaultValue={payment.status}
                          onValueChange={(value) =>
                            handleStatusChange(payment, value as PaymentStatus)
                          }
                        >
                          <SelectTrigger disabled={statusProcessing}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {filterStatuses(payment.status).map((status) => (
                                <SelectItem key={status} value={status}>
                                  <span className="capitalize">{status}</span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell className="py-3 space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => {
                            setOpenConfirm(true);
                            setDeleteableId(payment._id);
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
                      No payment found.
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
            text="Are you sure you want to delete this payment?"
            confrimProcessing={isDeleting}
          />
        </>
      )}
    </>
  );
};

export default PaymentsPage;
