import React from "react";
import CustomButton from "./custom-button";
import { cn } from "@/lib/utils";

interface Props {
  payment: IPayment;
  processingState: ProcessingStateProps;
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  setStatus: React.Dispatch<React.SetStateAction<PaymentStatus | null>>;
  isMobile?: boolean;
}

const ClientStatusButton: React.FC<Props> = ({
  payment,
  processingState,
  setOpenConfirm,
  setStatus,
  isMobile = false,
}) => {
  return (
    <>
      {payment.status === "pending" && (
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

      {(payment?.status === "cancelled" || payment?.status === "approved") && (
        <div
          className={cn("gap-2", {
            "w-full flex-col flex items-center": isMobile,
            "grid grid-cols-2": !isMobile && payment?.status === "approved",
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
                payment?.status === "approved",
            })}
          >
            Refund Payment
          </CustomButton>

          {payment?.status === "approved" && (
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
