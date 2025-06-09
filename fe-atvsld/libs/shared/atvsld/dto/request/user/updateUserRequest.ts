import { Gender } from "@/libs/shared/core/enums/gender";

export interface UpdateUserRequest {
  fullName: string;
  jobTitle: string;

  phoneNumber: string;

  birthday?: Date | null;
  gender?: Gender | null;

  avatar?: string | File | null;

  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  isActive?: boolean;
}
