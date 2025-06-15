import { TMiddleware } from "@/middleware";
import { ACCESS_TOKEN } from "../utils/constant";
import { NextResponse } from "next/server";

export const authMiddleware: TMiddleware = {
  matcher: /^\/(dashboard|ATVSLD)(\/.*)?$/,
  excluded: /^\/(404)$/,
  handler: async (request, res) => {
    const accessToken = request.cookies.get(ACCESS_TOKEN)?.value;
    if (accessToken) return res;
    return NextResponse.redirect(new URL("http://localhost:3000"));
  },
}; 