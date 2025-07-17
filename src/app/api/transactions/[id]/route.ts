import cloudinary from "@/lib/api/cloudinary";
import { parseFormData, uploadFile } from "@/lib/api/utils";
import dbConnect from "@/lib/db";
import { PaymentMethod, Transaction } from "@/lib/models";
import { Types } from "mongoose";
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
          message: "Invalid method id",
        },
        { status: 400 }
      );
    }

    const { fields, files }: any = await parseFormData(request);
    const { name, paymentKey, description } = fields;
    const { image, logo } = files;

    if (!name || !paymentKey) {
      return NextResponse.json(
        { message: "Name, paymentKey and image are required" },
        { status: 400 }
      );
    }

    const paymentMethod = await PaymentMethod.findById(id);

    if (!paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message: "Method not found",
        },
        { status: 404 }
      );
    }

    paymentMethod.name = name;
    paymentMethod.paymentKey = paymentKey;
    paymentMethod.description = description || null;

    if (image) {
      cloudinary.uploader.destroy(paymentMethod.imagePublicId);
      const imageResult = (await uploadFile(files.image)) as any;
      paymentMethod.image = imageResult.secure_url;
      paymentMethod.imagePublicId = imageResult.public_id;
    }

    if (logo) {
      cloudinary.uploader.destroy(paymentMethod.logoPublicId);
      const logoResult = (await uploadFile(files.logo)) as any;
      paymentMethod.logo = logoResult.secure_url;
      paymentMethod.logoPublicId = logoResult.public_id;
    }

    await paymentMethod.save();

    return NextResponse.json(
      { message: "Payment method updated successfully" },
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

export async function DELETE(
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
