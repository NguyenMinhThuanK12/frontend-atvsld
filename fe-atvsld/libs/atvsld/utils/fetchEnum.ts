import { BusinessType } from "@/libs/shared/core/enums/businessType";

export const businessTypeOptions = [
  { key: "", value: "Tất cả" }, // Add "Tất cả" option
  ...Object.keys(BusinessType).map((key) => ({
    key: key,
    value: BusinessType[key as keyof typeof BusinessType],
  })),
];