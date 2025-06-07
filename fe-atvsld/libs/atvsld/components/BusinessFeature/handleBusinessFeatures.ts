import { QueryBusinessRequest } from "@/libs/shared/atvsld/dto/request/business/queryBussinessRequest";
import {
  checkDuplicateEmail,
  checkTaxCodeExists,
  createBusiness,
  deleteBusiness,
  filterBusinesses,
  getBusinesses,
  updateBusiness,
  updateBusinessStatus,
} from "../../services/api/businessApi";
import { Business } from "@/libs/shared/atvsld/models/business.model";
import { BusinessRow } from "../../pages/Business";
import { BusinessType } from "@/libs/shared/core/enums/businessType";
import { CreationBusinessRequest } from "@/libs/shared/atvsld/dto/request/business/creationBussinessRequest";
import { UpdateBusinessRequest } from "@/libs/shared/atvsld/dto/request/business/updateBusinessRequest";

export const defaultBusiness: Business = {
  id: "",
  name: "",
  taxCode: "",
  foreignName: "",
  establishedDate: null,
  email: "",
  phoneNumber: "",
  businessType: BusinessType.PRIVATE,
  mainBusinessField: "",
  registrationDistrict: "",
  registrationWard: "",
  registrationCity: "",
  registrationAddress: "",
  operationDistrict: "",
  operationWard: "",
  operationCity: "",
  operationAddress: "",
  representativeName: "",
  representativePhone: "",
  businessLicenseFile: null,
  otherDocumentFile: null,
  isActive: true,
};


export const fetchBusinesses = async () => {
  try {
    const response = await getBusinesses();
    if (!response.data || response.data.length === 0) {
      console.log("Không có doanh nghiệp nào được tìm thấy", "info");
      return;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching businesses:", error);
  }
};

export const applyFilters = async (filters: Record<string, string>) => {
  try {
    const query: QueryBusinessRequest = {
      name: filters["name"] || undefined,
      taxCode: filters["taxCode"] || undefined,
      businessType: filters["businessType"] || undefined,
      mainBusinessField: filters["mainBusinessField"] || undefined,
      registrationDistrict: filters["district"] || undefined,
      registrationWard: filters["ward"] || undefined,
    };

    const response = await filterBusinesses(query);

    if (response.status !== 200 || !response.data?.data) {
      console.log(
        "Không tìm thấy doanh nghiệp phù hợp với điều kiện lọc.",
        "error"
      );
      return;
    }

    return response.data?.data;
  } catch (error) {
    console.error("Error filtering businesses:", error);
  }
};

export const handleStatusChange = async (rowId: string, newStatus: boolean): Promise<Boolean> => {
  try {
    const response = await updateBusinessStatus(rowId, newStatus);
    if (response.status !== 200 || !response.data) {
      throw new Error(`Failed to update status for business with ID: ${rowId}`);
    }

    return response.data.isActive;
  } catch (error) {
    console.error("Error updating status:", error);
    return false; // Return false if the status update fails
  }
};

export const handleDeleteBusinesses = async (selectedRows: BusinessRow[]): Promise<Boolean> => {
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          const response = await deleteBusiness(row.id);
          if (response.status !== 200) {
            throw new Error(`Failed to delete department with ID: ${row.id}`);
          }
        })
      );
      return true; // All deletions were successful
    } catch (error) {
      console.error("Error deleting departments:", error);
      return false; // Return false if any deletion fails
    }
  };


  // let parsedEstablishedDate: Date | null = null;
  //   if (formData?.establishedDate) {
  //     if (typeof formData.establishedDate === "string") {
  //       parsedEstablishedDate = parse(
  //         formData.establishedDate,
  //         "yyyy-MM-dd",
  //         new Date()
  //       );
  //       if (!isValid(parsedEstablishedDate)) {
  //         parsedEstablishedDate = null; // Fallback if parsing fails
  //       }
  //     } else if (formData.establishedDate instanceof Date) {
  //       parsedEstablishedDate = formData.establishedDate;
  //     }
//   }
  
export const checkDuplicatedTaxCode = async (
  taxCode: string
): Promise<boolean> => {
  try {
    const response = await checkTaxCodeExists(taxCode);
    if (!response || response.status !== 200) {
      console.error("Failed to check tax code duplicate:", response);
      return false;
    }

    const isDuplicate = response.data;

    return isDuplicate ?? false;
  } catch (error) {
    console.error("Error checking tax code duplicate:", error);
    return false;
  }
};

export const checkDuplicatedEmail = async (email: string): Promise<boolean> => {
  try {
    const response = await checkDuplicateEmail(email);
    if (!response || response.status !== 200) {
      console.error("Failed to check email duplicate:", response);
      return false;
    }

    const isDuplicate = response.data;
    
    return isDuplicate ?? false;
  } catch (error) {
    console.error("Error checking email duplicate:", error);
    return false;
  }
}

const mappingBusinessToCreationRequest = (business: Business): CreationBusinessRequest => {
  return {
    name: business.name,
    taxCode: business.taxCode,
    foreignName: business.foreignName,
    establishedDate: business.establishedDate ? new Date(business.establishedDate).toISOString() : null,
    email: business.email,
    phoneNumber: business.phoneNumber,
    businessType: business.businessType,
    mainBusinessField: business.mainBusinessField,
    registrationDistrict: business.registrationDistrict,
    registrationWard: business.registrationWard,
    registrationCity: business.registrationCity,
    registrationAddress: business.registrationAddress,
    operationDistrict: business.operationDistrict,
    operationWard: business.operationWard,
    operationCity: business.operationCity,
    operationAddress: business.operationAddress,
    representativeName: business.representativeName,
    representativePhone: business.representativePhone,
    businessLicenseFile: business.businessLicenseFile,
    otherDocumentFile: business.otherDocumentFile,
  };
}

const mappingBusinessToUpdateRequest = (business: Business): UpdateBusinessRequest => {
  return {
    name: business.name,
    establishedDate: business.establishedDate ? new Date(business.establishedDate).toISOString() : null,
    businessType: business.businessType,
    mainBusinessField: business.mainBusinessField,
    registrationCity: business.registrationCity,
    registrationDistrict: business.registrationDistrict,
    registrationWard: business.registrationWard,
    registrationAddress: business.registrationAddress,
    operationCity: business.operationCity,
    operationDistrict: business.operationDistrict,
    operationWard: business.operationWard,
    operationAddress: business.operationAddress,
    foreignName: business.foreignName,
    email: business.email,
    phoneNumber: business.phoneNumber,
    representativeName: business.representativeName,
    representativePhone: business.representativePhone,
    businessLicenseFile: business.businessLicenseFile,
    otherDocumentFile: business.otherDocumentFile
  };
};

export const handleCreateBusiness = async (business: Business): Promise<Boolean> => {
  try {
    // mapping Business model to CreationBusinessRequest
    const request: CreationBusinessRequest = mappingBusinessToCreationRequest(business);

    const response = await createBusiness(request);
    if (!response.data || response.status !== 201) {
      console.error("Failed to create business:", response);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error creating business:", error);
    return false;
  }
}

export const handleUpdateBusiness = async (business: Business): Promise<Boolean> => {
  try {
    // mapping Business model to CreationBusinessRequest
    const request: UpdateBusinessRequest =
      mappingBusinessToUpdateRequest(business);

    const response = await updateBusiness(business.id, request);
    if (!response.data || response.status !== 200) {
      console.error("Failed to update business:", response);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating business:", error);
    return false;
  }
}