"use client";

import {
  deleteTransaction,
  getTransactions,
  updateTransactionStatus,
} from "@/actions/transaction";
import AppAlertDialog from "@/components/app-alert-dialog";
import AppTable from "@/components/app-table";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableCell, TableRow } from "@/components/ui/table";

import { useMutation, useQuery } from "@tanstack/react-query";
import { LoaderCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseErrors } from "@/lib/utils";
import PhotoPreview from "@/components/photo-preview";

interface ActionsType {
  [key: string]: TransactionStatus[];
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
  cancelled: ["refunded"],
  refund_requested: ["refunded"],
};

const TransactionsPage = () => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const [deleteableId, setDeleteableId] = useState<string | null>(null);

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      toast("Transaction deleted successfully.");
      setOpenConfirm(false);
      setDeleteableId(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useQuery<ITransaction[]>({
    queryKey: ["admin_transactions"],
    queryFn: getTransactions,
  });

  if (error) {
    toast(error.message);
  }

  const { mutate: handleStatus, isPending: statusProcessing } = useMutation({
    mutationFn: updateTransactionStatus,
    onSuccess: () => {
      refetch();
      toast("Transaction status updated successfully.");
    },
    onError: (error: any) => {
      const message = parseErrors(error);
      toast(message);
    },
  });

  const handleStatusChange = (
    currentTransaction: ITransaction,
    status: TransactionStatus
  ) => {
    if (status === currentTransaction.status) return;

    handleStatus({ id: currentTransaction._id, status });
  };

  const filterStatuses = (status: TransactionStatus) => {
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
              <h1 className="text-xl font-semibold">Transactions</h1>
              <p className="text-sm text-gray-600">
                Manage all transactions here.
              </p>
            </div>
          </div>
          <div className="border rounded-md mt-4">
            <ScrollArea>
              <AppTable theads={theads}>
                {transactions && transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="py-3 font-semibold">
                        {(transaction.user as IUser).email}
                      </TableCell>
                      <TableCell className="py-3">
                        {(transaction.paymentMethod as IPaymentMethod).name}
                      </TableCell>

                      <TableCell className="py-3">
                        ${transaction.amount}
                      </TableCell>

                      <TableCell className="py-3">
                        {transaction.phoneNumber}
                      </TableCell>

                      <TableCell className="py-3">
                        {transaction.senderAccountHolderName}
                      </TableCell>

                      <TableCell className="py-3">
                        {transaction.destinationAcountKey}
                      </TableCell>

                      <TableCell className="py-3">
                        <div className="grid grid-cols-3 gap-2">
                          {transaction.paymentScreenshots.map((screenshot) => (
                            <PhotoPreview
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
                          defaultValue={transaction.status}
                          onValueChange={(value) =>
                            handleStatusChange(
                              transaction,
                              value as TransactionStatus
                            )
                          }
                        >
                          <SelectTrigger disabled={statusProcessing}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {filterStatuses(transaction.status).map(
                                (status) => (
                                  <SelectItem key={status} value={status}>
                                    <span className="capitalize">{status}</span>
                                  </SelectItem>
                                )
                              )}
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
                            setDeleteableId(transaction._id);
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

export default TransactionsPage;
