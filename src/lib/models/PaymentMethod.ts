import mongoose, { model, Schema } from "mongoose";

const paymentMethodSchema = new Schema<IPaymentMethod>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    paymentKey: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: null,
      nullable: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
      nullable: true,
      trim: true,
    },
    isShow: {
      type: Boolean,
      default: true,
    },
    imagePublicId: {
      type: String,
    },
    logoPublicId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const PaymentMethod =
  mongoose.models.PaymentMethod ||
  model<IPaymentMethod>("PaymentMethod", paymentMethodSchema);
