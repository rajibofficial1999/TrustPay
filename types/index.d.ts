import { z } from "zod";
import { Document, Types } from "mongoose";
import {
  paymentMethodSchema,
  personalInfoSchema,
  setPasswordSchema,
  signInSchema,
  signUpSchema,
  paymentSchema,
  userCreateSchema,
  userUpdateSchema,
} from "@/lib/validator";

declare global {
  type SignInFormData = z.infer<typeof signInSchema>;
  type SignUpFormData = z.infer<typeof signUpSchema>;
  type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
  type PaymentFormData = z.infer<typeof paymentSchema>;
  type SetPasswordFormData = z.infer<typeof setPasswordSchema>;
  type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
  type UserCreateFormData = z.infer<typeof userCreateSchema>;
  type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

  interface ProcessingStateProps {
    refund_requested: boolean;
    released: boolean;
  }

  type PaymentStatus =
    | "approved"
    | "pending"
    | "cancelled"
    | "refund_requested"
    | "refunded"
    | "released"
    | "failed";

  type UserRole = "admin" | "user";

  interface IUser extends Document {
    _id: string;
    fullName?: string;
    email: string;
    password?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IPaymentMethod extends Document {
    _id: string;
    name: string;
    paymentKey: string;
    image?: string;
    logo?: string;
    description?: string;
    isShow: boolean;
    imagePublicId?: string;
    logoPublicId?: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IPayment extends Document {
    _id: string;
    amount: number;
    paymentScreenshots: string[];
    paymentScreenshotsPublicIds: string[];
    phoneNumber: string;
    senderAccountHolderName?: string;
    destinationAcountKey?: string;
    status: PaymentStatus;
    paymentMethod: Types.ObjectId | IPaymentMethod;
    user: Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
  }
}

export {};
