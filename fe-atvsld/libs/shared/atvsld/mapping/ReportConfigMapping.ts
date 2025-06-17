import { CreationReportConfigRequest } from '../dto/request/report-configuration/creationReportConfigRequest';
import { ReportConfigResponse } from '../dto/response/report-configuration/ReportCongiResponse';
import { Report } from '../models/report.model';
import { ReportType } from '../../core/enums/reportType';
import { ReportingPeriod } from '../../core/enums/reportingPeriod';
import { UpdateReportConfigRequest } from '../dto/request/report-configuration/updateReportConfigRequest';
import { QueryReportConfigRequest } from '../dto/request/report-configuration/queryReportConfigRequest';
import { ReportConfigurationRow } from '@/libs/atvsld/pages/Report-configuration';
import { formatDate } from '@/libs/atvsld/utils/commonFunction';
import {
  ReportingPeriodOptions,
  ReportTypeOptions,
} from '@/libs/atvsld/utils/fetchEnum';

export const convertToReportConfigRow = (
  reports: Report[]
): ReportConfigurationRow[] => {
  const rows = reports.map((report) => ({
    id: report.id,
    year: report.year.toString(),
    reportType: report.reportName ?? ReportTypeOptions[0].value,
    reportingPeriod: report.reportingPeriod ?? ReportingPeriodOptions[0].value,
    create_date: formatDate(report.startDate),
    finish_date: formatDate(report.endDate),
    isActive: report.isActive,
  }));
  return rows;
};

export const mappingReportConfigResponseToReport = (
  response: ReportConfigResponse
): Report => {
  return {
    id: response.id,
    reportName: response.reportName,
    year: response.year,
    reportingPeriod: response.period,
    startDate: new Date(response.startDate),
    endDate: new Date(response.endDate),
    isActive: response.isActive,
    isOverdue: response.isOverdue,
  };
};

export const mappingReportToCreationReportConfigRequest = (
  report: Report
): CreationReportConfigRequest => {
  return {
    reportName: report.reportName ?? ReportType.SANITATION,
    year: report.year,
    period: report.reportingPeriod ?? ReportingPeriod.ALL_YEAR,
    startDate: report.startDate,
    endDate: report.endDate,
  };
};

export const mappingReportToUpdateReportConfigRequest = (
  report: Report
): UpdateReportConfigRequest => {
  return {
    startDate: report.startDate,
    endDate: report.endDate,
    isActive: report.isActive,
  };
};

export const mappingFiltersToQueryReportConfigRequest = (
  filters: Record<string, string>
): QueryReportConfigRequest => {
  const startDate = filters['create_date']
    ? new Date(filters['create_date'])
    : undefined;
  const endDate = filters['finish_date']
    ? new Date(filters['finish_date'])
    : undefined;

  // Validate dates to avoid Invalid Date
  const validStartDate =
    startDate && !isNaN(startDate.getTime()) ? startDate : undefined;
  const validEndDate =
    endDate && !isNaN(endDate.getTime()) ? endDate : undefined;

  return {
    reportName: filters['reportType'] as ReportType,
    year: filters['year'],
    period: filters['reportingPeriod'] as ReportingPeriod,
    startDate: validStartDate,
    endDate: validEndDate,
    isActive: filters['isActive'],
  };
};
