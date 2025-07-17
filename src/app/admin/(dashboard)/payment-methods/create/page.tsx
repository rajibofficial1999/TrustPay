"use client";

import { createPaymentMethod } from "@/actions/payment_method";
import CustomButton from "@/components/custom-button";
import ErrorMessage from "@/components/error-message";
import TextAreaEditor from "@/components/text-editor/text-area-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseErrors } from "@/lib/utils";
import { paymentMethodSchema } from "@/lib/validator";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const PaymentMethodCreatePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
    reset,
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
  });

  const description = watch("description");

  const {
    mutate: handleCreatePaymentMethod,
    isPending: isCreatingPaymentMethod,
  } = useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      toast("Payment method created successfully.");
      reset();
    },
    onError: (error: any) => {
      const message = parseErrors(error);
      setError("description", {
        type: "manual",
        message: message,
      });
    },
  });

  const onSubmit = (data: PaymentMethodFormData) => {
    const formData = new FormData();

    if (data.image) {
      formData.append("image", data.image[0]);
    }

    if (data.logo) {
      formData.append("logo", data.logo[0]);
    }

    if (data.description) {
      formData.append("description", data.description);
    }

    formData.append("name", data.name);
    formData.append("paymentKey", data.paymentKey);
    handleCreatePaymentMethod(formData);
  };

  return (
    <>
      <div className="flex justify-between items-center my-2">
        <h1 className="text-xl font-semibold">Create Payment Method</h1>
      </div>
      <div className="rounded-md mt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Method Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Enter method name"
                {...register("name")}
              />
              <ErrorMessage error={errors} label="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentKey">Payment Key</Label>
              <Input
                type="text"
                id="paymentKey"
                placeholder="Enter payment number, tag, or key"
                {...register("paymentKey")}
              />
              <ErrorMessage error={errors} label="paymentKey" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image">Method Image/QRCode</Label>
              <input
                accept="image/*"
                type="file"
                id="image"
                {...register("image")}
                className="border w-full py-2 px-3 rounded-lg text-sm cursor-pointer"
              />
              <ErrorMessage error={errors} label="image" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Method Logo</Label>
              <input
                accept="image/*"
                type="file"
                id="logo"
                {...register("logo")}
                className="border w-full py-2 px-3 rounded-lg text-sm cursor-pointer"
              />
              <ErrorMessage error={errors} label="logo" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <TextAreaEditor
              onChange={(content) => setValue("description", content)}
              content={description || ""}
            />

            <ErrorMessage error={errors} label="description" />
          </div>

          <div className="flex justify-end">
            <CustomButton
              processing={isCreatingPaymentMethod}
              className="w-auto rounded-md p-5 mt-0"
            >
              Submit
            </CustomButton>
          </div>
        </form>
      </div>
    </>
  );
};

export default PaymentMethodCreatePage;
