import api from "../configuration/axiosConfig";

interface UserResponse {
  id: string;
  username: string;
  fullName: string;
  password: string;
  email: string;
  phone: string;
  dob: string;
  jobTitle: string;
  active: boolean;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export const getUsers = async (): Promise<UserResponse[]> => {
  try {
    const response = await api.get<ApiResponse<UserResponse[]>>("/api/v1/users");
    console.log("API Response:", response.data); 
    return response.data.result;
  } catch (error: any) {
    console.error("API Error:", error.message);
    throw error;
  }
};