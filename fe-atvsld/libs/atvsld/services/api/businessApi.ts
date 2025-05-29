import { Business } from "@/libs/shared/atvsld/models/business.model";
import api from "../configuration/axiosConfig";
import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response";
import { CreationBusinessRequest } from "@/libs/shared/atvsld/dto/request/creationBussinessRequest";
import { UpdateBusinessRequest } from "@/libs/shared/atvsld/dto/request/updateBusinessRequest";
import { format } from "date-fns";
import { useEffect } from "react";
import { id } from "date-fns/locale";
import { QueryBusinessRequest } from "@/libs/shared/atvsld/dto/request/queryBussinessRequest";

export const getBusinesses = async (): Promise<
  paginationResponse<Business>
> => {
  try {
    console.log("Fetching businesss...");

    const response = await api.get<ApiResponse<paginationResponse<Business>>>(
      "/businesses"
    );
    console.log("API Response:", response.data.data);
    if (!response.data.data) {
      throw new Error("No data found in the response");
    }

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getBusinessById = async (
  id: string
): Promise<ApiResponse<Business>> => {
  try {
    console.log("Fetching business by ID:", id);

    const response = await api.get<ApiResponse<Business>>(`/businesses/${id}`);
    console.log("API Response:", response.data);

    if (!response.data || !response.data.data) {
      throw new Error("Không tìm thấy doanh nghiệp với ID: " + id);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBusiness = async (
  business: CreationBusinessRequest
): Promise<ApiResponse<Business>> => {
  try {
    console.log("before call creation api: ", business);

    const formData = new FormData();
    formData.append("name", business.name || "");
    formData.append("taxCode", business.taxCode || "");
    formData.append(
      "establishedDate",
      business.establishedDate
        ? format(business.establishedDate, "yyyy-MM-dd'T'HH:mm:ssXXX")
        : ""
    );
    formData.append("mainBusinessField", business.mainBusinessField || "");
    formData.append("businessType", business.businessType || "");
    formData.append("registrationCity", business.registrationCity || "");
    formData.append(
      "registrationDistrict",
      business.registrationDistrict || ""
    );
    formData.append("registrationWard", business.registrationWard || "");
    formData.append("registrationAddress", business.registrationAddress || "");

    formData.append("operationCity", business.operationCity || "");
    formData.append("operationDistrict", business.operationDistrict || "");
    formData.append("operationWard", business.operationWard || "");
    formData.append("operationAddress", business.operationAddress || "");

    if (business.foreignName) {
      formData.append("foreignName", business.foreignName);
    }
    formData.append("email", business.email || "");
    if (business.phoneNumber) {
      formData.append("phoneNumber", business.phoneNumber);
    }
    if (business.representativeName) {
      formData.append("representativeName", business.representativeName);
    }
    if (business.representativePhone) {
      formData.append("representativePhone", business.representativePhone);
    }

    // Append files if they exist
    if (business.businessLicenseFile instanceof File) {
      formData.append("businessLicense", business.businessLicenseFile);
    }
    if (business.otherDocumentFile instanceof File) {
      formData.append("otherDocument", business.otherDocumentFile);
    }

    console.log(
      "Before update FormData entries:",
      Object.fromEntries(formData)
    );
    const response = await api.post<ApiResponse<Business>>(
      "/businesses",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.status !== 201) {
      console.log("message from creation api: ", response.data.message);
    }
    console.log("Create Response:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBusiness = async (
  id: string,
  business: UpdateBusinessRequest
) => {
  try {
    console.log("before update", business);

    const formData = new FormData();
    formData.append("name", business.name || "");
    formData.append(
      "establishedDate",
      business.establishedDate
        ? format(new Date(business.establishedDate), "yyyy-MM-dd'T'HH:mm:ssXXX")
        : ""
    );
    formData.append("mainBusinessField", business.mainBusinessField || "");
    formData.append("businessType", business.businessType || "");
    formData.append("registrationCity", business.registrationCity || "");
    formData.append(
      "registrationDistrict",
      business.registrationDistrict || ""
    );
    formData.append("registrationWard", business.registrationWard || "");
    formData.append("registrationAddress", business.registrationAddress || "");

    formData.append("operationCity", business.operationCity || "");
    formData.append("operationDistrict", business.operationDistrict || "");
    formData.append("operationWard", business.operationWard || "");
    formData.append("operationAddress", business.operationAddress || "");

    if (business.foreignName) {
      formData.append("foreignName", business.foreignName);
    }
    formData.append("email", business.email || "");
    if (business.phoneNumber) {
      formData.append("phoneNumber", business.phoneNumber);
    }
    if (business.representativeName) {
      formData.append("representativeName", business.representativeName);
    }
    if (business.representativePhone) {
      formData.append("representativePhone", business.representativePhone);
    }

    // Append files if they exist
    if (business.businessLicenseFile instanceof File) {
      formData.append("businessLicense", business.businessLicenseFile);
    }
    if (business.otherDocumentFile instanceof File) {
      formData.append("otherDocument", business.otherDocumentFile);
    }

    console.log(
      "Before update FormData entries:",
      Object.fromEntries(formData)
    );

    const response = await api.patch<ApiResponse<Business>>(
      `/businesses/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.status !== 200) {
      console.log("message: ", response.data.message);
    }

    console.log("Update Response:", response.data);
    
    return response.data;
  } catch (error) {
    console.log("Error during update:", error);
    throw error;
  }
};

export const deleteBusiness = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete<ApiResponse<null>>(`/businesses/${id}`);
    console.log("Delete Response:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkTaxCodeExists = async(
  taxCode: string
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.get<ApiResponse<boolean>>(
      `/businesses/check-duplicate-tax-code?taxCode=${taxCode}`
    );
    console.log("Check Tax Code Response:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const checkDuplicateEmail = async(
  email: string
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.get<ApiResponse<boolean>>(
      `/businesses/check-duplicate-email?email=${email}`
    );
    console.log("Check Email Response:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateBusinessStatus = async(
  id: string,
  isActive: boolean
): Promise<ApiResponse<Business>> => {
  try {
    const response = await api.patch<ApiResponse<Business>>(
      `/businesses/${id}/status`,
      { isActive }
    );
    console.log("Update Status Response:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const filterBusinesses = async(
  query: QueryBusinessRequest
): Promise<ApiResponse<paginationResponse<Business>>> => {
  try {
    console.log("Filtering businesses with query:", query);
    
    const response = await api.get<ApiResponse<paginationResponse<Business>>>(
      "/businesses/search",
      { params: query }
    );
    console.log("Filter Businesses Response:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

