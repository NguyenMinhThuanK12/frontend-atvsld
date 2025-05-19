import api from "../configuration/axiosConfig";
import { Department } from "@/libs/shared/atvsld/models/department.model";
import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response";

export const getDepartmentsForSignIn = async (): Promise<Department[]> => {
  try {
    const response = await api.get<ApiResponse<Department[]>>("/departments/login-list");
    console.log("API Response:", response.data); 
    
    return response.data.data || []; 
  } catch (error) {
    throw error;
  }
};

export const getDepartments = async (): Promise<Department[]> => {
  try {
    const response = await api.get<ApiResponse<Department[]>>("/departments");
    console.log("API Response:", response.data); 
    
    return response.data.data || []; 
  } catch (error) {
    throw error;
  }
}


