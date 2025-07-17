import dbConnect from "@/lib/db";
import { Transaction } from "@/lib/models";
import { Types } from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface ActionsType {
  [key: string]: TransactionStatus[];
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    await dbConnect();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid transaction id",
        },
        { status: 400 }
      );
    }

    const { status } = await request.json();
    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    let validStatuses = [
      "cancelled",
      "released",
      "refunded",
      "refund_requested",
      "approved",
      "failed",
    ];

    if (token.role === "user") {
      validStatuses = ["cancelled", "released", "refund_requested"];
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 400 }
      );
    }

    const currentStatus = transaction.status;

    const actions: ActionsType = {
      pending: ["approved", "cancelled", "failed"],
      approved: ["released", "refund_requested"],
      cancelled: ["refund_requested", "refunded"],
      refund_requested: ["refunded"],
    };

    const validActions = actions[currentStatus];

    if (!validActions.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status transition" },
        { status: 400 }
      );
    }

    transaction.status = status;

    await transaction.save();

    return NextResponse.json(
      { message: "Transaction status updated successfully" },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
