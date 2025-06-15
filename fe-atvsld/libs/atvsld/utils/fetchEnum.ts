import { BusinessType } from "@/libs/shared/core/enums/businessType";
import { Gender } from "@/libs/shared/core/enums/gender";
import { ReportingPeriod } from "@/libs/shared/core/enums/reportingPeriod";
import { ReportStatus } from "@/libs/shared/core/enums/reportStatus";
import { ReportType } from "@/libs/shared/core/enums/reportType";
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

export const ReportTypeOptions = [
  ...Object.keys(ReportType).map((key) => ({
    value: ReportType[key as keyof typeof ReportType],
    label: ReportType[key as keyof typeof ReportType],
  })),
];

export const ReportingPeriodOptions = [
  ...Object.keys(ReportingPeriod).map((key) => ({
    value: ReportingPeriod[key as keyof typeof ReportingPeriod],
    label: ReportingPeriod[key as keyof typeof ReportingPeriod],
  })),
];

export const ReportStatusOptions = [
  ...Object.keys(ReportStatus).map((key) => ({
    value: ReportStatus[key as keyof typeof ReportStatus],
    label: ReportStatus[key as keyof typeof ReportStatus],
  })),
]