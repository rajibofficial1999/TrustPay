import cloudinary from "@/lib/api/cloudinary";
import { parseFormData, uploadFile } from "@/lib/api/utils";
import dbConnect from "@/lib/db";
import { PaymentMethod, Payment } from "@/lib/models";
import { Types } from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    return NextResponse.json(paymentMethod, {
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const payments = await Payment.find({
      paymentMethod: paymentMethod._id,
    });

    for (const payment of payments) {
      for (const public_id of payment.paymentScreenshotsPublicIds) {
        cloudinary.uploader.destroy(public_id);
      }
    }

    await Payment.deleteMany({
      paymentMethod: paymentMethod._id,
    });

    if (paymentMethod.imagePublicId) {
      cloudinary.uploader.destroy(paymentMethod.imagePublicId);
    }

    if (paymentMethod.logoPublicId) {
      cloudinary.uploader.destroy(paymentMethod.logoPublicId);
    }

    await paymentMethod.deleteOne();

    return NextResponse.json(
      { message: "Payment method deleted successfully" },
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
