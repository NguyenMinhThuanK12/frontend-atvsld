import { BusinessType } from "@/libs/shared/core/enums/businessType";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteBusiness,
  filterBusinesses,
  getBusinesses,
  updateBusinessStatus,
} from "../../services/api/businessApi";
import { districtOptions, getWardOptions } from "../../utils/fetchProvinceJson";
import wardsData from "@/public/json/wards.json";
import { businessTypeOptions } from "../../utils/fetchEnum";
import CustomizedDataGrid, {
  ColumnConfig,
} from "@/libs/core/components/Table/CustomizedDataGrid";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import Header from "../../components/Header";
import { QueryBusinessRequest } from "@/libs/shared/atvsld/dto/request/business/queryBussinessRequest";

interface BusinessRow {
  id: string;
  name: string;
  taxCode: string;
  businessType: string;
  mainBusinessField: string;
  district: string;
  ward: string;
  isActive: boolean;
}

export default function BusinessPage() {
  // notify
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  // show alert
  const showAlert = useCallback(
    (
      content: string,
      type: "success" | "error" | "warning" | "info",
      duration = 2000
    ) => {
      setAlert({ content, type });
      setTimeout(() => setAlert(null), duration);
    },
    []
  );

  // fetch databases
  const [dataRows, setDataRows] = useState<BusinessRow[]>([]);

  const fetchBusinesses = async () => {
    try {
      const response = await getBusinesses();
      const businesses = response.data;

      // map businesses to BusinessRow
      const mappedRows: BusinessRow[] = businesses.map((dept) => ({
        id: dept.id,
        name: dept.name,
        taxCode: dept.taxCode,
        businessType: dept.businessType,
        mainBusinessField: dept.mainBusinessField,
        district: dept.registrationDistrict,
        ward: dept.registrationWard,
        isActive: dept.isActive,
      }));

      setDataRows(mappedRows);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      showAlert("Có lỗi xảy ra khi tải danh sách doanh nghiệp.", "error");
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // get ward options in filters
  const [filters, setFilters] = useState<Record<string, string>>({});
  const wardOptions = useMemo(
    () => getWardOptions(filters["district"], districtOptions, wardsData),
    [filters["district"]]
  );

  const handleFilterChange = useCallback((field: string, value: string) => {
    console.log("Filter change: field:", field, " - value:", value);

    setFilters((prev) => {
      const updatedFilters = { ...prev, [field]: value };
      // Reset ward when district changes

      if (value === "Tất cả" || value === "") {
        delete updatedFilters[field];
      } else {
        updatedFilters[field] = value;
      }

      console.log("Updated filters:", updatedFilters);
      // Apply filters immediately
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  }, []);

  // apply filters to data rows
  const applyFilters = async (filters: Record<string, string>) => {
    try {
      const query: QueryBusinessRequest = {
        name: filters["name"] || undefined,
        taxCode: filters["taxCode"] || undefined,
        businessType: filters["businessType"] || undefined,
        mainBusinessField: filters["mainBusinessField"] || undefined,
        registrationDistrict: filters["district"] || undefined,
        registrationWard: filters["ward"] || undefined,
      };

      const response = await filterBusinesses(query);

      if (response.status !== 200 || !response.data?.data) {
        showAlert(
          "Không tìm thấy doanh nghiệp phù hợp với điều kiện lọc.",
          "error"
        );
        return;
      }

      const filteredBusinesses = response.data?.data;

      const mappedRows: BusinessRow[] = filteredBusinesses.map((dept) => ({
        id: dept.id,
        name: dept.name,
        taxCode: dept.taxCode,
        businessType: dept.businessType,
        mainBusinessField: dept.mainBusinessField,
        district: dept.registrationDistrict,
        ward: dept.registrationWard,
        isActive: dept.isActive,
      }));

      setDataRows(mappedRows);
    } catch (error) {
      console.error("Error filtering businesses:", error);
      showAlert("Có lỗi xảy ra khi lọc danh sách doanh nghiệp.", "error");
    }
  };

  // Columns for the table
  const columnsConfig: ColumnConfig[] = [
    {
      field: "name",
      headerName: "Tên Doanh Nghiệp",
      flex: 1.15,
      minWidth: 100,
      inputType: "text",
    },
    {
      field: "taxCode",
      headerName: "Mã Số Thuế",
      flex: 0.8,
      minWidth: 100,
      inputType: "text",
    },
    {
      field: "businessType",
      headerName: "Loại Hình Kinh Doanh",
      flex: 1.2,
      minWidth: 120,
      inputType: "select",
      options: businessTypeOptions || undefined,
    },
    {
      field: "mainBusinessField",
      headerName: "Ngành Nghề",
      minWidth: 100,
      flex: 1,
      inputType: "text",
    },
    {
      field: "district",
      headerName: "Quận/Huyện",
      minWidth: 100,
      flex: 1,
      inputType: "select",
      options: districtOptions || undefined,
    },
    {
      field: "ward",
      headerName: "Phường/Xã",
      minWidth: 100,
      flex: 1.1,
      inputType: "select",
      options: wardOptions || undefined,
    },
  ];

  // handle select rows
  const [selectedRows, setSelectedRows] = useState<BusinessRow[]>([]);
  const handleRowSelection = (selectedData: BusinessRow[]) => {
    setSelectedRows(selectedData);
    console.log("Selected rows data:", selectedData);
  };

  // handle change status UI
  const handleStatusChange = async (rowId: string, newStatus: boolean) => {
    try {
      const response = await updateBusinessStatus(rowId, newStatus);
      if (response.status !== 200 || !response.data) {
        showAlert(
          `Không thể cập nhật trạng thái cho doanh nghiệp với ID: ${rowId}`,
          "error"
        );
        throw new Error(
          `Failed to update status for business with ID: ${rowId}`
        );
      }

      const updatedStatus = response.data.isActive;

      setDataRows((prevRows) =>
        prevRows.map((row) =>
          row.id === rowId ? { ...row, isActive: updatedStatus } : row
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      showAlert("Có lỗi xảy ra khi cập nhật trạng thái.", "error");
    }
  };

  const router = useRouter();

  const handleView = (row: BusinessRow) => {
    router.push(`/dashboard/businesses/${row.id}`);
  };

  const handleDisplayUpdatePage = (row: BusinessRow) => {
    router.push(`/dashboard/businesses/${row.id}?mode=update`);
  };

  const handleDisplayCreationPage = () => {
    router.push(`/dashboard/businesses/new?mode=create`);
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          const response = await deleteBusiness(row.id);
          if (response.status !== 200) {
            showAlert(`Không thể xóa đơn vị với ID: ${row.id}`, "error");
            throw new Error(`Failed to delete department with ID: ${row.id}`);
          }
        })
      );

      showAlert("Xóa doanh nghiệp thành công.", "success");

      setDataRows((prevRows) =>
        prevRows.filter((r) => !selectedRows.some((sr) => sr.id === r.id))
      );
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting departments:", error);
      showAlert("Có lỗi xảy ra khi xóa đơn vị.", "error");
    }
  };

  // show alert when declaration is successful
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("declaration") === "success") {
      showAlert("Khai báo thành công.", "success");
    }
  }, [searchParams, showAlert]);

  return (
    <div className="container w-full flex flex-col items-center justify-between h-full">
      <Header
        onAddNewClick={handleDisplayCreationPage}
        onUploadClick={() => {}}
        onExportClick={() => {}}
        title="Danh Sách Doanh Nghiệp"
        creationPermission={true}
        hasImport={true}
        hasExport={true}
        hasAddNew={true}
      />

      <CustomizedDataGrid
        rows={dataRows}
        columnsConfig={columnsConfig}
        onRowSelectionChange={handleRowSelection}
        onStatusChange={handleStatusChange}
        onView={handleView}
        onEdit={handleDisplayUpdatePage}
        onDelete={handleDelete}
        onFilterChange={handleFilterChange}
        filters={filters}
      />

      {/* Alert */}
      {alert && (
        <Alert
          content={alert.content}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
