import { ReportingPeriod } from "@/libs/shared/core/enums/reportingPeriod";
import { ReportStatus } from "@/libs/shared/core/enums/reportStatus";

export interface QueryReportInstanceRequest {
  status?: ReportStatus;
  businessName?: string;
  startDate?: Date;
  endDate?: Date;
  period?: ReportingPeriod;
  year?: string;
  lastUpdatedFrom?: Date;
  updatedBy?: string;
}
