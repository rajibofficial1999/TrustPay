import { createPayment } from "@/actions/payment";
import { parseErrors } from "@/lib/utils";
import { paymentSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "./custom-button";
import ErrorMessage from "./error-message";
import FileInput from "./file-input";
import { Alert, AlertTitle } from "./ui/alert";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface PaymentFormProps {
  method: string;
}

const PaymentForm = ({ method }: PaymentFormProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const queryClient = useQueryClient();

  const {
    handleSubmit,
    setValue,
    reset,
    register,
    setError,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const imageFile = event.target.files?.[0];

    setValue("paymentScreenshot", event.target.files);
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const { mutate: handleCreatePayment, isPending: isCreating } = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      reset();
      setAmount("");
      setPreviewImage(null);
      queryClient.invalidateQueries(["payments"] as any);
      setSuccessMessage(
        "Your payment has been submitted successfully. Wait for approval."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    },
    onError: (error: any) => {
      const message = parseErrors(error);
      setError("paymentScreenshot", {
        type: "manual",
        message: message,
      });
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    const formData = new FormData();

    const paymentScreenshots = data.paymentScreenshot[0] as File;

    formData.append("paymentScreenshot", paymentScreenshots);
    formData.append("amount", data.amount.toString());
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("senderAccountHolderName", data.accountHolderName);
    formData.append("destinationAcountKey", data.receiverEmail);
    formData.append("methodId", method);

    handleCreatePayment(formData);
  };

  return (
    <div className="w-full mt-10">
      {successMessage && (
        <Alert className="mb-2">
          <CheckCircle />
          <AlertTitle className="text-sm font-medium">
            {successMessage}
          </AlertTitle>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              id="amount"
              value={amount}
              placeholder="Enter amount"
              className="p-6 rounded-full placeholder:text-sm appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [MozAppearance:textfield]"
              onChange={(e) => {
                setAmount(e.target.value);
                setValue("amount", Number(e.target.value));
              }}
            />
            <ErrorMessage error={errors} label="amount" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Account holder name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Enter account holder name"
              className="p-6 rounded-full placeholder:text-sm"
              {...register("accountHolderName")}
            />
            <ErrorMessage error={errors} label="accountHolderName" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone number</Label>
            <Input
              type="text"
              id="phoneNumber"
              placeholder="Enter your phone number"
              className="p-6 rounded-full placeholder:text-sm"
              {...register("phoneNumber")}
            />
            <ErrorMessage error={errors} label="phoneNumber" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receiverEmail">Receiver email</Label>
            <Input
              type="email"
              id="receiverEmail"
              placeholder="Enter receiver email address"
              className="p-6 rounded-full placeholder:text-sm"
              {...register("receiverEmail")}
            />
            <ErrorMessage error={errors} label="receiverEmail" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Payment Screenshots</Label>
          <FileInput
            name="screenshot"
            placeholderText="Upload screenshots"
            previewImage={previewImage}
            onChange={handleChangeFile}
            handleRemove={() => {
              setValue("paymentScreenshot", null);
              setPreviewImage(null);
            }}
          />
          <ErrorMessage error={errors} label="paymentScreenshot" />
        </div>

        <CustomButton type="submit" processing={isCreating}>
          Submit
        </CustomButton>
      </form>
    </div>
  );
};

export default PaymentForm;
