import { UserResponse } from "@/libs/shared/atvsld/dto/response/user/UserReponse";
import api from "../configuration/axiosConfig";
import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response";
import { CreationUserRequest } from "@/libs/shared/atvsld/dto/request/user/creationUserRequest";
import { UpdateUserRequest } from "@/libs/shared/atvsld/dto/request/user/updateUserRequest";
import { QueryUserRequest } from "@/libs/shared/atvsld/dto/request/user/queryUserRequest";
import { convertCreationUserRequest, convertUpdateUserRequest } from "../../utils/convertToFormData";

export const getUsers = async (): Promise<paginationResponse<UserResponse>> => {
  try {
    const response = await api.get<
      ApiResponse<paginationResponse<UserResponse>>
    >("/users");
    if (!response.data || !response.data.data) {
      throw new Error("No data found in the response");
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<UserResponse> => {
  try {
    const response = await api.get<ApiResponse<UserResponse>>(`/users/${id}`);
    if (!response.data || !response.data.data) {
      throw new Error("No data found in the response");
    }

    const user = response.data.data;
    // Transform birthday string to Date
    if (user.birthday && typeof user.birthday === "string") {
      const parsedDate = new Date(user.birthday);
      user.birthday = isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    console.log("User fetched by ID:", user);

    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const createUser = async (
  user: CreationUserRequest
): Promise<UserResponse> => {

  const formData = convertCreationUserRequest(user);

  console.log("Create User Form Data:", Object.fromEntries(formData.entries()));
  
  
  try {
    const response = await api.post<ApiResponse<UserResponse>>(
      "/users",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!response.data || !response.data.data) {
      throw new Error("No data found in the response");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  user: UpdateUserRequest
): Promise<ApiResponse<UserResponse>> => {
  const formData = convertUpdateUserRequest(user);
  console.log("Update User Form Data:", Object.fromEntries(formData.entries()));
  console.log("Update User ID:", id);

  try {
    const response = await api.patch<ApiResponse<UserResponse>>(
      `/users/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!response.data || !response.data.data) {
      throw new Error(response.data.message || "No data found in the response");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete<ApiResponse<null>>(`/users/${id}`);
    if (!response.data || response.data.status !== 200) {
      throw new Error("Failed to delete user");
    }

    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const filterUsers = async (
  query: QueryUserRequest
): Promise<paginationResponse<UserResponse>> => {
  try {
    console.log("Filtering users with query:", query);
    

    const response = await api.get<
      ApiResponse<paginationResponse<UserResponse>>
    >("/users", {
      params: query,
    });

    if (!response.data || !response.data.data) {
      throw new Error("No data found in the response");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error filtering users:", error);
    throw error;
  }
};

export const checkDuplicateUsername = async (
  username: string,
): Promise<boolean> => {
  try {
    const response = await api.get<ApiResponse<boolean>>(
      `/users/check-duplicate-account?account=${username}`
    );

    if (!response.data || response.data.status !== 200) {
      throw new Error("Failed to check duplicate username");
    }
    console.log("Response data:", response.data.data);
    

    return response.data.data ?? false;
  } catch (error) {
    console.error("Error checking duplicate username:", error);
    throw error;
  }
};

export const checkEmailDuplicate = async (
  email: string,
): Promise<boolean> => {
  try {
    const response = await api.get<ApiResponse<boolean>>(
      `/users/check-duplicate-email?email=${email}`
    );

    if (!response.data || response.data.status !== 200) {
      throw new Error("Failed to check duplicate email");
    }

    return response.data.data ?? false;
  } catch (error) {
    console.error("Error checking duplicate email:", error);
    throw error;
  }
};

export const checkPhoneNumberDuplicate = async (
  phoneNumber: string,
  excludeId?: string
): Promise<boolean> => {
  console.log("Checking duplicate phoneNumber:", phoneNumber);
  console.log("Excluded ID:", excludeId);

  try {
    const response = await api.get<ApiResponse<boolean>>(
      `/users/check-duplicate-phoneNumber?phoneNumber=${phoneNumber}`,
      {
        params: excludeId ? { excludeId } : {},
      }
    );

    if (!response.data || response.data.status !== 200) {
      throw new Error("Failed to check duplicate phoneNumber");
    }

    console.log("Response data:", response.data.data);

    return response.data.data ?? false;
  } catch (error) {
    console.error("Error checking duplicate phoneNumber:", error);
    throw error;
  }
};

export const toggleUserActiveStatus = async (
  id: string,
  isActive: boolean
): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await api.patch<ApiResponse<UserResponse>>(
      `/users/${id}/toggle`,
    );

    if (!response.data) {
      throw new Error("No data found in the response");
    }

    console.log("Toggle User Active Status Response:", response.data.message);

    return response.data;
  } catch (error) {
    console.error("Error toggling user active status:", error);
    throw error;
  }
};

export const resetUserPassword = async (id: string): Promise<Boolean> => {
  try {
    const response = await api.patch<ApiResponse<string>>(
      `/users/${id}/reset-password`
    );

    if (!response.data || response.data.status !== 200) {
      throw new Error("Failed to reset user password");
    }

    return !!response.data.data;
  } catch (error) {
    console.error("Error resetting user password:", error);
    throw error;
  }
};
