import { ReportSanitationRow } from "@/libs/atvsld/pages/Clients/Report";
import { ReportInstance } from "../models/report-instance.model";
import { formatDate } from "@/libs/atvsld/utils/commonFunction";
import { ReportingPeriod } from "../../core/enums/reportingPeriod";
import { ReportInstanceResponse } from "../dto/response/report-ssanitation/reportInstanceResponse";
import { QueryReportInstanceRequest } from "../dto/request/report-sanitation/QueryReportInstanceRequest";
import { ReportStatus } from "../../core/enums/reportStatus";

export const convertToReportSanitationRow = (
  report: ReportInstanceResponse[]
): ReportSanitationRow[] => {

  const rows = report.map((item) => ({
    id: item.id,
    businessName: item.businessName,
    startDate: formatDate(item.startDate),
    endDate: formatDate(item.endDate),
    reportingPeriod: item.period ?? ReportingPeriod.ALL_YEAR, 
    status: item.isOverdue ? "Quá hạn" : item.status,
    updatedDate: item.lastUpdatedDate ? formatDate(item.lastUpdatedDate) : "N/A",
    updateBy: item.lastUpdatedBy ? item.lastUpdatedBy : "N/A",
    isOverdue: item.isOverdue,
  }));
    
  return rows;
};


export const mappingReportInstanceToResponseToReportInstance = (response: ReportInstanceResponse): ReportInstance => {
  return {
    id: response.id,
    status: response.status || null,
    businessName: response.businessName,
    year: response.year,
    startDate: response.startDate ? new Date(response.startDate) : null,
    endDate: response.endDate ? new Date(response.endDate) : null,
    period: response.period || null,
    lastUpdatedDate: response.lastUpdatedDate ? new Date(response.lastUpdatedDate) : null,
    lastUpdatedBy: response.lastUpdatedBy || null,
  };
}

export const mappingFilterToQueryReportInstance = (filter: Record<string, string>): QueryReportInstanceRequest => {
  return {
    status: filter.status as ReportStatus || undefined,
    businessName: filter.businessName || undefined,
    startDate: filter.startDate ? new Date(filter.startDate) : undefined,
    endDate: filter.endDate ? new Date(filter.endDate) : undefined,
    period: filter.period as ReportingPeriod || undefined,
    year: filter.year || undefined,
    lastUpdatedFrom: filter.lastUpdatedFrom ? new Date(filter.lastUpdatedFrom) : undefined,
    updatedBy: filter.updatedBy || undefined,
  };
}