import { Gender } from "@/libs/shared/core/enums/gender";
import { UserType } from "@/libs/shared/core/enums/userType";

export interface CreationUserRequest {
  username: string;
  password: string;
  fullName: string;
  jobTitle: string;
  userType: UserType | null;
  businessId: string | null;
  roleId: string | null;

  email: string;
  phoneNumber: string;

  birthday?: Date | null;
  gender?: Gender | null;

  avatar?: string |File | null;

  province?: string;
  district?: string;
  ward?: string;
  address?: string;
}
