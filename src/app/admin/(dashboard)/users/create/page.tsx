"use client";

import { createAdminUser } from "@/actions/user";
import CustomButton from "@/components/custom-button";
import ErrorMessage from "@/components/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseErrors } from "@/lib/utils";
import { userCreateSchema } from "@/lib/validator";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UserCreatePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateSchema),
  });

  const { mutate: handleCreateUser, isPending: isCreating } = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      toast("User created successfully.");
      reset();
    },
    onError: (error: any) => {
      const message = parseErrors(error);
      setError("fullName", {
        type: "manual",
        message: message,
      });
    },
  });

  const onSubmit = (data: UserCreateFormData) => {
    handleCreateUser(data);
  };

  return (
    <>
      <h1 className="text-xl font-semibold text-center my-10">
        Create a new user
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
              processing={isCreating}
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

export default UserCreatePage;
