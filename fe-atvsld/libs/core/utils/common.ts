import { refreshToken } from "@/libs/atvsld/services/api/authApi";
import { NextRequest } from "next/server";
import { REFRESH_TOKEN } from "./constant";

export function isTokenValid(expTime: string | null): boolean {
  if (!expTime) return false;
  const currentTime = Math.floor(Date.now() / 1000); // Đơn vị: giây
  if (Number(expTime) < currentTime - 2000) {
    return false;
  }
  return true;
}

export const handleRefreshToken = async (request: NextRequest) => {
    const refresh_token = request.cookies.get(REFRESH_TOKEN);

    if (!refresh_token) {
      return undefined;
    }

    const token = refresh_token.value;

    try {
        const response = await refreshToken(token);
        if (!response || !response.data) {
            console.error("No data in response:", response);
            return undefined;
        }

        const accessToken = response.data.access_token;
        if (accessToken) {
            return "";
        }

    } catch (error) {
        console.error("Error refreshing token:", error);
        return undefined;
    }
}
// libs/core/utils/refreshTokenFromMiddleware.ts

export const refreshTokenFromMiddleware = async (
  request: NextRequest
): Promise<{ accessToken: string | null }> => {
  const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value;
  if (!refreshToken) return { accessToken: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) return { accessToken: null };

  const data = await res.json();
  return { accessToken: data.data?.access_token || null };
};

