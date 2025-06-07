import { UserResponse } from "@/libs/shared/atvsld/dto/response/user/UserReponse";
import api from "../configuration/axiosConfig";
import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response";

export const getUsers = async (): Promise<paginationResponse<UserResponse>> => {
  try {
    const response = await api.get<ApiResponse<paginationResponse<UserResponse>>>("/users");
    if (!response.data || !response.data.data) {
      throw new Error("No data found in the response");
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
    
  }
}

export const getUserById = async (id: string): Promise<UserResponse> => {
  try {
    const response = await api.get<ApiResponse<UserResponse>>(`/users/${id}`);
    if (!response.data || !response.data.data) {
      throw new Error("No data found in the response");
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}
