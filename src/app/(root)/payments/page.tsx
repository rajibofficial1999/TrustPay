import PaymentTable from "@/components/payment-table";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const PaymentPage = () => {
  return (
    <div className="container mt-10">
      <div className="max-w-3xl lg:max-w-4xl bg-white w-full mx-auto py-10 px-6 sm:px-10 rounded-xl flex flex-col items-center text-foreground/80">
        <div className="w-full">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Payments</h1>
              <Link
                href="/make-payment"
                className={buttonVariants({
                  variant: "outline",
                  className: "!rounded-full !px-4 py-5",
                })}
              >
                <Plus className="size-4" />
                Make a Payment
              </Link>
            </div>
            <p className="text-foreground/70">
              Recent Payment Activity. See Instant Updates on Completed
              Payments.
            </p>
          </div>
          <PaymentTable className="mt-4" />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
