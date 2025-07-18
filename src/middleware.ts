import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/my-account",
  "/make-payment",
  "/payments",
  "/admin/dashboard",
  "/admin/payments",
  "/admin/payment-methods",
  "/admin/users",
];

const authRoutes = ["/register", "/admin/signin"];

const publicApiRoutes = [
  "/api/auth/providers",
  "/api/auth/csrf",
  "/api/auth/callback/credentials",
  "/api/auth/session",
  "/api/users/create",
  "/api/public/payment-methods",
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    // Check if the route is in publicApiRoutes
    const isPublicApi = publicApiRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isPublicApi) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin/signin", request.url));
      }

      return NextResponse.redirect(new URL("/register", request.url));
    }

    if (pathname.startsWith("/admin")) {
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      if (token.role !== "user") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
