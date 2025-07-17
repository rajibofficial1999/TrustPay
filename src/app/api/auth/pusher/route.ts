import { pusher } from "@/lib/pusher";
import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    const bodyText = await request.text();
    const params = new URLSearchParams(bodyText);

    const socket_id = params.get("socket_id");
    const channel_name = params.get("channel_name");

    if (!socket_id || !channel_name) {
      return NextResponse.json(
        { success: false, message: "Missing socket_id or channel_name" },
        { status: 400 }
      );
    }

    const authResponse = pusher.authorizeChannel(socket_id, channel_name, {
      user_id: token.id.toString(),
      user_info: {
        email: token.email,
      },
    });

    return NextResponse.json(authResponse, { status: 200 });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
