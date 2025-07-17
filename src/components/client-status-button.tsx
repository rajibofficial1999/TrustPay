import React from "react";
import CustomButton from "./custom-button";
import { cn } from "@/lib/utils";

interface Props {
  transaction: ITransaction;
  processingState: ProcessingStateProps;
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  setStatus: React.Dispatch<React.SetStateAction<TransactionStatus | null>>;
  isMobile?: boolean;
}

const ClientStatusButton: React.FC<Props> = ({
  transaction,
  processingState,
  setOpenConfirm,
  setStatus,
  isMobile = false,
}) => {
  return (
    <>
      {transaction.status === "pending" && (
        <CustomButton
          processing={processingState["cancelled"]}
          onClick={() => {
            setOpenConfirm(true);
            setStatus("cancelled");
          }}
          className="text-white mt-0 bg-destructive/70 hover:bg-destructive/80"
        >
          Cancel Payment
        </CustomButton>
      )}

      {(transaction?.status === "cancelled" ||
        transaction?.status === "approved") && (
        <div
          className={cn("gap-2", {
            "w-full flex-col flex items-center": isMobile,
            "grid grid-cols-2": !isMobile && transaction?.status === "approved",
          })}
        >
          <CustomButton
            processing={processingState["refund_requested"]}
            onClick={() => {
              setOpenConfirm(true);
              setStatus("refund_requested");
            }}
            className={cn("text-white mt-0 bg-green-500 hover:bg-green-600", {
              "!bg-destructive/70 hover:!bg-destructive/80":
                transaction?.status === "approved",
            })}
          >
            Refund Payment
          </CustomButton>

          {transaction?.status === "approved" && (
            <CustomButton
              processing={processingState["released"]}
              onClick={() => {
                setOpenConfirm(true);
                setStatus("released");
              }}
              className="text-white mt-0 bg-green-500 hover:bg-green-600"
            >
              Release
            </CustomButton>
          )}
        </div>
      )}
    </>
  );
};

export default ClientStatusButton;
