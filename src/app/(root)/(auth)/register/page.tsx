"use client";

import CustomButton from "@/components/custom-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "@/components/error-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createUser } from "@/actions/user";
import { parseErrors } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/password-input";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "";

const signInSchema = z.object({
  email: z
    .string()
    .nonempty("Email address is required")
    .email("Invalid email address"),
});

type FormData = z.infer<typeof signInSchema>;

const Ragister = () => {
  const [processing, setProcessing] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();
  const {
    watch,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
  });

  const email = watch("email");

  const { mutate: handleCreateUser } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      handleSignIn();
    },
    onError: (error) => {
      setProcessing(false);
      const message = parseErrors(error);
      if (message.includes("password")) {
        setIsPasswordRequired(true);
        setPasswordError(message);
      } else {
        setError("email", {
          type: "manual",
          message: message,
        });
      }
    },
  });

  const queryClient = useQueryClient();

  const handleSignIn = async () => {
    try {
      const response = await signIn("credentials", {
        email,
        password: password || Math.random().toString(36).slice(-8),

        redirect: false,
      });

      if (!response?.ok && response?.error === "CredentialsSignin") {
        setError("email", {
          type: "manual",
          message: "Invalid credentials.",
        });

        return;
      }

      if (response?.ok) {
        queryClient.invalidateQueries(["user"] as any);
        router.push("/");
      }
    } catch (error: any) {
      setError("email", {
        type: "manual",
        message: error.message,
      });
    } finally {
      setProcessing(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setPasswordError("");
    setProcessing(true);
    if (isPasswordRequired && password) {
      await handleSignIn();
    } else {
      handleCreateUser(data.email);
    }
  };

  return (
    <div className="container mt-10">
      <div className="max-w-3xl bg-white w-full mx-auto py-10 px-6 sm:px-10 rounded-xl flex flex-col items-center text-foreground/80">
        <h3 className="font-semibold uppercase">Register!</h3>
        <h1 className="text-xl sm:text-3xl font-bold mt-4 text-left md:text-center w-full">
          Welcome to {appName} – Where Payments <br /> Meet Peace of Mind
        </h1>
        <p className="text-left md:text-center w-full mt-2">
          Join 10,000+ creators and businesses who trust {appName} for secure
          transactions.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mt-6 space-y-4"
        >
          <div className="w-full">
            <Label htmlFor="email" className="mb-2">
              Email address<span className="text-primary">*</span>
            </Label>
            <Input
              className="w-full rounded-full p-6"
              type="email"
              id="email"
              placeholder="Email valid email address"
              {...register("email")}
            />

            <ErrorMessage error={errors} label="email" />
          </div>
          {isPasswordRequired && (
            <div className="w-full">
              <Label htmlFor="email" className="mb-2">
                Password<span className="text-primary">*</span>
              </Label>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                setPassword={setPassword}
                password={password}
              />
              {passwordError && (
                <p className="text-sm text-destructive/70 mt-1">
                  {passwordError}
                </p>
              )}
            </div>
          )}

          <CustomButton className="mt-0" processing={processing}>
            Register
          </CustomButton>
        </form>
      </div>
    </div>
  );
};

export default Ragister;
