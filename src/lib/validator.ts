import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z
    .string()
    .nonempty("Full name is required")
    .min(3, "Full name must be at least 3 characters"),

  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const signInSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),

  password: z.string().nonempty("Password is required"),
});

export const paymentMethodSchema = z.object({
  name: z.string().min(1, "Method name is required"),
  paymentKey: z.string().min(1, "Payment key is required"),
  description: z.string().optional(),
  image: z.any().optional(),
  logo: z.any().optional(),
});

export const transactionSchema = z.object({
  amount: z.number().min(1, "Amount is required"),
  receiverAccount: z.string().min(1, "Receiver account is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  paymentScreenshot: z
    .any()
    .refine(
      (file) => file && file.length === 1,
      "Payment screenshot is required"
    )
    .optional(),
});

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
});

export const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .regex(
        /^(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must be at least 8 characters long and contain at least one uppercase letter and one number"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
