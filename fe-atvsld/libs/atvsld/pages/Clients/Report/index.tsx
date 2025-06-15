"use client";

import { getActiveYearsFeature, getReportInstanceFeature } from "@/libs/atvsld/components/Client/Report-ATVSLD/handleReportFeature";
import Header from "@/libs/atvsld/components/Header";
import {
  ReportingPeriodOptions,
  ReportStatusOptions,
} from "@/libs/atvsld/utils/fetchEnum";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import CustomizedDataGrid, {
  ColumnConfig,
} from "@/libs/core/components/Table/CustomizedDataGrid";
import { ReportInstanceResponse } from "@/libs/shared/atvsld/dto/response/report-ssanitation/reportInstanceResponse";
import { convertToReportSanitationRow } from "@/libs/shared/atvsld/mapping/ReportInstanceMapping";
import { ReportingPeriod } from "@/libs/shared/core/enums/reportingPeriod";
import React, { useEffect, useState } from "react";

export interface ReportSanitationRow {
  id: string;
  businessName: string;
  startDate: string;
  endDate: string;
  reportingPeriod: ReportingPeriod;
  updatedDate: string;
  updateBy: string;
  status: string;
}

const columnsConfig: ColumnConfig[] = [
  {
    field: "status",
    headerName: "Trạng thái",
    flex: 1,
    minWidth: 150,
    // inputType: "select",
    // options: [{ value: "all", label: "Tất cả" }, ...ReportStatusOptions],
  },
  {
    field: "businessName",
    headerName: "Tên doanh nghiệp",
    flex: 1,
    minWidth: 150,
    // inputType: "text",
  },
  {
    field: "startDate",
    headerName: "Ngày bắt đầu",
    flex: 1,
    minWidth: 150,
    // inputType: "date",
  },
  {
    field: "endDate",
    headerName: "Ngày kết thúc",
    flex: 1,
    minWidth: 150,
    // inputType: "date",
  },
  {
    field: "reportingPeriod",
    headerName: "Kỳ báo cáo",
    flex: 0.8,
    minWidth: 120,
    // inputType: "select",
    // options: [{ value: "all", label: "Tất cả" }, ...ReportingPeriodOptions],
  },
  {
    field: "updatedDate",
    headerName: "Ngày cập nhật",
    flex: 1,
    minWidth: 150,
    // inputType: "date",
  },
  {
    field: "updateBy",
    headerName: "Người cập nhật",
    flex: 1,
    minWidth: 150,
    // inputType: "text",
  },
];

export default function ReportSanitationPage() {
  const [dataRows, setDataRows] = useState<ReportSanitationRow[]>([]);
  const [yearOptions, setYearOptions] = useState<
    { value: string; label: string }[]
    >([]);
  const [hasView, setHasView] = useState<boolean>(false);
  const [hasUpdate, setHasUpdate] = useState<boolean>(false);

  // notify
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "info" | "warning";
    duration?: number;
  } | null>(null);

  const showAlert = (
    content: string,
    type: "success" | "error" | "info" | "warning",
    duration: number = 2000
  ) => {
    setAlert({ content, type, duration });
    setTimeout(() => setAlert(null), duration);
  }

  const getAll = async () => {
    try {
      const response = await getReportInstanceFeature();
      if (!response || response.length === 0) {
        console.error("No report configurations found");
        return;
      }
      const rows = convertToReportSanitationRow(response);

      setDataRows(rows);
    } catch (error) {
      console.error("Error fetching report sanitation data:", error);
      showAlert(
        error instanceof Error ? error.message : String(error),
        "error"
      );
    }
  };

  const getActiveYears = async () => {
    try {
      const response = await getActiveYearsFeature();

      const options = response.map((year) => ({
        value: year.toString(),
        label: year.toString(),
      }));

      setYearOptions(options);
    } catch (error) {
      console.error("Error fetching active years:", error);
      showAlert(
        error instanceof Error ? error.message : String(error),
        "error"
      );
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getActiveYears();
      await getAll();
    };
    fetchData();
  }, []);

  const [filters, setFilters] = useState<Record<string, string>>({});
  const handleFilterChange = (field: string, value: string) => {
    if (value === "all"  || value === "") {
      delete filters[field];
      setFilters({ ...filters });
      return;
    }

    setFilters({ ...filters, [field]: value });
  };

  const applyFilters = async () => {
    console.log("Applying filters:", filters);

    try {
      const response = await getReportInstanceFeature(filters);
      if (response) {
        const rows = convertToReportSanitationRow(response);
        setDataRows(rows);
        console.log("Filtered rows:", rows);

        if (rows.length === 0) {
          showAlert(
            "Không tìm thấy người dùng phù hợp với điều kiện lọc.",
            "info",
            2000
          );
        }
      }
    } catch (error) {
      console.error("Error fetching filtered report sanitation data:", error);
      showAlert(
        error instanceof Error ? error.message : String(error),
        "error"
      );
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between gap-4">
      <Header
        title="Danh sách báo cáo ATVSLD"
        creationPermission={false}
        hasSelectBox={true}
        selectOptions={yearOptions}
        selectedValue={filters["year"]}
        onSelectChange={handleFilterChange}
      />

      <div className="w-full h-full flex items-center justify-between pb-4">
        <CustomizedDataGrid
          rows={dataRows}
          columnsConfig={columnsConfig}
          filters={filters}
          onFilterChange={handleFilterChange}
          hasStatus={false}
          hasDelete={false}
        />
      </div>

      {alert && (
        <Alert
          content={alert.content}
          type={alert.type}
          duration={alert.duration}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
