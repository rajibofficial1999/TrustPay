import { PaymentMethod } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

import { parseFormData, uploadFile } from "@/lib/api/utils";
import dbConnect from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET() {
  try {
    await dbConnect();

    const paymentMethods = await PaymentMethod.find();

    return NextResponse.json(paymentMethods, {
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

    if (token.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
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

    const paymentMethod = new PaymentMethod();
    paymentMethod.name = name;
    paymentMethod.paymentKey = paymentKey;
    paymentMethod.description = description || null;

    if (image) {
      const imageResult = (await uploadFile(files.image)) as any;
      paymentMethod.image = imageResult.secure_url;
      paymentMethod.imagePublicId = imageResult.public_id;
    }

    if (logo) {
      const logoResult = (await uploadFile(files.logo)) as any;
      paymentMethod.logo = logoResult.secure_url;
      paymentMethod.logoPublicId = logoResult.public_id;
    }

    await paymentMethod.save();

    return NextResponse.json(
      { message: "Payment method created successfully" },
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
