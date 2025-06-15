import {
  createUser,
  deleteUser,
  filterUsers,
  getUserById,
  getUsers,
  resetUserPassword,
  toggleUserActiveStatus,
  updateUser,
} from "../../services/api/userApi";
import { User } from "@/libs/shared/atvsld/models/user.model";
import { mappingUserResponseToUser } from "@/libs/shared/atvsld/mapping/UserMapping";
import { CreationUserRequest } from "@/libs/shared/atvsld/dto/request/user/creationUserRequest";
import { UpdateUserRequest } from "@/libs/shared/atvsld/dto/request/user/updateUserRequest";
import { UserRow } from "../../pages/User";
import { QueryUserRequest } from "@/libs/shared/atvsld/dto/request/user/queryUserRequest";

export const defaultUser: User = {
  id: "",
  username: "",
  password: "Abcd1@34",
  fullName: "",
  jobTitle: "",
  userType: null,
  businessId: null,
  roleId: null,
  email: "",
  phoneNumber: "",
  birthday: null,
  gender: null,
  province: "",
  district: "",
  ward: "",
  address: "",
  avatar: null,
  isActive: true,
};

export const getAllUsersFeature = async (): Promise<User[]> => {
  try {
    const response = await getUsers();

    if (!response.data) {
      throw new Error("No users found");
    }

    const users: User[] = response.data.map((userResponse) =>
      mappingUserResponseToUser(userResponse)
    );

    return users;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const getUserByIdFeature = async (id: string): Promise<User> => {
  try {
    const response = await getUserById(id); // Assuming this function fetches all users

    if (!response) {
      throw new Error(`User with ID ${id} not found`);
    }

    const user = mappingUserResponseToUser(response);

    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const createUserFeature = async (
  user: CreationUserRequest
): Promise<Boolean> => {
  try {
    const response = await createUser(user); // Assuming this function creates a user

    if (!response) {
      throw new Error("Failed to create user");
    }

    return !!response;
  } catch (error) {
    console.error("Error creating user:", error);
    return false; // Return false if there was an error
  }
};

export const updateUserFeature = async (
  id: string,
  user: UpdateUserRequest
): Promise<Boolean> => {
  try {
    const response = await updateUser(id, user);

    if (!response.data || response.status !== 200) {
      throw new Error(response.message || "Failed to update user");
    }

    return !!response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const deleteUserFeature = async (selectedRows: UserRow[]) => {
  try {
    await Promise.all(
      selectedRows.map(async (row) => {
        const userId = row.id;
        const response = await deleteUser(userId);
        if (!response) {
          throw new Error(`Failed to delete user with ID: ${userId}`);
        }
      })
    );
    return true; // All deletions were successful
  } catch (error) {
    console.error("Error deleting user:", error);
    return false; // Return false if there was an error
  }
};

export const filterUsersFeature = async (
  filters: Record<string, string>
): Promise<User[]> => {
  const query: QueryUserRequest = {
    fullName: filters["fullName"],
    username: filters["username"],
    jobTitle: filters["jobTitle"],
    userType: filters["userType"],
    businessId: filters["businessId"],
    roleId: filters["roleId"],
    isActive: filters["isActive"],
  };

  console.log("Filtering users with query:", query);

  try {
    const response = await filterUsers(query);

    if (!response.data) {
      throw new Error("No users found");
    }

    const users: User[] = response.data.map((userResponse) =>
      mappingUserResponseToUser(userResponse)
    );

    return users;
  } catch (error) {
    console.error("Error filtering users:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const toggleUserStatusFeature = async (
  id: string,
  isActive: boolean
): Promise<Boolean> => {
  try {
    const response = await toggleUserActiveStatus(id, isActive);

    if (!response.data || response.status !== 200) {
      console.log("Toggle User Status Response:", response.message);
      
      throw new Error(response.message);
    }

    return !!response;
  } catch (error) {
    console.error("Error toggling user status:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const resetUserPasswordFeature = async (id: string): Promise<Boolean> => {
  try {
    // Assuming resetUserPassword is a function that resets the user's password
    const response = await resetUserPassword(id);

    if (!response) {
      throw new Error(`Failed to reset password for user with ID: ${id}`);
    }

    return !!response; // Return true if the password was reset successfully
  } catch (error) {
    console.error("Error resetting user password:", error);
    return false; // Return false if there was an error
  }
};