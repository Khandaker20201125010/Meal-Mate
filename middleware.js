import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;
  const { pathname } = url;

  // Redirect if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/api/unauthorized", req.url));
  }

  const { role, email } = token;

  const adminRoutes = ["/api/add-menu", "/api/manage-users", "/api/manage-menu", "/api/manage-bookings", "/dashboard/add-menu", "/dashboard/manage-users", "/dashboard/manage-menu", "/dashboard/all-bookings", "/dashboard/payment-History","/dashboard/profile"];
  const customerRoutes = [
    "/api/my-orders",
    "/api/my-bookings",
    "/dashboard/my-orders",
    "/dashboard/my-bookings",
    "/dashboard/profile",
    "/dashboard/payment-History",
  ];

  // Admin only access
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.next();
  }

  // Customer only access
  if (customerRoutes.some((route) => pathname.startsWith(route))) {
    if (role !== "customer") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.next();
  }

  // Email-based route protection
  if (pathname.startsWith("/api/my-orders/") && req.method === "GET") {
    const routeEmail = pathname.split("/").pop();
    if (email !== routeEmail) {
      return NextResponse.redirect(new URL("/api/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"], // Protect API and dashboard pages
};
