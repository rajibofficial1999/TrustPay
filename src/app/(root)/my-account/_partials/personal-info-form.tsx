"use client";

import { updateInfo } from "@/actions/profile";
import CustomButton from "@/components/custom-button";
import ErrorMessage from "@/components/error-message";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseErrors } from "@/lib/utils";
import { personalInfoSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const PersonalnfoForm = ({ user }: { user: IUser | null }) => {
  const [message, setMessage] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
  });

  const { mutate: handleUpdateInfo, isPending: isUpdating } = useMutation({
    mutationFn: updateInfo,
    onSuccess: () => {
      reset();
      setMessage("Profile updated successfully");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    },
    onError: (error: any) => {
      const message = parseErrors(error);
      setError("fullName", {
        type: "manual",
        message: message,
      });
    },
  });

  const onSubmit = (data: PersonalInfoFormData) => {
    handleUpdateInfo({ fullName: data.fullName });
  };

  useEffect(() => {
    if (user && user?.fullName) {
      setValue("fullName", user.fullName);
    }
  }, [user]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
      {message && (
        <Alert className="mb-2">
          <CheckCircle />
          <AlertTitle className="text-sm font-medium">{message}</AlertTitle>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          type="text"
          id="fullName"
          placeholder="Enter full name"
          className="p-6 rounded-full placeholder:text-sm"
          {...register("fullName")}
        />
        <ErrorMessage error={errors} label="fullName" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>

        <div className="w-full rounded-full py-3.5 px-5 border text-left text-sm relative">
          {user?.email}
        </div>
      </div>

      <CustomButton processing={isUpdating} className="mt-0">
        Save changes
      </CustomButton>
    </form>
  );
};

export default PersonalnfoForm;
