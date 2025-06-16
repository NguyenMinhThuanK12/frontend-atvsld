// services/api/axiosConfig.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "@/libs/atvsld/services/api/authApi";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Url backend is saved in .env.local
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((config: CustomAxiosRequestConfig) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | CustomAxiosRequestConfig
      | undefined;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.log("Access token expired, attempting to refresh...");
      try {
        const currRefreshToken = Cookies.get("refreshToken");
        if (!currRefreshToken) {
          throw new Error("No refresh token available");
        }
        console.log("Sending refresh token:", currRefreshToken);
        
        const response = await refreshToken(currRefreshToken);

        if (response.status !== 200 || !response.data) {
          throw new Error("Failed to refresh token");
        }

        const newAccessToken  = response.data.access_token;
        console.log("New access token received:", newAccessToken);
        Cookies.set("accessToken", newAccessToken, {
          secure: true,
          sameSite: "Strict",
        });
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log("Retrying original request with new token...");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("fullName");
        Cookies.remove("avatar");
        Cookies.remove("userType");
        window.location.href = "/auth/login?logout=forced";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;


