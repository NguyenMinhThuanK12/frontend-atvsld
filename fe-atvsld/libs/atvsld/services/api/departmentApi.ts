import api from "../configuration/axiosConfig";
import { Department } from "@/libs/shared/atvsld/models/department.model";
import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response";
import { UpdateDepartmentRequest } from "@/libs/shared/atvsld/dto/request/updateDepartmentRequest";


// export const getDepartmentsForSignIn = async (): Promise<Department[]> => {
//   try {
//     const response = await api.get<ApiResponse<Department[]>>("/departments/login-list");
//     console.log("API Response:", response.data); 
    
//     return response.data.data || []; 
//   } catch (error) {
//     throw error;
//   }
// };

export const getDepartments = async (): Promise<paginationResponse<Department>> => {
  try {
    console.log("Fetching departments...");
    
    const response = await api.get<ApiResponse<paginationResponse<Department>>>("/departments");
    console.log("API Response:", response.data.data); 
    if (!response.data.data) {
      throw new Error("No data found in the response");
    }
    
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export const createDepartment = async (department: Department): Promise<ApiResponse<Department>> => {
  try {
    console.log("before call creation api: ", department);
    
    const response = await api.post<ApiResponse<Department>>("/departments", department);
    console.log("Create Response:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateDepartment = async (
  id: number,
  department: UpdateDepartmentRequest
) => {
  try {
    console.log("before update", department);

    const response = await api.patch<ApiResponse<Department>>(
      `/departments/${id}`,
      department
    );
    if (!response.data || response.data.status !== 200) {
      console.log("message: ", response.data.message);
    }

    console.log("Update Response:", response.data);

    return response.data;
  } catch (error) {
    console.log("Error during update:", error);

    throw error;
  }
};

export const deleteDepartment = async (id: number): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete<ApiResponse<null>>(`/departments/${id}`);
    console.log("Delete Response:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}



