import dbConnect from "@/lib/db";
import { User } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (user) {
      if (user.password) {
        return NextResponse.json(
          {
            message:
              "You already have an account with a password. Please provide the password to login.",
          },
          { status: 400 }
        );
      }

      if (user.role === "admin") {
        return NextResponse.json(
          {
            message:
              "You cannot register an admin account. Please contact support for more information.",
          },
          { status: 400 }
        );
      }
    }

    if (!user) {
      await User.create({ email });
    }

    return NextResponse.json(
      { message: "User created successfully" },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
