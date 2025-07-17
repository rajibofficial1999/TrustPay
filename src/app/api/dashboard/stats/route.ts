import dbConnect from "@/lib/db";
import { PaymentMethod, Transaction } from "@/lib/models";
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

    if (token.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const transactions = await Transaction.find({
      status: {
        $in: [
          "approved",
          "cancelled",
          "refunded",
          "refund_requested",
          "released",
        ],
      },
    }).select("amount paymentMethod");

    const paymentMethods = await PaymentMethod.find().select("name logo");

    const data = paymentMethods.map((method) => {
      const relatedTransactions = transactions.filter(
        (transaction) =>
          transaction.paymentMethod.toString() === method._id.toString()
      );

      const totalEarnings = relatedTransactions.reduce(
        (sum, tx) => sum + tx.amount,
        0
      );

      return {
        _id: method._id,
        name: method.name,
        logo: method.logo,
        totalEarnings,
      };
    });

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
