import { parseFormData, uploadFile } from "@/lib/api/utils";
import dbConnect from "@/lib/db";
import { PaymentMethod, Transaction, User } from "@/lib/models";
import { pusher } from "@/lib/pusher";
import { Types } from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    let query = {};
    if (token.role === "user") {
      query = { user: token.id };
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .populate("paymentMethod", "name logo")
      .populate("user", "email");

    return NextResponse.json(transactions, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    const { fields, files }: any = await parseFormData(request);
    const {
      amount,
      phoneNumber,
      senderAccountHolderName,
      destinationAcountKey,
      methodId,
    } = fields;
    const { paymentScreenshot } = files;

    if (
      !amount ||
      !phoneNumber ||
      !senderAccountHolderName ||
      !destinationAcountKey ||
      !methodId
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(methodId)) {
      return NextResponse.json(
        { message: "Method id is invalid" },
        { status: 400 }
      );
    }

    const paymentMethod = await PaymentMethod.findById(methodId);

    if (!paymentMethod) {
      return NextResponse.json(
        { message: "Method not found" },
        { status: 400 }
      );
    }

    if (!paymentScreenshot) {
      return NextResponse.json(
        { message: "Payment screenshot is required" },
        { status: 400 }
      );
    }

    const transaction = new Transaction();
    transaction.amount = amount;
    transaction.phoneNumber = phoneNumber;
    transaction.senderAccountHolderName = senderAccountHolderName;
    transaction.destinationAcountKey = destinationAcountKey;
    transaction.paymentMethod = paymentMethod._id;
    transaction.user = token.id;
    transaction.status = "pending";

    const result = (await uploadFile(paymentScreenshot)) as any;

    transaction.paymentScreenshots = [result.secure_url];
    transaction.paymentScreenshotsPublicIds = [result.public_id];

    await transaction.save();

    // Send notification to admin users
    const adminIds = (
      await User.find({ role: "admin" }).select("_id").lean()
    ).map((user) => user._id);

    const receiverIds = [...adminIds];

    for (const receiverId of receiverIds) {
      if (receiverId) {
        const userId = receiverId.toString();

        await pusher.trigger(
          `private-user-${userId}`,
          "transaction-created",
          transaction
        );
      }
    }

    return NextResponse.json(
      { message: "Transaction created successfully" },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
