import api from "../configuration/axiosConfig";
import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response";
import { AuthenticationResponse } from "@/libs/shared/atvsld/dto/response/auth-response";
import { AuthenticationRequest } from "@/libs/shared/atvsld/dto/request/auth-request";
import { isAxiosError } from "axios";

export const login = async (
  authRequest: AuthenticationRequest
): Promise<ApiResponse<AuthenticationResponse>> => {
    // log authRequest to the console
    console.log("Auth Request:", authRequest);
  try {
    const response = await api.post<ApiResponse<AuthenticationResponse>>(
      "/auth/login",
      authRequest
    );

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError<ApiResponse<AuthenticationResponse>>(error)) {
      if (error.response?.data) {
        return error.response.data;
      }
    }
    return {
      status: 500,
      message: "Lỗi không xác định từ hệ thống",
    };
  }
};

// export const refreshToken = async (
//   refreshToken: string
// ): Promise<ApiResponse<{ access_token: string }>> => {
//   try {
//     const response = await api.post<ApiResponse<{ access_token: string }>>(
//       "/auth/refresh-token",
//       { refreshToken }
//     );
//     return response.data;
//   } catch (error: unknown) {
//     if (isAxiosError<ApiResponse<{ access_token: string }>>(error)) {
//       if (error.response?.data) {
//         return error.response.data;
//       }
//     }
//     return {
//       status: 500,
//       message: "Lỗi làm mới token",
//     };
//   }
// };

export const logout = async (
  refreshToken: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await api.post<ApiResponse<{ message: string }>>(
      "/auth/logout",
      { refresh_token: refreshToken }
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError<ApiResponse<{ message: string }>>(error)) {
      if (error.response?.data) {
        return error.response.data;
      }
    }
    return {
      status: 500,
      message: "Lỗi đăng xuất",
    };
  }
};

