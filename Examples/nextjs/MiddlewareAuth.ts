// Examples/nextjs/MiddlewareAuth.ts
// مستندات: Nextjs/Middleware.md — Nextjs/Authentication-NextAuth.md

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session-token");
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/account") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
