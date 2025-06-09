import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response";
import { RoleResponse } from "@/libs/shared/atvsld/dto/response/role/RoleResponse";
import api from "../configuration/axiosConfig";
import { CreationRoleRequest } from "@/libs/shared/atvsld/dto/request/role/creationRoleRequest";
import { UpdateRoleRequest } from "@/libs/shared/atvsld/dto/request/role/updateRoleRequest";
import { QueryRoleRequest } from "@/libs/shared/atvsld/dto/request/role/queryRoleRequest";

export const getRoles = async (): Promise<paginationResponse<RoleResponse>> => {
    try {
        const response = await api.get<ApiResponse<paginationResponse<RoleResponse>>>("/roles");
        
        if (!response.data.data) {
        throw new Error("No data found in the response");
        }
        return response.data.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    }
}

export const createRole = async (role: CreationRoleRequest): Promise<ApiResponse<RoleResponse>> => {
    try {
        const response = await api.post<ApiResponse<RoleResponse>>("/roles", role);
        
        return response.data;
    } catch (error) {
        console.error("Error creating role:", error);
        throw error;
    }
}

export const checkDuplicateRoleCode = async (code: string): Promise<ApiResponse<boolean>> => {
    try {
       const response = await api.get<ApiResponse<boolean>>("/roles/check-duplicate-code", {
           params: { code }
       });
        if (!response.data || response.data.data === undefined) {
            throw new Error("No data found in the response");
        }
        return response.data;
    } catch (error) {
        console.error("Error checking duplicate role code:", error);
        throw error;
    }
}

export const getById = async (id: string): Promise<ApiResponse<RoleResponse>> => {
    try {
        const response = await api.get<ApiResponse<RoleResponse>>(`/roles/${id}`);
        
        if (!response.data || !response.data.data) {
            throw new Error("No role found with the given ID");
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching role by ID:", error);
        throw error;
    }
}

export const updateRole = async (id: string, role: UpdateRoleRequest): Promise<ApiResponse<RoleResponse>> => {
    try {
        console.log("Updating role with ID:", id, "Data:", role);
        const response = await api.patch<ApiResponse<RoleResponse>>(`/roles/${id}`, role);
        
        if (!response.data || !response.data.data) {
            throw new Error("No role found with the given ID");
        }
        console.log("Role updated successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating role:", error);
        throw error;
    }
}

export const deleteRole = async (id: string): Promise<ApiResponse<null>> => {
    try {
        console.log("Deleting role with ID:", id);
        const response = await api.delete<ApiResponse<null>>(`/roles/${id}`);
        
        if (!response.data || response.data.status !== 200) {
            throw new Error("Failed to delete role");
        }
        console.log("Role deleted successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting role:", error);
        throw error;
    }
}

export const filterRoles = async (query: QueryRoleRequest): Promise<ApiResponse<paginationResponse<RoleResponse>>> => {
    try {
        console.log("Searching roles with query:", query);
        const response = await api.get<ApiResponse<paginationResponse<RoleResponse>>>(
            "/roles/search", {
          params:  query
        });
        
        if (!response.data || !response.data.data) {
            throw new Error("No roles found matching the search criteria");
        }
        console.log("Roles found:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error searching roles:", error);
        throw error;
    }
}