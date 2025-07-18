import cloudinary from "@/lib/api/cloudinary";
import dbConnect from "@/lib/db";
import { Payment, User } from "@/lib/models";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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

    const { fullName } = await request.json();
    if (!fullName) {
      return NextResponse.json(
        { message: "Full name is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(token.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    user.fullName = fullName;
    await user.save();

    return NextResponse.json(
      { message: "Profile updated successfully" },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    const user = await User.findById(token.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const payments = await Payment.find({
      user: user._id,
    });

    for (const payment of payments) {
      for (const public_id of payment.paymentScreenshotsPublicIds) {
        cloudinary.uploader.destroy(public_id);
      }
    }

    await Payment.deleteMany({
      user: user._id,
    });

    await user.deleteOne();

    return NextResponse.json(
      { message: "Profile deleted successfully" },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
