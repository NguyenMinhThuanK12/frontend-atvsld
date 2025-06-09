import { NextResponse, NextRequest } from "next/server";
import { UserType } from "./libs/shared/core/enums/userType";

// Global URL lists
const ADMIN_URLS = ["/dashboard/:path*"];
const BUSINESS_URLS = ["/reports","/reports/:path*"];
const PUBLIC_URLS = ["/auth/login", "/404"]; // Publicly accessible URLs

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const userType = request.cookies.get("userType")?.value;

  // Allow access to public URLs without restrictions
  if (PUBLIC_URLS.some((url) => pathname === url)) {
    return NextResponse.next();
  }

  // Redirect to login if no access token
  if (!accessToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin routes
  if (
    ADMIN_URLS.some((route) =>
      route.includes(":path*")
        ? pathname.startsWith(route.split(":path*")[0])
        : pathname === route
    )
  ) {
    if (userType !== UserType.ADMIN) {
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }

  // Check business routes
  if (
    BUSINESS_URLS.some((route) =>
      route.includes(":path*")
        ? pathname.startsWith(route.split(":path*")[0])
        : pathname === route
    )
  ) {
    if (userType !== UserType.BUSINESS) {
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }

  // Allow the request to proceed if no restrictions apply
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/reports/:path*", "/auth/login", "/404"],
};
