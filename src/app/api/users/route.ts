import { User } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { isStrongPassword } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
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

    await dbConnect();

    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json(users, {
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

    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters long and contain at least one uppercase letter and one number",
        },
        { status: 400 }
      );
    }

    const user = new User();
    user.fullName = fullName;
    user.email = email;
    user.password = password;
    user.role = "admin";

    await user.save();

    return NextResponse.json(
      { message: "User created successfully" },
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
