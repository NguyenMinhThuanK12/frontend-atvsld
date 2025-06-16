"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { ReportType } from "@/libs/shared/core/enums/reportType";
import { ReportingPeriod } from "@/libs/shared/core/enums/reportingPeriod";
import {
  ReportingPeriodOptions,
  ReportTypeOptions,
} from "../../utils/fetchEnum";
import CustomizedDataGrid, {
  ColumnConfig,
} from "@/libs/core/components/Table/CustomizedDataGrid";
import ReportConfigDetail from "./popup/report-detail";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import {
  filterReportConfigurationsFeature,
  getReportConfigurationsFeature,
  toggleActiveStatusFeature,
} from "../../components/ReportFeature/handleReportFeature";
import { formatDate } from "../../utils/commonFunction";
import { convertToReportConfigRow } from "@/libs/shared/atvsld/mapping/ReportConfigMapping";

export interface ReportConfigurationRow {
  id: string;
  year: string;
  reportType: ReportType;
  reportingPeriod: ReportingPeriod;
  create_date: string;
  finish_date: string;
  isActive: boolean;
}

const columnsConfig: ColumnConfig[] = [
  {
    field: "year",
    headerName: "Năm báo cáo",
    flex: 1,
    minWidth: 100,
    inputType: "text",
  },
  {
    field: "reportType",
    headerName: "Năm báo cáo",
    flex: 1,
    minWidth: 100,
    inputType: "select",
    options: [{ value: "all", label: "Tất cả" }, ...ReportTypeOptions],
  },
  {
    field: "reportingPeriod",
    headerName: "Kỳ báo cáo",
    flex: 1,
    minWidth: 100,
    inputType: "select",
    options: [{ value: "all", label: "Tất cả" }, ...ReportingPeriodOptions],
  },
  {
    field: "create_date",
    headerName: "Thời gian bắt đầu",
    flex: 1,
    minWidth: 100,
    inputType: "date",
  },
  {
    field: "finish_date",
    headerName: "Thời gian kết thúc",
    flex: 1,
    minWidth: 100,
    inputType: "date",
  },
];

export default function ReportConfigurationPage() {
  // data rows send to CustomizedDataGrid
  const [dataRows, setDataRows] = useState<ReportConfigurationRow[]>([]);
  // Popup modal for creating or editing user
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string>("");

  // notify
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "info" | "warning";
    duration: number;
  } | null>(null);

  const showAlert = (
    content: string,
    type: "success" | "error" | "info" | "warning",
    duration: number = 2000 // default 2 seconds
  ) => {
    setAlert({ content, type, duration });
    setTimeout(() => {
      setAlert(null);
    }, duration);
  };

  // get all
  const getReportConfigs = async () => {
    try {
      const response = await getReportConfigurationsFeature();
      if (!response || response.length === 0) {
        console.log("Không có dữ liệu báo cáo", "info");
        return;
      }

      const formattedRows: ReportConfigurationRow[] =
        convertToReportConfigRow(response);

      console.log("Fetched report configurations:", formattedRows);

      setDataRows(formattedRows);
    } catch (error) {
      console.log("Error fetching report configurations:", error);
      showAlert(
        error instanceof Error ? error.message : "Lỗi không xác định",
        "error"
      );
    }
  };

  useEffect(() => {
    getReportConfigs();
  }, []);

  const [filters, setFilters] = useState<Record<string, string>>({});
  const handleFilterChange = (field: string, value: string) => {
    if (value === "all" || value === "") {
      delete filters[field];
      setFilters({ ...filters });
      return;
    }

    setFilters({ ...filters, [field]: value });
  };

  const applyFilters = async () => {
    try {
      const filteredUsers = await filterReportConfigurationsFeature(filters);
      if (filteredUsers) {
        const rows: ReportConfigurationRow[] =
          convertToReportConfigRow(filteredUsers);
        setDataRows(rows);
        if (rows.length === 0) {
          showAlert(
            "Không tìm thấy người dùng phù hợp với điều kiện lọc.",
            "warning",
            2000
          );
        }
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      showAlert("Có lỗi xảy ra khi áp dụng bộ lọc.", "error");
    }
  };

  useEffect(() => {
    console.log("Filters changed:", filters);

    applyFilters();
  }, [filters]);

  const handleToggleActive = async (rowId: string, newStatus: boolean) => {
    try {
      const response = await toggleActiveStatusFeature(rowId);
      if (!response) {
        showAlert("Không thể cập nhật trạng thái", "error");
        return;
      }
      showAlert(
        `Trạng thái đã được ${response ? "kích hoạt" : "vô hiệu hóa"}`,
        "success"
      );
      getReportConfigs();
    } catch (error) {
      console.error("Error toggling active status:", error);
      showAlert(
        error instanceof Error ? error.message : "Lỗi không xác định",
        "error"
      );
    }
  };

  const handleDisplayCreationPopup = () => {
    setOpenModal(true);
    setId("");
  };

  const handleDisplayEditPopup = (row: ReportConfigurationRow) => {
    setOpenModal(true);
    setId(row.id);
  };

  const handleRefreshData = () => {
    setOpenModal(false);

    getReportConfigs();
    id
      ? showAlert("Cập nhật thành công", "success")
      : showAlert("Tạo mới thành công", "success");
    setId("");
  };

  return (
    <div className="container w-full flex flex-col items-center justify-between h-full">
      <Header
        title="Danh sách cấu hình báo cáo"
        creationPermission={true}
        onAddNewClick={handleDisplayCreationPopup}
      />

      <div className="w-full h-full flex items-center justify-between pb-4">
        <CustomizedDataGrid
          rows={dataRows}
          columnsConfig={columnsConfig}
          filters={filters}
          onFilterChange={handleFilterChange}
          hasDelete={false}
          hasView={false}
          onEdit={handleDisplayEditPopup}
          onStatusChange={handleToggleActive}
        />
      </div>

      <ReportConfigDetail
        openModal={openModal}
        onClose={() => {
          setOpenModal(false);
          setId("");
        }}
        onSave={handleRefreshData}
        selectedId={id}
      />

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
