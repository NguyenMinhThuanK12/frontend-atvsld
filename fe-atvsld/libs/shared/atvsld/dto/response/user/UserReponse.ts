import { Gender } from "@/libs/shared/core/enums/gender";
import { UserType } from "@/libs/shared/core/enums/userType";

export interface UserResponse {
  id: string;
  username: string;
  password: string;
  fullName: string;
  jobTitle: string;

  userType: UserType;
  roleId: string | null;
  businessId: string | null;

  email: string;
  phoneNumber: string;
  birthday?: Date | null;
  gender?: Gender;

  province?: string | null;
  district?: string | null;
  ward?: string | null;
  address?: string | null;

  avatar?: string | File | null;
  is_active: boolean;
}