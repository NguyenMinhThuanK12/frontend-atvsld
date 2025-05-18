import api from "../configuration/axiosConfig";
import { Department } from "@/libs/shared/atvsld/models/department.model";
import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response";

export const getDepartments = async (): Promise<Department[]> => {
  try {
    const response = await api.get<ApiResponse<Department[]>>("/departments/login-list");
    console.log("API Response:", response.data); // Log the API response
    
    return response.data.data || []; // Return the data or an empty array if undefined
  } catch (error) {
    throw error;
  }
};
