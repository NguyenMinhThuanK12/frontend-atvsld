import { UUID } from "crypto";
import { BusinessType } from "../../core/enums/businessType";

export interface Business {
  id: string;
  name: string;
  taxCode: string;
  establishedDate: string | Date | null;
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
  email: string;
  phoneNumber: string | null;

  representativeName: string | null;
  representativePhone: string | null;

  isActive: boolean;
  businessLicenseFile: File | string | null;
  otherDocumentFile: File | string | null;
}
