import { Report } from "@/libs/shared/atvsld/models/report.model";
import {
  checkDuplicateYear,
  createReportConfiguration,
  filterReportConfigurations,
  getAll,
  getById,
  toggleActiveStatus,
  updateReportConfiguration,
} from "../../services/api/reportConfigurationApi";
import {
  mappingFiltersToQueryReportConfigRequest,
  mappingReportConfigResponseToReport,
  mappingReportToCreationReportConfigRequest,
  mappingReportToUpdateReportConfigRequest,
} from "@/libs/shared/atvsld/mapping/ReportConfigMapping";

export const defaultReport: Report = {
  id: "",
  reportName: null,
  year: new Date().getFullYear(),
  reportingPeriod: null,
  startDate: new Date(),
  endDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  })(),
  isActive: true,
  isOverdue: false,
};

export const getReportConfigurationsFeature = async (
  filters?: Record<string, string>
): Promise<Report[]> => {
  try {
    const response = await getAll();
    if (!response.data || response.status !== 200) {
      throw new Error(
        response.message || "Failed to fetch report configurations"
      );
    }

    console.log("Fetched report configurations:", response.data.data);

    const data: Report[] = response.data.data.map((report) =>
      mappingReportConfigResponseToReport(report)
    );

    return data;
  } catch (error) {
    console.error("Error fetching report configurations:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const getReportConfigurationByIdFeature = async (
  id: string
): Promise<Report> => {
  try {
    const response = await getById(id);
    if (!response.data || response.status !== 200) {
      throw new Error(
        response.message || "No report configuration found with the given ID"
      );
    }

    return mappingReportConfigResponseToReport(response.data);
  } catch (error) {
    console.error("Error fetching report configuration by ID:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const createReportConfigurationFeature = async (
  report: Report
): Promise<Report> => {
  const request = mappingReportToCreationReportConfigRequest(report);
  try {
    const response = await createReportConfiguration(request);
    if (!response.data || response.status !== 201) {
      throw new Error(
        response.message || "Failed to create report configuration"
      );
    }
    console.log("Report configuration created successfully:", response.data);

    return mappingReportConfigResponseToReport(response.data);
  } catch (error) {
    console.error("Error creating report configuration:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const updateReportConfigurationFeature = async (
  report: Report
): Promise<Report> => {
  const request = mappingReportToUpdateReportConfigRequest(report);
  try {
    const response = await updateReportConfiguration(report.id, request);
    if (!response.data || response.status !== 200) {
      throw new Error(
        response.message || "Failed to update report configuration"
      );
    }

    return mappingReportConfigResponseToReport(response.data);
  } catch (error) {
    console.error("Error updating report configuration:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const toggleActiveStatusFeature = async (
  id: string
): Promise<Boolean> => {
  try {
    const response = await toggleActiveStatus(id);
    if (!response || response.status !== 200) {
      throw new Error(response.message || "Failed to toggle active status");
    }

    return !!response;
  } catch (error) {
    console.error("Error toggling active status:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const filterReportConfigurationsFeature = async (
  filters: Record<string, string>
): Promise<Report[]> => {
  const request = mappingFiltersToQueryReportConfigRequest(filters);
  try {
    const response = await filterReportConfigurations(request);
    if (!response.data || response.status !== 200) {
      throw new Error(
        response.message || "Failed to fetch report configurations with filters"
      );
    }

    const data: Report[] = response.data.data.map((report) =>
      mappingReportConfigResponseToReport(report)
    );

    return data;
  } catch (error) {
    console.error("Error fetching filtered report configurations:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const checkDuplicateYearFeature = async (
  reportName: string,
  year: string,
  excludeId?: string
): Promise<boolean> => {
  try {
    const response = await checkDuplicateYear(reportName, year, excludeId);
    if (!response.data || response.status !== 200) {
      throw new Error(
        response.message || "Failed to check duplicate report configuration"
      );
    }
    console.log("Duplicate check response:", response.data.isDuplicate);
    
    return response.data.isDuplicate;
  } catch (error) {
    console.error("Error checking duplicate report configuration:", error);
    throw error; // Re-throw the error for further handling
  }
}; // Ensure to re-throw the error for further handling
