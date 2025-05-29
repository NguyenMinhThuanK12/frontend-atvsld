import { BusinessType } from "@/libs/shared/core/enums/businessType";

export interface CreationBusinessRequest {
  name: string;
  taxCode: string;
  establishedDate: Date | string | null;
  businessType: BusinessType;
  mainBusinessField: string;
  registrationCity: string;
  registrationDistrict: string;
  registrationWard: string;
  registrationAddress: string | null;

  operationCity: string | null;
  operationDistrict: string | null;
  operationWard: string | null;
  operationAddress: string | null;

  foreignName?: string | null;
  email: string;
  phoneNumber?: string | null;
  representativeName?: string | null;
  representativePhone?: string | null;

  businessLicenseFile?: File | string | null;
  otherDocumentFile?: File | string | null;
}
