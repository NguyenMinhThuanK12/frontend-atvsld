import { Role } from "@/libs/shared/atvsld/models/role.model";
import { isDuplicateRoleCode } from "../../components/PermissionFeature/handlePerrmissionFeatures";
import { UserType } from "@/libs/shared/core/enums/userType";

// validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// validate password
export const validatePassword = (password: string): boolean => {
  const passwordRegex =
    /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// validate common text fields
export const isEmpty = (value: string): boolean => {
  return value.trim() === "";
};

// validate role
export const validateRole = async (
  role: Role
): Promise<{ isValid: boolean; invalidField: string; message: string }> => {
  if (await isDuplicateRoleCode(role.code))
    return {
      isValid: false,
      invalidField: "code",
      message: "Mã vai trò đã tồn tại",
    };

  if (isEmpty(role.code) || isEmpty(role.name)) {
    const emptyFields = [];
    if (isEmpty(role.code)) emptyFields.push("code");
    if (isEmpty(role.name)) emptyFields.push("name");
    return {
      isValid: false,
      invalidField: emptyFields.join(","),
      message: "Vui lòng điền đầy đủ thông tin bắt buộc",
    };
  }

  if (role.permissionIds.length === 0) {
    return {
      isValid: false,
      invalidField: "permissions",
      message: "Vai trò phải có ít nhất một quyền",
    };
  }
  return { isValid: true, invalidField: "", message: "" };
};

// validate avatar upload
export const validateImageFile = (
  input: File | string
): { isValid: boolean; errorMessage?: string } => {
  console.log("Validating image file:", input);
  
  const validTypes = ["image/jpeg", "image/jpg", "image/png"];
  const validExtensions = [".jpeg", ".jpg", ".png"];

  // Handle File input
  if (input instanceof File) {
    if (!validTypes.includes(input.type)) {
      return {
        isValid: false,
        errorMessage: "Chỉ hỗ trợ định dạng *.jpeg, *.jpg, *.png",
      };
    }
    if (input.size > 100 * 1024 * 1024) {
      return {
        isValid: false,
        errorMessage: "Kích thước tệp tối đa là 100MB",
      };
    }
    return { isValid: true };
  }

  // Handle string (URL) input
  if (typeof input === "string") {
    const lowerCaseInput = input.toLowerCase();
    if (!validExtensions.some((ext) => lowerCaseInput.endsWith(ext))) {
      return {
        isValid: false,
        errorMessage: "URL ảnh phải có định dạng *.jpeg, *.jpg hoặc *.png",
      };
    }
    return { isValid: true }; // Assume URL is valid if extension matches
  }

  // Invalid input type
  return {
    isValid: false,
    errorMessage: "Dữ liệu ảnh không hợp lệ",
  };
};
