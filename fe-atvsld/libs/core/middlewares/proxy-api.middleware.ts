import { TMiddleware } from "@/middleware";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN } from "../utils/constant";

export const proxyApiMiddleware: TMiddleware = {
  matcher: /\/api\//,
  excluded: /^$/,
  handler: async (request, response) => {
    const accessToken =
      request.cookies.get(ACCESS_TOKEN)?.value ||
      response.cookies.get(ACCESS_TOKEN)?.value;
    if (!accessToken) return response;
    const pathname = request.nextUrl.pathname.replace(/\/api\//, "");
    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    const baseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    const target = new URL(baseApiUrl);
    target.pathname = `${target.pathname}${pathname}`;
    return NextResponse.rewrite(target, {
      headers,
    });
  },
};
