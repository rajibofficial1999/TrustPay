"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SignInPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,

        redirect: false,
      });

      if (!response?.ok && response?.error === "CredentialsSignin") {
        setError("email", {
          type: "manual",
          message: "The provided credentials are invalid.",
        });

        return;
      }

      if (!response?.ok) {
        setError("email", {
          type: "manual",
          message: response?.error as string,
        });

        return;
      }

      router.push("/admin/dashboard");
      toast("Successfully signed in.");
    } catch (error: any) {
      setError("email", {
        type: "manual",
        message: error.message,
      });
    }
  };
  return (
    <>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
        Sign in to your account
      </h1>
      <form
        className="space-y-4 md:space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Your email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="py-5"
            {...register("email")}
          />
          <p className="text-destructive text-sm -mt-1">
            {errors.email?.message}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="py-5"
            {...register("password")}
          />
          <p className="text-destructive text-sm -mt-1">
            {errors.password?.message}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Checkbox id="remember" />
            </div>
            <div className="text-sm">
              <Label htmlFor="remember">Remember me</Label>
            </div>
          </div>
        </div>
        <Button
          disabled={isSubmitting}
          type="submit"
          className="w-full py-5 cursor-pointer"
        >
          {isSubmitting && <LoaderCircle className="h-5 w-5 animate-spin" />}
          Sign in
        </Button>
      </form>
    </>
  );
};

export default SignInPage;
