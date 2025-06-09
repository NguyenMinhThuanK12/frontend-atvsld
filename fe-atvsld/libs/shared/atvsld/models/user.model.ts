import { Gender } from "../../core/enums/gender";
import { UserType } from "../../core/enums/userType";

export interface User {
  id: string;
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
  province?: string | null;
  district?: string | null;
  ward?: string | null;
  address?: string | null;
  avatar?: string | File | null;
  isActive: boolean;
}