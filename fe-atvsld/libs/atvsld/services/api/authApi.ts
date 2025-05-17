import api from "../configuration/axiosConfig";
import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response";
import { AuthenticationResponse } from "@/libs/shared/atvsld/dto/response/auth-response";
import { AuthenticationRequest } from "@/libs/shared/atvsld/dto/request/auth-request";

export const login = async (
  authRequest: AuthenticationRequest
): Promise<AuthenticationResponse> => {
    // log authRequest to the console
    console.log("Auth Request:", authRequest);
  try {
    const response = await api.post<ApiResponse<AuthenticationResponse>>(
      "/auth/login",
      authRequest
    );
    return response.data.result;
  } catch (error: any) {
    console.error("API Error:", error.message);
    throw error;
  }
};

