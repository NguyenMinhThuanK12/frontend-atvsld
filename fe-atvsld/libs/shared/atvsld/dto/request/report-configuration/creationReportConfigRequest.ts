import { ReportingPeriod } from "@/libs/shared/core/enums/reportingPeriod";
import { ReportType } from "@/libs/shared/core/enums/reportType";

export interface CreationReportConfigRequest {
    reportName: ReportType; 
    year: number; 
    period: ReportingPeriod; 
    startDate: Date; 
    endDate: Date; 
}