import mongoose, { model, Schema } from "mongoose";

const transactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: true,
    },
    paymentScreenshots: [String],
    paymentScreenshotsPublicIds: [String],
    phoneNumber: String,
    senderAccountHolderName: String,
    destinationAcountKey: String,
    status: {
      type: String,
      required: true,
      enum: [
        "approved",
        "pending",
        "cancelled",
        "refunded",
        "refund_requested",
        "released",
        "failed",
      ],
    },
    paymentMethod: {
      type: Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Transaction =
  mongoose.models.Transaction ||
  model<ITransaction>("Transaction", transactionSchema);
