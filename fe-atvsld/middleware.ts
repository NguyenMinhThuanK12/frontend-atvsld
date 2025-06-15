import { NextResponse, NextRequest } from "next/server";
import { UserType } from "./libs/shared/core/enums/userType";
import { tokenHandlerMiddleware } from "./libs/core/middlewares/token-handler.middleware";
import { proxyApiMiddleware } from "./libs/core/middlewares/proxy-api.middleware";
import { authMiddleware } from "./libs/core/middlewares/auth.middleware";

// Global URL lists
const ADMIN_URLS = ["/dashboard/:path*"];
const BUSINESS_URLS = ["/ATVSLD/:path*"];
const PUBLIC_URLS = ["/auth/login", "/404", "/demo"]; // Publicly accessible URLs

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


export type TMiddleware = {
  matcher: RegExp;
  excluded: RegExp;
  handler: (request: NextRequest, res: NextResponse) => NextResponse | Promise<NextResponse>;
}

const middlewares: TMiddleware[] = [
  tokenHandlerMiddleware,
  proxyApiMiddleware,
  authMiddleware
]

// export default async function middleware(request: NextRequest) {
//   const url = request.nextUrl.clone();
//   const pathname = url.pathname;
//   let res = NextResponse.next();

//   for (const middleware of middlewares) {
//     if (!middleware.matcher.test(pathname)) continue;
//     if (middleware.excluded.test(pathname)) continue;
//     const midRes = await middleware.handler(request, res);
//     if (midRes !== NextResponse.next()) {
//        res = midRes;
//     }
//   }

//   return res;
// }



export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ATVSLD/:path*",
    "/auth/login",
    "/404",
    "/demo",
  ],
};