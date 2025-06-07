import { BusinessType } from "@/libs/shared/core/enums/businessType";
import { Gender } from "@/libs/shared/core/enums/gender";
import { UserType } from "@/libs/shared/core/enums/userType";

export const businessTypeOptions = [
  ...Object.keys(BusinessType).map((key) => ({
    value: BusinessType[key as keyof typeof BusinessType],
    label: BusinessType[key as keyof typeof BusinessType],
  })),
];



export const genderOptions = [
  ...Object.keys(Gender).map((key) => ({
    value: Gender[key as keyof typeof Gender],
    label: Gender[key as keyof typeof Gender],
  })),
];

export const userTypeOptions = [
  ...Object.keys(UserType).map((key) => ({
    value: UserType[key as keyof typeof UserType],
    label: UserType[key as keyof typeof UserType],
  })),
];

export const UserTypeOptionsForFiltering = [
  { key: "", value: "Tất cả" }, // Add "Tất cả" option
  ...Object.keys(UserType).map((key) => ({
    value: key,
    label: UserType[key as keyof typeof UserType],
  })),
];