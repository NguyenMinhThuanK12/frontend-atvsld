// services/api/axiosConfig.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

// Extend InternalAxiosRequestConfig to include _retry
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
      try {
        const response = await api.post(
          "/auth/refresh-token",
          {},
          {
            withCredentials: true, // Gửi Cookie HttpOnly (refreshToken)
          }
        );

        console.log("Refresh success:", response.data);
        
        const { access_token } = response.data.data;
        Cookies.set("accessToken", access_token, {
          secure: true,
          sameSite: "Strict",
        });
        originalRequest.headers.Authorization = `Bearer ${access_token}`;


        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại, đăng xuất
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("fullName");
        Cookies.remove("departmentId");
        window.location.href = "/auth/login?logout=forced";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;


