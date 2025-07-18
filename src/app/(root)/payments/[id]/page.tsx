"use client";

import {
  getPayment,
  updatePaymentStatus,
  uploadScreenshot,
} from "@/actions/payment";
import AppAlertDialog from "@/components/app-alert-dialog";
import ClientStatusButton from "@/components/client-status-button";
import CustomButton from "@/components/custom-button";
import Loader from "@/components/loader";
import PaymentStatusBadge from "@/components/payment-status-badge";
import PhotoPreview from "@/components/photo-preview";
import { cn, formatted, parseErrors } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoaderCircle, Plus, WalletCards } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";

const PaymentDetailsPage = () => {
  const params = useParams();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [openConfirm, setOpenConfirm] = useState(false);
  const [status, setStatus] = useState<PaymentStatus | null>(null);

  const [processingState, setProcessingState] = useState<ProcessingStateProps>({
    refund_requested: false,
    released: false,
  });

  const uploadRef = useRef<HTMLInputElement>(null);

  const {
    data: payment,
    isPending,
    refetch,
    error,
  } = useQuery<IPayment>({
    queryKey: ["payment", params.id],
    queryFn: () => getPayment(params.id as string),
    enabled: !!params.id,
    retry: false,
  });

  const { mutate: handleStatus, isPending: statusProcessing } = useMutation({
    mutationFn: updatePaymentStatus,
    onSuccess: () => {
      refetch();
      setOpenConfirm(false);
      setStatus(null);
    },
    onError: (error: any) => {
      const message = parseErrors(error);
      setErrorMessage(message);
    },
    onSettled: () => {
      setProcessingState({
        refund_requested: false,
        released: false,
      });
    },
  });

  const { mutate: handleUploadScreenshot, isPending: isUploading } =
    useMutation({
      mutationFn: uploadScreenshot,
      onSuccess: () => {
        refetch();
        setPreviewImage(null);
        setErrorMessage("");
        if (uploadRef.current) {
          uploadRef.current.value = "";
        }
      },
      onError: (error: any) => {
        const message = parseErrors(error);
        setErrorMessage(message);
      },
    });

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const imageFile = event.target.files?.[0];

    if (!imageFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };

    reader.readAsDataURL(imageFile);

    const formData = new FormData();
    formData.append("screenshot", imageFile);

    handleUploadScreenshot({ id: params.id as string, fd: formData });
  };

  return (
    <div className="container">
      <div className="max-w-3xl lg:max-w-4xl bg-white w-full mx-auto py-10 px-6 sm:px-10 rounded-xl flex flex-col items-center text-foreground/80 mt-10">
        <Loader isLoading={isPending}>
          <div className="w-full">
            <div>
              <h1 className="text-xl font-bold">Payment details</h1>
              <p className="text-foreground/70">
                Your Payment History. Track Every Dollar Sent, Received or
                Refunded.
              </p>
            </div>
            {error && (
              <div className="flex flex-col items-center justify-center mt-10">
                <div className="mt-2 text-sm text-red-500">{error.message}</div>

                {error.message.includes("404") && (
                  <Link href="/payments">
                    <CustomButton className="mt-4">Go to payments</CustomButton>
                  </Link>
                )}
              </div>
            )}
            {payment && !error && (
              <>
                <div className="flex justify-between items-center mt-7">
                  <div className="flex gap-2">
                    {(payment.paymentMethod as IPaymentMethod).logo ? (
                      <Image
                        src={
                          (payment.paymentMethod as IPaymentMethod)
                            .logo as string
                        }
                        alt={(payment.paymentMethod as IPaymentMethod).name}
                        width={38}
                        height={38}
                        className="rounded-md object-contain border py-0.5 px-1.5"
                      />
                    ) : (
                      <div className="size-10 bg-gray-200 rounded-full flex justify-center items-center">
                        <WalletCards className="size-5 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <h1 className="font-semibold capitalize text-foreground/70">
                        {(payment.paymentMethod as IPaymentMethod).name}
                      </h1>
                      <p className="text-sm text-foreground/70">
                        {payment.senderAccountHolderName}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:inline-block">
                    <ClientStatusButton
                      payment={payment}
                      processingState={processingState}
                      setOpenConfirm={setOpenConfirm}
                      setStatus={setStatus}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <ListItem>
                    <h2 className="font-semibold text-foreground/70">Amount</h2>
                    <p className="text-foreground/70">
                      $<span>{payment.amount}</span>
                    </p>
                  </ListItem>
                  <ListItem>
                    <h2 className="font-semibold text-foreground/70">
                      Receiver
                    </h2>
                    <p className="text-foreground/70">
                      {payment.destinationAcountKey}
                    </p>
                  </ListItem>
                  <ListItem>
                    <h2 className="font-semibold text-foreground/70">
                      Phone number
                    </h2>
                    <p className="text-foreground/70">{payment.phoneNumber}</p>
                  </ListItem>
                  <ListItem>
                    <h2 className="font-semibold text-foreground/70">Status</h2>
                    <PaymentStatusBadge status={payment.status} />
                  </ListItem>
                  <ListItem>
                    <h2 className="font-semibold text-foreground/70">
                      Paid at
                    </h2>
                    <p className="text-foreground/70 text-sm">
                      {formatted(payment.createdAt.toString())}
                    </p>
                  </ListItem>
                  <ListItem className="items-start flex-col">
                    <h2 className="font-semibold text-foreground/70">
                      Screenshots
                    </h2>
                    <div className="w-full grid-cols-2 grid sm:grid-cols-3 gap-2">
                      {payment.paymentScreenshots.map(
                        (screenshot: string, index: number) => (
                          <div
                            key={index}
                            className="mt-2 rounded-md relative h-52 sm:h-72 w-full"
                          >
                            <PhotoPreview
                              src={screenshot}
                              alt="screenshot"
                              className="object-contain rounded-md border cursor-pointer"
                            />
                          </div>
                        )
                      )}
                      {isUploading && previewImage ? (
                        <div className="mt-2 rounded-md relative h-52 sm:h-72 w-full">
                          <Image
                            src={previewImage || ""}
                            alt="Preview"
                            className="object-contain rounded-md border cursor-pointer"
                            fill
                          />

                          <div className="absolute top-0 right-0 inset-0 bg-black/20 rounded-md flex items-center justify-center">
                            <LoaderCircle className="animate-spin text-white" />
                          </div>
                        </div>
                      ) : (
                        <label
                          title="Add screenshot"
                          className="mt-2 border-2 border-dashed rounded-md relative h-52 sm:h-72 w-full cursor-pointer flex flex-col items-center justify-center"
                        >
                          <input
                            ref={uploadRef}
                            onChange={handleChangeFile}
                            type="file"
                            className="hidden"
                            accept="image/*"
                          />
                          <Plus className="size-6 sm:size-8 text-foreground/70" />
                          <span className="font-semibold text-foreground/70 text-nowrap text-sm">
                            Upload screenshot
                          </span>
                        </label>
                      )}
                    </div>
                  </ListItem>
                  {errorMessage && (
                    <div className="mt-2 text-sm text-red-500">
                      {errorMessage}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {payment && !error && (
            <div className="flex justify-end mt-10 items-center w-full sm:hidden">
              <ClientStatusButton
                payment={payment}
                processingState={processingState}
                setOpenConfirm={setOpenConfirm}
                setStatus={setStatus}
                isMobile={true}
              />
            </div>
          )}
        </Loader>

        <AppAlertDialog
          open={openConfirm && !!status}
          setOpen={setOpenConfirm}
          onConfirm={() => {
            if (!status) return;
            setProcessingState((prev) => ({
              ...prev,
              [status]: true,
            }));
            handleStatus({ id: params.id as string, status });
          }}
          text={
            status === "refund_requested"
              ? "Are you sure you want to refund this payment?"
              : "Are you sure you want to release this payment?"
          }
          title={
            status === "refund_requested"
              ? "Refund Request"
              : "Release confirmation"
          }
          confirmButtonClassName="rounded-full !py-3"
          cancelButtonClassName="rounded-full !py-3"
          confrimProcessing={statusProcessing}
          warningText={
            status === "released"
              ? "Once released, the payment cannot be cancelled or refunded."
              : ""
          }
        />
      </div>
    </div>
  );
};

const ListItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex justify-between items-center border-b border-gray-200 last:border-b-0 py-3",
      className
    )}
  >
    {children}
  </div>
);

export default PaymentDetailsPage;
