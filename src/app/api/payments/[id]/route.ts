import cloudinary from "@/lib/api/cloudinary";
import dbConnect from "@/lib/db";
import { Payment } from "@/lib/models";
import { Types } from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

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

    const payment = await Payment.findById(id).populate(
      "paymentMethod",
      "name logo"
    );

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(payment, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    if (token.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
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

    const payment = await Payment.findById(id);

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not found",
        },
        { status: 404 }
      );
    }

    for (const public_id of payment.paymentScreenshotsPublicIds) {
      cloudinary.uploader.destroy(public_id);
    }

    await payment.deleteOne();

    return NextResponse.json(
      { message: "Payment deleted successfully" },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
