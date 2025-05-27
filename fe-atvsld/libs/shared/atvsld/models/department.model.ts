import { BusinessType } from "../../core/enums/businessType";

export interface Department {
  id: number;
  name: string;
  taxCode: string;
  establishedDate: Date | null;
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

  foreignName: string | null;
  email: string | null;
  phoneNumber: string | null;

  representativeName: string | null;
  representativePhone: string | null;

  isActive: boolean;
  businessLicenseFile: File | string | null;
  otherDocumentFile: File | string | null;
}