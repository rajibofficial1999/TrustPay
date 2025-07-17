import { parseFormData, uploadFile } from "@/lib/api/utils";
import dbConnect from "@/lib/db";
import { Transaction } from "@/lib/models";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
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
    const { files }: any = await parseFormData(request);

    const { screenshot } = files;

    if (!screenshot) {
      return NextResponse.json(
        { message: "Payment screenshot is required" },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 400 }
      );
    }

    const result = (await uploadFile(screenshot)) as any;

    transaction.paymentScreenshots.push(result.secure_url);
    transaction.paymentScreenshotsPublicIds.push(result.public_id);

    await transaction.save();

    return NextResponse.json(
      { message: "Payment screenshot uploaded successfully" },
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
