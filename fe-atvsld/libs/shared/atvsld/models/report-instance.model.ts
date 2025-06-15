import { ReportingPeriod } from "../../core/enums/reportingPeriod";
import { ReportStatus } from "../../core/enums/reportStatus";

export interface ReportInstance{
  id: string;
  status: ReportStatus | null;

  businessName: string;
  year: string;

  startDate: Date | null;
  endDate: Date | null;
  period: ReportingPeriod | null;

  lastUpdatedDate: Date | null;
  lastUpdatedBy: string | null;
}
