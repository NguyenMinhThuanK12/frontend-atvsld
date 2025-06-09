import React, { useCallback, useEffect, useMemo, useState } from "react";
import { businessTypeOptions } from "../../utils/fetchEnum";
import CustomizedDataGrid, {
  ColumnConfig,
} from "@/libs/core/components/Table/CustomizedDataGrid";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import Header from "../../components/Header";
import {
  applyFilters,
  fetchBusinesses,
  handleDeleteBusinesses,
  handleStatusChange,
} from "../../components/BusinessFeature/handleBusinessFeatures";
import {
  newDistrictOptions,
  newWardOptions,
} from "../../utils/fetchProvinceJson";
import { get } from "lodash";
import { handleGetPermissions } from "../../components/AuthFeature/handleAuthFeature";

export interface BusinessRow {
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
  // get permissions from context
  const businessPermission = handleGetPermissions().businessPermission;
  const canView = businessPermission[0];
  const canCreate = businessPermission[1];
  const canUpdate = businessPermission[2];
  const canDelete = businessPermission[3];

  console.log("Business Permissions:", {
    canView,
  canCreate,
    canUpdate,
    canDelete,
  });
  if (!canView && !canCreate && !canUpdate && !canDelete) {
    return (
      <div className="container w-full flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-gray-700">
          Bạn không có quyền truy cập vào trang này.
        </h1>
      </div>
    );
  }

  const router = useRouter();
  const searchParams = useSearchParams();
  const [dataRows, setDataRows] = useState<BusinessRow[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<BusinessRow[]>([]);

  const districtOptions = [
    { value: "", label: "Tất cả" },
    ...newDistrictOptions,
  ];
  const wardOptions = useMemo(
    () => [{ value: "", label: "Tất cả" }, ...newWardOptions(selectedDistrict)],
    [selectedDistrict]
  );

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
      options: [{ value: "", label: "Tất cả" }, ...businessTypeOptions],
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

  // Notify
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
    duration?: number;
  } | null>(null);

  const showAlert = (
    content: string,
    type: "success" | "error" | "warning" | "info",
    duration = 2000
  ) => setAlert({ content, type, duration });

  // fetch databases
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const businesses = await fetchBusinesses();
      if (isMounted && businesses) {
        // mapping BusinessResponse to BusinessRow
        const mappedRows: BusinessRow[] = businesses.map((dept) => ({
          id: dept.id,
          name: dept.name,
          taxCode: dept.taxCode,
          businessType: dept.businessType ? String(dept.businessType) : "",
          mainBusinessField: dept.mainBusinessField,
          district: dept.registrationDistrict,
          ward: dept.registrationWard,
          isActive: dept.isActive,
        }));

        setDataRows(mappedRows);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // filter
  const handleFilterChange = useCallback(
    async (field: string, value: string) => {
      // Compute updated filters
      const updatedFilters = { ...filters };
      if (value === "") {
        delete updatedFilters[field];
      } else {
        updatedFilters[field] = value;
      }
      setFilters(updatedFilters);
      field === "district" && setSelectedDistrict(value); // Update selected district when filtering by district

      // Fetch filtered businesses
      const filteredBusinesses = await applyFilters(updatedFilters);

      // Map BusinessResponse to BusinessRow
      const mappedRows: BusinessRow[] =
        filteredBusinesses?.map((dept: any) => ({
          id: dept.id,
          name: dept.name,
          taxCode: dept.taxCode,
          businessType: dept.businessType ? String(dept.businessType) : "",
          mainBusinessField: dept.mainBusinessField,
          district: dept.registrationDistrict,
          ward: dept.registrationWard,
          isActive: dept.isActive,
        })) ?? [];

      if (filteredBusinesses && mappedRows.length === 0) {
        showAlert(
          "Không tìm thấy doanh nghiệp phù hợp với điều kiện lọc.",
          "warning",
          5000
        );
      }

      setDataRows(mappedRows);
    },
    [filters]
  );

  // handle change status UI
  const handleInactivate = async (rowId: string, newStatus: boolean) => {
    const updatedStatus = await handleStatusChange(rowId, newStatus);

    setDataRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, isActive: Boolean(updatedStatus) } : row
      )
    );
  };

  const handleDisplayViewPage = (row: BusinessRow) => {
    router.push(`/dashboard/businesses/view?id=${row.id}`);
  };

  const handleDisplayUpdatePage = (row: BusinessRow) => {
    router.push(`/dashboard/businesses/update?id=${row.id}`);
  };

  const handleDisplayCreationPage = () => {
    router.push(`/dashboard/businesses/create`);
  };

  const handleDelete = async () => {
    try {
      const deleted = await handleDeleteBusinesses(selectedRows);

      if (!deleted) {
        showAlert("Không thể xóa doanh nghiệp đã chọn.", "error");
        return;
      }

      setSelectedRows([]);
      router.push("/dashboard/businesses?deletion=success");
    } catch (error) {
      console.error("Error deleting departments:", error);
      showAlert("Có lỗi xảy ra khi xóa đơn vị.", "error");
    }
  };

  // show alert when declaration is successful
  useEffect(() => {
    const declaration = searchParams.get("declaration");
    const deletion = searchParams.get("deletion");
    if (declaration === "success") {
      showAlert("Khai báo thành công.", "success");
    } else if (deletion === "success") {
      showAlert("Xóa doanh nghiệp thành công.", "success");
    }
  }, [searchParams]);

  return (
    <div className="container w-full flex flex-col items-center justify-between h-full">
      <Header
        title="Danh Sách Doanh Nghiệp"
        onAddNewClick={handleDisplayCreationPage}
        // creationPermission={createPermission}
        creationPermission={canCreate}
        hasImport={true}
        hasExport={true}
        hasAddNew={true}
      />

      <CustomizedDataGrid
        rows={dataRows}
        columnsConfig={columnsConfig}
        onRowSelectionChange={(selectedData: BusinessRow[]) =>
          setSelectedRows(selectedData)
        }
        onStatusChange={handleInactivate}
        onView={handleDisplayViewPage}
        onEdit={handleDisplayUpdatePage}
        onDelete={handleDelete}
        onFilterChange={handleFilterChange}
        filters={filters}
        hasStatus={true}
        hasView={canView}
        hasEdit={canUpdate}
        hasDelete={true}
        // hasView={viewPermission}
        // hasEdit={updatePermission}
        // hasDelete={deletePermission}
      />

      {/* Alert */}
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
