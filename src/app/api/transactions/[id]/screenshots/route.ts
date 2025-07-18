import { parseFormData, uploadFile } from "@/lib/api/utils";
import dbConnect from "@/lib/db";
import { Payment } from "@/lib/models";
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
          message: "Invalid payment id",
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

    const payment = await Payment.findById(id);

    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 400 }
      );
    }

    const result = (await uploadFile(screenshot)) as any;

    payment.paymentScreenshots.push(result.secure_url);
    payment.paymentScreenshotsPublicIds.push(result.public_id);

    await payment.save();

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
