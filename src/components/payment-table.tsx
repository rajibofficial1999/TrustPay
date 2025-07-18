"use client";

import { getPayments } from "@/actions/payment";
import { cn, formatted } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { WalletCards } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "./loader";
import PaymentStatusBadge from "./payment-status-badge";
import ShowData from "./show-data";
import { buttonVariants } from "./ui/button";

interface PaymentTableProps {
  isLimited?: boolean;
  className?: string;
}

const PaymentTable = ({ isLimited = false, className }: PaymentTableProps) => {
  const [payments, setPayments] = useState<IPayment[]>([]);

  const { data, isPending } = useQuery<IPayment[]>({
    queryKey: ["payments"],
    queryFn: () => getPayments(),
  });

  useEffect(() => {
    if (data) {
      if (isLimited) {
        setPayments(data.slice(0, 5));
        return;
      }

      setPayments(data);
    }
  }, [data, isLimited]);

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <div className="">
        <Loader isLoading={isPending}>
          <ShowData data={payments} label="Payment not found">
            {payments &&
              payments.map((payment) => (
                <Link
                  href={`/payments/${payment._id}`}
                  key={payment._id}
                  className={cn(
                    "cursor-pointer w-full text-start flex justify-between items-center p-2 border-b border-gray-200 last:border-b-0 hover:bg-muted/50 data-[state=selected]:bg-muted rounded-md"
                  )}
                >
                  <div className="flex items-start gap-x-2">
                    {(payment.paymentMethod as IPaymentMethod).logo ? (
                      <Image
                        src={
                          (payment.paymentMethod as IPaymentMethod)
                            .logo as string
                        }
                        alt={(payment.paymentMethod as IPaymentMethod).name}
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
                        {(payment.paymentMethod as IPaymentMethod).name}
                      </h1>
                      <p className="text-xs text-foreground/70">
                        {payment.senderAccountHolderName}
                      </p>
                      <span className="text-xs text-foreground/60">
                        {formatted(payment.createdAt.toString())}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <h1 className="text-gray-600 text-sm">
                      $
                      <span className="text-lg font-semibold">
                        {payment.amount}
                      </span>
                    </h1>
                    <PaymentStatusBadge status={payment.status} />
                  </div>
                </Link>
              ))}
          </ShowData>
        </Loader>
      </div>
      {isLimited && data && data.length > 5 && (
        <div className="text-center mt-5">
          <Link
            href="/make-payment"
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

export default PaymentTable;
