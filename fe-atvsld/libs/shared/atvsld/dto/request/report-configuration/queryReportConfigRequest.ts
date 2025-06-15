import { ReportingPeriod } from "@/libs/shared/core/enums/reportingPeriod";
import { ReportType } from "@/libs/shared/core/enums/reportType";

export interface QueryReportConfigRequest {
  reportName?: ReportType;
  year?: string;
  period?: ReportingPeriod;
  startDate?: Date;
  endDate?: Date;
  isActive?: string;
}
