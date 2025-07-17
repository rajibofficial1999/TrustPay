import React from "react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const TransactionStatus = ({ status }: { status: TransactionStatus }) => {
  const filterStatus = status.replace(/_/g, " ");

  return (
    <Badge
      className={cn("py-1 rounded-full capitalize", {
        "!bg-green-500/30 !text-green-700": status === "approved",
        "!bg-yellow-500/30 !text-yellow-700":
          status === "pending" || status === "refund_requested",
        "!bg-red-500/30 !text-red-700":
          status === "cancelled" || status === "failed",
        "!bg-gray-500/30 !text-gray-700": status === "refunded",
        "!bg-blue-500/30 !text-blue-700": status === "released",
      })}
    >
      {filterStatus}
    </Badge>
  );
};

export default TransactionStatus;
