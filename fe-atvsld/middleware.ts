// export { auth as middleware } from "@/auth"

import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {

    // const token = request.cookies.get("authToken")?.value;
    // if (!token) {
    //   return NextResponse.redirect(new URL("/auth/login", request.url));
    // }
    return NextResponse.next();
}

export const config = {
    matcher : ["/dashboard/:path*"],
};