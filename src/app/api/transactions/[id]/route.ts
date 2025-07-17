import cloudinary from "@/lib/api/cloudinary";
import dbConnect from "@/lib/db";
import { Transaction } from "@/lib/models";
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
          message: "Invalid transaction id",
        },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findById(id).populate(
      "paymentMethod",
      "name logo"
    );

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          message: "Transaction not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction, {
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
          message: "Invalid transaction id",
        },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          message: "Transaction not found",
        },
        { status: 404 }
      );
    }

    for (const public_id of transaction.paymentScreenshotsPublicIds) {
      cloudinary.uploader.destroy(public_id);
    }

    await transaction.deleteOne();

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
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
