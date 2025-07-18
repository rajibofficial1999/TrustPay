"use client";

import { updatePassword } from "@/actions/profile";
import CustomButton from "@/components/custom-button";
import ErrorMessage from "@/components/error-message";
import PasswordInput from "@/components/password-input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { parseErrors } from "@/lib/utils";
import { setPasswordSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const SetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const {
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: handleUpdatePassword, isPending: isUpdating } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      reset();
      setPassword("");
      setConfirmPassword("");
      setMessage("Password updated successfully");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    },
    onError: (error: any) => {
      const message = parseErrors(error);
      setError("password", {
        type: "manual",
        message: message,
      });
    },
  });

  const onSubmit = (data: SetPasswordFormData) => {
    handleUpdatePassword({ password: data.password });
  };

  useEffect(() => {
    setValue("confirmPassword", confirmPassword);
    setValue("password", password);
  }, [confirmPassword, password]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
      {message && (
        <Alert className="mb-2">
          <CheckCircle />
          <AlertTitle className="text-sm font-medium">{message}</AlertTitle>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <PasswordInput
          id="password"
          placeholder="Enter new password"
          setPassword={setPassword}
          password={password}
        />
        <ErrorMessage error={errors} label="password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Enter confirm password"
          setPassword={setConfirmPassword}
          password={confirmPassword}
        />

        <ErrorMessage error={errors} label="confirmPassword" />
      </div>

      <CustomButton processing={isUpdating} type="submit" className="mt-0">
        Save changes
      </CustomButton>
    </form>
  );
};

export default SetPasswordForm;
