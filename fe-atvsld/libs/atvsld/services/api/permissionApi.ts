import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response";
import api from "../configuration/axiosConfig";
import { PermissionResponse } from "@/libs/shared/atvsld/dto/response/permission/PermissionResponse";
import { QueryPermissionRequest } from "@/libs/shared/atvsld/dto/request/permission/QueryPermissionRequest";

export const getGroupPermissions = async (): Promise<
  paginationResponse<PermissionResponse>
> => {
  try {
    console.log("Fetching group permissions...");
    const response = await api.get<
      ApiResponse<paginationResponse<PermissionResponse>>
          >("/permissions/groups");
      
      console.log("API Response:", response.data.data);
      if (!response.data.data) {
        throw new Error("No data found in the response");
      }
        return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getComponentPermissionsByGroup = async(
    parentCode: string
): Promise<ApiResponse<PermissionResponse[]>> => {
  try {
    console.log("Fetching component permissions by group:", parentCode);
    const response = await api.get<ApiResponse<PermissionResponse[]>>(
      `/permissions/components?parentCode=${parentCode}`
    );
    console.log("API Response:", response.data);

    if (!response.data || !response.data.data) {
      throw new Error("No component permissions found for group: " + parentCode);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

export const filterPermissions = async (
  query: QueryPermissionRequest
): Promise<ApiResponse<paginationResponse<PermissionResponse>>> => {
    try {
        console.log("Filtering permissions with query:", query);
        const response = await api.get<ApiResponse<paginationResponse<PermissionResponse>>>(
            "/permissions/groups",
            { params: query }
        );

        if (!response.data || !response.data.data) {
            throw new Error("No permissions found for the given query");
        }
        console.log("Filtered permissions response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error filtering permissions:", error);
        throw error;
        
    }
};