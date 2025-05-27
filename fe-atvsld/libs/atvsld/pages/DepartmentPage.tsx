"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import CustomizedDataGrid from "@/libs/core/components/Table/CustomizedDataGrid";
import type { ColumnConfig } from "@/libs/core/components/Table/CustomizedDataGrid";
import districtsData from "@/public/json/districts.json";
import wardsData from "@/public/json/wards.json";
import { BusinessType } from "@/libs/shared/core/enums/businessType";
import {
  deleteDepartment,
  getDepartments,
} from "../services/api/departmentApi";
import { Department } from "@/libs/shared/atvsld/models/department.model";
import ReviewSubmit from "../components/CreationAndUpdatePopup/ReviewSubmit";
import { X } from "lucide-react";
import OverallPopup from "../components/CreationAndUpdatePopup/OverallPopup";
import { district } from "@/libs/core/models/district";
import { Ward } from "@/libs/core/models/ward";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import Header from "../components/Header";

interface DepartmentRow {
  id: string;
  name: string;
  taxCode: string;
  businessType: string;
  sector: string;
  district: string;
  ward: string;
  isActive: boolean;
}

const businessTypeOptions = Object.keys(BusinessType).map((key) => ({
  key: key,
  value: BusinessType[key as keyof typeof BusinessType],
}));

// Process districts for "Thành phố Hồ Chí Minh" (code: "79")
const districtOptions = districtsData
  .filter((district: district) => district.parent_code === "79")
  .map((district: district) => ({
    key: district.code,
    value: district.name_with_type,
  }));

export default function DepartmentPage() {
  const [selectedRows, setSelectedRows] = useState<DepartmentRow[]>([]);
  const [dataRows, setDataRows] = useState<DepartmentRow[]>([]); // display departments on table
  const [departments, setDepartments] = useState<Department[]>([]); // all fields of a department
  const [viewedDepartment, setViewedDepartment] = useState<Department | null>(
    null
  );
  const [editedDepartment, setEditedDepartment] = useState<Department | null>(
    null
  );
  const [creationDepartment, setCreationDepartment] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
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

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      const departments = response.data;

      setDepartments(departments);

      // map departments to the DepartmentRow
      const mappedRows: DepartmentRow[] = departments.map((dept) => ({
        id: String(dept.id), // Convert number to string
        name: dept.name,
        taxCode: dept.taxCode,
        businessType:
          BusinessType[
            dept.businessType as unknown as keyof typeof BusinessType
          ] || dept.businessType, // Enum value to string
        sector: dept.mainBusinessField,
        district: dept.registrationDistrict,
        ward: dept.registrationWard,
        isActive: dept.isActive,
      }));

      setDataRows(mappedRows);
    } catch (error) {
      console.error("Error fetching departments:", error);
      showAlert("Có lỗi xảy ra khi tải danh sách đơn vị.", "error");
    }
  };

  // get departments list
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Process wards based on selected district
  const wardOptions = useMemo(() => {
    const districtValue = filters["district"];

    const districtCode = districtOptions.find(
      (d) => d.value === districtValue
    )?.key;

    if (!districtCode) {
      return [{ key: "", value: "Chọn quận/huyện trước" }];
    }

    const wards = wardsData
      .filter((ward: Ward) => ward.parent_code === districtCode)
      .map((ward: Ward) => ({
        key: ward.code,
        value: ward.name_with_type,
      }));

    return wards;
  }, [filters["district"]]);

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
      options: businessTypeOptions,
    },
    {
      field: "sector",
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
      options: districtOptions,
    },
    {
      field: "ward",
      headerName: "Phường/Xã",
      minWidth: 100,
      flex: 1.1,
      inputType: "select",
      options: wardOptions,
    },
  ];

  const handleRowSelection = (selectedData: DepartmentRow[]) => {
    setSelectedRows(selectedData);
    console.log("Selected rows data:", selectedData);
  };

  const handleStatusChange = (rowId: string, newStatus: boolean) => {
    setDataRows((prevRows) =>
      prevRows.map((row) =>
        String(row.id) === rowId ? { ...row, isActive: newStatus } : row
      )
    );
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    if (field === "district") {
      setFilters((prev) => ({ ...prev, ward: "" })); // Reset ward filter when district changes
    }
  };

  // handle view department
  const handleViewDepartmentDetail = (row: DepartmentRow) => {
    const currId = row.id;
    const selectedDepartment = departments.find(
      (department) => String(department.id) === currId
    );
    if (selectedDepartment) {
      setViewedDepartment(selectedDepartment);
    } else {
      showAlert("Không thể xem thông tin đơn vị.", "error");
    }
  };

  const handleDisplayEditableDepartment = (row: DepartmentRow) => {
    const currId = row.id;
    const selectedDepartment = departments.find(
      (department) => String(department.id) === currId
    );
    if (selectedDepartment) {
      setEditedDepartment(selectedDepartment);
      console.log("Selected department for editing:", selectedDepartment);
    } else {
      showAlert("Không thể xem thông tin đơn vị.", "error");
    }
  };

  // handle delete selected department
  const handleDeleteDepartment = async () => {
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          const response = await deleteDepartment(Number(row.id));
          if (response.status !== 200) {
            throw new Error(`Failed to delete department with ID: ${row.id}`);
          }
        })
      );

      showAlert("Xóa đơn vị thành công.", "success");
      console.log("Deleted departments:", selectedRows);

      setDataRows((prevRows) =>
        prevRows.filter((r) => !selectedRows.some((sr) => sr.id === r.id))
      );
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting departments:", error);
      showAlert("Có lỗi xảy ra khi xóa đơn vị.", "error");
    }
  };

  return (
    <div className="container w-full flex flex-col items-center justify-between h-full">
      <Header
        onAddNewClick={() => setCreationDepartment(true)}
        onUploadClick={() => {}}
        onExportClick={() => {}}
      />

      <CustomizedDataGrid
        rows={dataRows}
        columnsConfig={columnsConfig}
        onRowSelectionChange={handleRowSelection}
        onStatusChange={handleStatusChange}
        onView={handleViewDepartmentDetail}
        onEdit={handleDisplayEditableDepartment}
        onDelete={handleDeleteDepartment}
        onFilterChange={handleFilterChange}
        filters={filters}
      />
      {/* view a department */}
      {viewedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[85vw] max-h-[90vh] relative overflow-hidden bg-white rounded-lg shadow-md py-4 px-8 flex flex-col items-center justify-between z-50">
            <div className="flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer absolute top-2 right-2">
              <X
                className="text-2xl text-black"
                onClick={() => setViewedDepartment(null)}
              />
            </div>

            <ReviewSubmit
              formData={viewedDepartment}
              setFormData={setViewedDepartment}
            />
          </div>
        </div>
      )}

      {/* Edit row department */}
      {editedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <OverallPopup
            onClose={() => setEditedDepartment(null)}
            mode={"edit"}
            initialFormData={editedDepartment}
            onRefresh={fetchDepartments}
          />
        </div>
      )}

      {/* Create new department */}
      {creationDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <OverallPopup
            onClose={() => setCreationDepartment(false)}
            mode={"create"}
            initialFormData={null}
            onRefresh={fetchDepartments}
          />
        </div>
      )}

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
