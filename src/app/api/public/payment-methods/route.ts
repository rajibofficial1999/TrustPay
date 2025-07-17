import dbConnect from "@/lib/db";
import { PaymentMethod } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const paymentMethods = await PaymentMethod.find()
      .limit(6)
      .select("name logo");

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
