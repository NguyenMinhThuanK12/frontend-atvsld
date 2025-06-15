import { TMiddleware } from "@/middleware";
import { NextResponse } from "next/server";
import { handleRefreshToken, isTokenValid } from "../utils/common";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN, TOKEN_EXPIRED_TIME } from "../utils/constant";

export const tokenHandlerMiddleware: TMiddleware = {
  matcher: /.*/,
  excluded: /^$/,
  handler: async (request, res) => {
    let refreshToken = request.cookies.get(REFRESH_TOKEN)?.value;
    if (!refreshToken) return res;
    const expTime = request.cookies.get(TOKEN_EXPIRED_TIME)?.value;
    const isValid = isTokenValid(expTime ?? null);

    if (isValid) return res;

    const accessToken = await handleRefreshToken(request);
    if (!accessToken) {
      res.cookies.delete(REFRESH_TOKEN);
      res.cookies.delete(ACCESS_TOKEN);
      res.cookies.delete(REFRESH_TOKEN);
      return res;
    }
      const accessTokenDecoded = jwtDecode(accessToken as string);
      const accessTokenExpires = new Date(accessTokenDecoded.exp as number * 1000);

      setCookie(res, ACCESS_TOKEN, accessToken, accessTokenExpires);
      setCookie(
        res,
        TOKEN_EXPIRED_TIME,
          accessTokenDecoded.exp as unknown as string,
          accessTokenExpires
      );

      console.log(res.cookies.get(ACCESS_TOKEN));
      

    return res;
  },
};

const setCookie = (
  res: NextResponse,
  name: string,
  value: string,
  expires: Date
) => {
  res.cookies.set({
    name,
    value,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires,
  });
};
