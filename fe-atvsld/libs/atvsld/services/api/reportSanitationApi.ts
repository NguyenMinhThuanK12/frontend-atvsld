import { ApiResponse } from "@/libs/shared/atvsld/dto/response/api-response";
import api from "../configuration/axiosConfig";
import { ReportInstanceResponse } from "@/libs/shared/atvsld/dto/response/report-ssanitation/reportInstanceResponse";
import { QueryReportInstanceRequest } from "@/libs/shared/atvsld/dto/request/report-sanitation/QueryReportInstanceRequest";

export const getReportInstance = async (query?: QueryReportInstanceRequest): Promise<ApiResponse<paginationResponse<ReportInstanceResponse>>> => {
    console.log("Fetching report sanitation with query:", query);
    
  try {
        const response =
          await api.get<ApiResponse<paginationResponse<ReportInstanceResponse>>>(
              "report-instances/search",
                { params: query }
          );
        if (!response.data.data || response.data.status !== 200) {
          throw new Error(
            response.data.message || "No report sanitation data found"
          );
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching report sanitation:", error);
        throw error;
    }
}

export const getActiveYears = async (): Promise<ApiResponse<number[]>> => {
  try {
    const response = await api.get<ApiResponse<number[]>>("report-instances/years");
    if (!response.data.data || response.data.status !== 200) {
      throw new Error(response.data.message || "No active years found");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching active years:", error);
    throw error;
  }
}