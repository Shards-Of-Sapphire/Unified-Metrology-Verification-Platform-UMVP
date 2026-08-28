import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.cookies.has("umvp_session")) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/user/:path*", "/lmo/:path*", "/gatc/:path*", "/admin/:path*", "/applications/:path*", "/inspections/:path*", "/certificates/:path*", "/reports/:path*"] };