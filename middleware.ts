import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@auth/middleware";

export async function middleware(request: NextRequest) {
  // Redirect uppercase URLs to lowercase
  if (request.nextUrl.pathname !== request.nextUrl.pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = url.pathname.toLowerCase();
    return NextResponse.redirect(url);
  }

  // Run auth session middleware
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
