import { User } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { message: "Email, password and fullName are required" },
        { status: 400 }
      );
    }

    await User.create({ email, password, fullName, role: "admin" });

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
