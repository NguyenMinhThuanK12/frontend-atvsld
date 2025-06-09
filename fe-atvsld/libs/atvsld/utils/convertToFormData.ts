import { CreationUserRequest } from "@/libs/shared/atvsld/dto/request/user/creationUserRequest";
import { UpdateUserRequest } from "@/libs/shared/atvsld/dto/request/user/updateUserRequest";

export const convertCreationUserRequest = (
  user: CreationUserRequest
): FormData => {
  console.log("Converting CreationUserRequest to FormData:", user);
  
  const formData = new FormData();

  // Helper function to append non-empty values
  const appendIfDefined = (key: string, value: any) => {
    if (value !== null && value !== undefined) {
      formData.append(key, typeof value === "string" ? value : String(value));
    }
  };

  // Append required fields
  appendIfDefined("username", user.username);
  appendIfDefined("password", user.password);
  appendIfDefined("fullName", user.fullName);
  appendIfDefined("jobTitle", user.jobTitle);
  appendIfDefined("email", user.email);

  // Append optional fields
  appendIfDefined("userType", user.userType);
  appendIfDefined("businessId", user.businessId);
  appendIfDefined("roleId", user.roleId);
  appendIfDefined("phoneNumber", user.phoneNumber);
  appendIfDefined("gender", user.gender);
  appendIfDefined("province", user.province);
  appendIfDefined("district", user.district);
  appendIfDefined("ward", user.ward);
  appendIfDefined("address", user.address);

  // Handle birthday (format as YYYY-MM-DD if defined)
  if (user.birthday) {
    formData.append("birthday", user.birthday.toISOString().split("T")[0]);
  }

  // Handle avatar (File or string)
  if (user.avatar instanceof File) {
    formData.append("avatar", user.avatar);
  }

  return formData;
};

export const convertUpdateUserRequest = (user: UpdateUserRequest): FormData => {
  console.log("user in convertUpdateUserRequest:", user);
  
  const formData = new FormData();

  // Helper function to append non-empty values
  const appendIfDefined = (key: string, value: any) => {
    if (value !== null && value !== undefined) {
      formData.append(key, typeof value === "string" ? value : String(value));
    }
  };

  // Append required fields
  appendIfDefined("fullName", user.fullName);
  appendIfDefined("jobTitle", user.jobTitle);
  appendIfDefined("phoneNumber", user.phoneNumber);

  // Append optional fields
  appendIfDefined("gender", user.gender);
  appendIfDefined("province", user.province);
  appendIfDefined("district", user.district);
  appendIfDefined("ward", user.ward);
  appendIfDefined("address", user.address);
  appendIfDefined("isActive", user.isActive);

  // Handle birthday (format as YYYY-MM-DD if defined)
  if (user.birthday) {
    formData.append("birthday", user.birthday.toISOString().split("T")[0]);
  }

  // Handle avatar (File or string)
  if (user.avatar instanceof File) {
    formData.append("avatar", user.avatar);
  } 

  return formData;
};
