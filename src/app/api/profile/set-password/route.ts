import dbConnect from "@/lib/db";
import { User } from "@/lib/models";
import { isStrongPassword } from "@/lib/utils";
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

    const { password } = await request.json();
    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters long and contain at least one uppercase letter and one number.",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(token.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    user.password = password;
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
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
