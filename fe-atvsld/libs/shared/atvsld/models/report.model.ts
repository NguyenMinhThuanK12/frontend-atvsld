import { ReportingPeriod } from "../../core/enums/reportingPeriod";
import { ReportType } from "../../core/enums/reportType";

export interface Report {
    id: string;
    reportName: ReportType | null;
    year: number;
    reportingPeriod: ReportingPeriod | null;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isOverdue: boolean;
}