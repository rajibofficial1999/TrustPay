"use client";

import { getTransactions } from "@/actions/transaction";
import { cn, formatted } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { WalletCards } from "lucide-react";
import Image from "next/image";
import Loader from "./loader";
import ShowData from "./show-data";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import TransactionStatus from "./transaction-status";

interface TransactionTableProps {
  isLimited?: boolean;
  className?: string;
}

const TransactionTable = ({
  isLimited = false,
  className,
}: TransactionTableProps) => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  const { data, isPending } = useQuery<ITransaction[]>({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
  });

  useEffect(() => {
    if (data) {
      if (isLimited) {
        setTransactions(data.slice(0, 5));
        return;
      }

      setTransactions(data);
    }
  }, [data, isLimited]);

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <div className="">
        <Loader isLoading={isPending}>
          <ShowData data={transactions} label="Transactions not found">
            {transactions &&
              transactions.map((transaction) => (
                <Link
                  href={`/transactions/${transaction._id}`}
                  key={transaction._id}
                  className={cn(
                    "cursor-pointer w-full text-start flex justify-between items-center p-2 border-b border-gray-200 last:border-b-0 hover:bg-muted/50 data-[state=selected]:bg-muted rounded-md"
                  )}
                >
                  <div className="flex items-start gap-x-2">
                    {(transaction.paymentMethod as IPaymentMethod).logo ? (
                      <Image
                        src={
                          (transaction.paymentMethod as IPaymentMethod)
                            .logo as string
                        }
                        alt={(transaction.paymentMethod as IPaymentMethod).name}
                        width={33}
                        height={33}
                        className="rounded-md object-contain"
                      />
                    ) : (
                      <div className="size-9 bg-gray-200 rounded-full flex justify-center items-center">
                        <WalletCards className="size-5 text-gray-500" />
                      </div>
                    )}

                    <div>
                      <h1 className="font-semibold capitalize text-sm text-foreground/70">
                        {(transaction.paymentMethod as IPaymentMethod).name}
                      </h1>
                      <p className="text-xs text-foreground/70">
                        {transaction.senderAccountHolderName}
                      </p>
                      <span className="text-xs text-foreground/60">
                        {formatted(transaction.createdAt.toString())}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <h1 className="text-gray-600 text-sm">
                      $
                      <span className="text-lg font-semibold">
                        {transaction.amount}
                      </span>
                    </h1>
                    <TransactionStatus status={transaction.status} />
                  </div>
                </Link>
              ))}
          </ShowData>
        </Loader>
      </div>
      {isLimited && data && data.length > 5 && (
        <div className="text-center mt-5">
          <Link
            href="/send-money"
            className={buttonVariants({
              variant: "outline",
              className: "!rounded-full !px-4 py-5",
            })}
          >
            View more
          </Link>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
