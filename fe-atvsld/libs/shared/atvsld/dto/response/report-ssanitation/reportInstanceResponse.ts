import { ReportingPeriod } from "@/libs/shared/core/enums/reportingPeriod";
import { ReportStatus } from "@/libs/shared/core/enums/reportStatus";

export interface ReportInstanceResponse {
  id: string;
  status: ReportStatus;
  businessName: string;
  year: string;
  startDate: Date;
  endDate: Date;
  period: ReportingPeriod;
  lastUpdatedDate: Date | null;
  lastUpdatedBy: string | null;
  isOverdue: boolean;
}
