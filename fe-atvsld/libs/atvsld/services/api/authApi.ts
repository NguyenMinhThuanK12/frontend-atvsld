import api from "../configuration/axiosConfig";
import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response";
import { AuthenticationResponse } from "@/libs/shared/atvsld/dto/response/auth-response";
import { AuthenticationRequest } from "@/libs/shared/atvsld/dto/request/auth-request";
import { log } from "console";

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

    console.log("status:", response.data.status);

    console.log("message:", response.data.message);

    console.log("data:", response.data.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

