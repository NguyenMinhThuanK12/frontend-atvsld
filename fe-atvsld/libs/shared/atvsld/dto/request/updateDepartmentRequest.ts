export interface UpdateDepartmentRequest {
  name: string;
  establishedDate: string | null; // ISO date string in "yyyy-MM-dd" format or null
  businessType: string;
  mainBusinessField: string;
  registrationCity: string;
  registrationDistrict: string;
  registrationWard: string;
  registrationAddress: string;
  operationCity: string;
  operationDistrict: string;
  operationWard: string;
  operationAddress: string;
  foreignName: string;
  email: string;
  phoneNumber: string;
  representativeName: string;
  representativePhone: string;
  businessLicenseFile: File | string | null; // Assuming this is a file upload
  otherDocumentFile: File | string | null; // Assuming this is a file upload
}
