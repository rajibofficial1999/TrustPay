import dbConnect from "@/lib/db";
import { Payment } from "@/lib/models";
import { pusher } from "@/lib/pusher";
import { Types } from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface ActionsType {
  [key: string]: PaymentStatus[];
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
          message: "Invalid payment id",
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
      "pending",
    ];

    if (token.role === "user") {
      validStatuses = ["released", "refund_requested"];
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const payment = await Payment.findById(id);

    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 400 }
      );
    }

    const currentStatus = payment.status;

    const actions: ActionsType = {
      pending: ["approved", "cancelled", "failed"],
      approved: [
        "cancelled",
        "refunded",
        "pending",
        "failed",
        "refund_requested",
        "released",
      ],
      released: ["cancelled", "refunded", "pending", "failed"],
      refunded: [],
      failed: ["cancelled", "refunded", "pending", "approved"],
      cancelled: ["refunded", "approved", "failed", "pending"],
      refund_requested: ["refunded", "cancelled", "failed", "pending"],
    };

    const validActions = actions[currentStatus];

    if (!validActions.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    payment.status = status;

    await payment.save();

    // Send notification to the user
    const userId = payment.user.toString();
    await pusher.trigger(
      `private-user-${userId}`,
      "payment-status-updated",
      payment
    );

    return NextResponse.json(
      { message: "Payment status updated successfully" },
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
