import api from "../configuration/axiosConfig";
import { Department } from "@/libs/shared/atvsld/models/department.model";
import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response";

export const getDepartments = async (): Promise<Department[]> => {
  try {
    const response = await api.get<ApiResponse<Department[]>>("/departments");
    return response.data.result;
  } catch (error: any) {
    console.error("API Error:", error.message);
    throw error;
  }
};
