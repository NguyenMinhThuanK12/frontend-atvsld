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
  birthday?: Date;
  gender?: Gender;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  avatar?: string | File;
}