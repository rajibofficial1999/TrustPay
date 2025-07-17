"use client";

import { getUser, updateUser } from "@/actions/user";
import CustomButton from "@/components/custom-button";
import ErrorMessage from "@/components/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseErrors } from "@/lib/utils";
import { userUpdateSchema } from "@/lib/validator";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const PaymentMethodEditPage = () => {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : undefined;

  const {
    data: user,
    refetch,
    isLoading,
  } = useQuery<IUser>({
    queryKey: ["admin_user", id],
    queryFn: () => getUser(id as string),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<UserUpdateFormData>({
    resolver: zodResolver(userUpdateSchema),
  });

  const { mutate: handleUpdateUser, isPending: isUpdating } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast("User updated successfully.");
      refetch();
    },
    onError: (error: any) => {
      const message = parseErrors(error);
      setError("fullName", {
        type: "manual",
        message: message,
      });
    },
  });

  const onSubmit = (data: UserUpdateFormData) => {
    handleUpdateUser({ id: id as string, data });
  };

  useEffect(() => {
    if (user) {
      setValue("fullName", user?.fullName || "");
      setValue("email", user.email);
    }
  }, [user]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-center my-10">
        Update new user
      </h1>
      <div className="rounded-md mt-4 max-w-md mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              type="text"
              id="fullName"
              placeholder="Enter full name"
              {...register("fullName")}
            />
            <ErrorMessage error={errors} label="fullName" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter email address"
              {...register("email")}
            />
            <ErrorMessage error={errors} label="email" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter a password"
              {...register("password")}
            />
            <ErrorMessage error={errors} label="password" />
          </div>

          <div className="flex justify-end">
            <CustomButton
              processing={isUpdating}
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

export default PaymentMethodEditPage;
