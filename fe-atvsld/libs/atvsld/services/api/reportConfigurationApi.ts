import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response"
import api from "../configuration/axiosConfig"
import { ReportConfigResponse } from "@/libs/shared/atvsld/dto/response/report-configuration/ReportCongiResponse"
import { CreationReportConfigRequest } from "@/libs/shared/atvsld/dto/request/report-configuration/creationReportConfigRequest"
import { UpdateReportConfigRequest } from "@/libs/shared/atvsld/dto/request/report-configuration/updateReportConfigRequest"
import { QueryReportConfigRequest } from "@/libs/shared/atvsld/dto/request/report-configuration/queryReportConfigRequest"

export const getAll = async (): Promise<ApiResponse<paginationResponse<ReportConfigResponse>>> => {
    try {
        const response = await api.get<ApiResponse<paginationResponse<ReportConfigResponse>>>("report-configurations")
        if (!response.data.data) {
            throw new Error(response.data.message || "No data found in the response")
        }

        return response.data;
    } catch (error) {
        console.error("Error fetching report configurations:", error);
        throw error;
    }
}

export const getById = async (id: string): Promise<ApiResponse<ReportConfigResponse>> => {
    try {
        const response = await api.get<ApiResponse<ReportConfigResponse>>(`report-configurations/${id}`)
        if (!response.data || !response.data.data) {
            throw new Error(response.data.message || "No report configuration found with the given ID")
        }
        return response.data
    } catch (error) {
        console.error("Error fetching report configuration by ID:", error)
        throw error
    }
}

export const createReportConfiguration = async (reportConfig: CreationReportConfigRequest): Promise<ApiResponse<ReportConfigResponse>> => {    
    try {
        const response = await api.post<ApiResponse<ReportConfigResponse>>("report-configurations", reportConfig)
        if (!response.data || response.data.status !== 201) {
            throw new Error(response.data.message || "Failed to create report configuration")
        }        
        return response.data
    } catch (error) {
        console.error("Error creating report configuration:", error)
        throw error
    }
}

export const updateReportConfiguration = async (id: string, reportConfig: UpdateReportConfigRequest): Promise<ApiResponse<ReportConfigResponse>> => {
    try {
        const response = await api.patch<ApiResponse<ReportConfigResponse>>(`report-configurations/${id}`, reportConfig)
        if (!response.data || !response.data.data) {
            throw new Error(response.data.message || "Failed to update report configuration")
        }
        return response.data
    } catch (error) {
        console.error("Error updating report configuration:", error)
        throw error
    }
}


export const toggleActiveStatus = async (id: string): Promise<ApiResponse<{ isActive: boolean }>> => {
    try {
        const response = await api.patch<ApiResponse<{ isActive: boolean }>>(`report-configurations/${id}/toggle`)
        if (!response.data || response.data.status !== 200) {
            throw new Error(response.data.message || "Failed to toggle active status")
        }
        return response.data
    } catch (error) {
        console.error("Error toggling active status:", error)
        throw error
    }
}

export const filterReportConfigurations = async (query: QueryReportConfigRequest): Promise<ApiResponse<paginationResponse<ReportConfigResponse>>> => {
    console.log("Filtering report configurations with query:", query);
    
    try {
        const response = await api.get<ApiResponse<paginationResponse<ReportConfigResponse>>>("report-configurations", {
            params: query
        })
        if (!response.data || !response.data.data) {
            throw new Error(response.data.message || "No report configurations found")
        }
        return response.data
    } catch (error) {
        console.error("Error filtering report configurations:", error)
        throw error
    }
}

export const checkDuplicateYear = async (reportName: string, year: string, excludeId?: string): Promise<ApiResponse<{ isDuplicate: boolean}>> => {
    console.log("Checking for duplicate year:", { reportName, year, excludeId });
    try {
        const response = await api.get<ApiResponse<{ isDuplicate: boolean}>>("report-configurations/check-duplicate-year", {
            params: { reportName, year, excludeId }
        })
        if (!response.data || response.data.status !== 200) {
            throw new Error(response.data.message || "Failed to check duplicate year")
        }

        console.log("Duplicate year check response:", response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error checking duplicate year:", error)
        throw error
    }
}