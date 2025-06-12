import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token")?.value;
  if (!authToken) {
    const loginUrl = new URL("/auth/login", request.url);
    // If you want to redirect back to the original page after login, uncomment the next line
    // loginUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// This config specifies which paths will trigger this middleware
export const config = {
  matcher: [
    "/overview/:path*",
    "/withdrawal/:path*",
    "/account/:path*",
    "/deposit/:path*",
    "/authenticator/:path*",
    "/history/:path*",
  ],
};
