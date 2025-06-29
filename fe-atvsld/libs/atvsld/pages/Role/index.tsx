"use client";

import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/Header";
import CustomizedDataGrid, {
  ColumnConfig,
} from "@/libs/core/components/Table/CustomizedDataGrid";
import { useSearchParams } from "next/navigation";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { deleteRole, filterRoles, getRoles } from "../../services/api/roleApi";
import { QueryRoleRequest } from "@/libs/shared/atvsld/dto/request/role/queryRoleRequest";
import { Role } from "@/libs/shared/atvsld/models/role.model";
import RoleDetail from "./popup/role-detail";
import { handleGetPermissions } from "../../components/AuthFeature/handleAuthFeature";

interface RoleRow {
  id: string;
  roleCode: string;
  roleName: string;
}

export default function RolePage() {
  // get permissions from context
  const rolePermission = handleGetPermissions().rolePermission;
  const canView = rolePermission[0];
  const canCreate = rolePermission[1];
  const canUpdate = rolePermission[2];
  const canDelete = rolePermission[3];
  if (!canView && !canCreate && !canUpdate && !canDelete) {
    return (
      <div className="container w-full flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-gray-700">
          Bạn không có quyền truy cập vào trang này.
        </h1>
      </div>
    );
  }

  const query = useSearchParams();

  useEffect(() => {
    const createSuccess = query.get("create");
    if (createSuccess) {
      showAlert("Tạo mới vai trò thành công", "success");
    }
  }, []);

  useEffect(() => {
    const updateSuccess = query.get("update");
    if (updateSuccess) {
      showAlert("Cập nhật vai trò thành công", "success");
    }
  }, []);

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

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [dataRows, setDataRows] = React.useState<RoleRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // fetch data
  const fetchData = async () => {
    try {
      const response = await getRoles();

      if (!response.data) {
        throw new Error("No roles found");
      }

      const formattedRows: RoleRow[] = response.data.map((role) => ({
        id: role.id,
        roleCode: role.code,
        roleName: role.name,
      }));

      setDataRows(formattedRows);
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert("Lỗi khi tải dữ liệu", "error");
    }
  };

  useEffect(() => {
    fetchData();
    console.log("avalable roles:", roles);
  }, []);

  // filters
  const [filters, setFilters] = useState<Record<string, string>>({});
  const handleFilterChange = (field: string, value: string) => {
    console.log("Filter change: field:", field, " - value:", value);
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [field]: value };
      if (value === "") {
        delete newFilters[field];
      }

      const query: QueryRoleRequest = {
        code: newFilters["roleCode"],
        name: newFilters["roleName"],
      };

      applyFilters(query);

      return newFilters;
    });
  };

  const applyFilters = async (query: QueryRoleRequest) => {
    try {
      const response = await filterRoles(query);
      if (response.status != 200 || !response.data) {
        showAlert(response.message, "warning");
        return;
      }

      if (!response.data.data || response.data.data.length === 0) {
        showAlert("Không có dữ liệu phù hợp", "info");
        setDataRows([]);
        return;
      }

      const formattedRows: RoleRow[] = response.data.data.map((role) => ({
        id: role.id,
        roleCode: role.code,
        roleName: role.name,
      }));

      setDataRows(formattedRows);
    } catch (error) {
      console.error("Error applying filters:", error);
      showAlert("Lỗi khi áp dụng bộ lọc", "error");
    }
  };

  const ColumnConfig: ColumnConfig[] = [
    {
      field: "roleCode",
      headerName: "Mã Vai Trò",
      flex: 1,
      minWidth: 150,
      inputType: "text",
    },
    {
      field: "roleName",
      headerName: "Tên Vai Trò",
      flex: 1.5,
      minWidth: 150,
      inputType: "text",
    },
  ];

  const [selectedRows, setSelectedRows] = useState<RoleRow[]>([]);
  const handleRowSelection = useCallback((selectedData: RoleRow[]) => {
    setSelectedRows(selectedData);
    console.log("Selected rows:", selectedData);
  }, []);

  const handleDisplayUpdatePage = useCallback((row: RoleRow) => {
    setId(row.id);
    setOpenModal(true);
  }, []);

  const handleDisplayCreatePage = useCallback(() => {
    setOpenModal(true);
    setId("");
  }, []);

  // handle delete
  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          const response = await deleteRole(row.id);
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

  const handleRefreshData = () => {
    setOpenModal(false);
    fetchData();
    showAlert(
      id ? "Cập nhật vai trò thành công" : "Thêm mới vai trò thành công",
      "success"
    );
    setId("");
  };

  return (
    <div className="container w-full flex flex-col items-center justify-between h-full">
      <Header
        title="Danh Sách Vai Trò"
        creationPermission={canCreate}
        hasAddNew={true}
        onAddNewClick={handleDisplayCreatePage}
      />

      <div className="flex w-full h-full justify-between items-center px-2 pb-4">
        <CustomizedDataGrid
          rows={dataRows}
          columnsConfig={ColumnConfig}
          onRowSelectionChange={handleRowSelection}
          onFilterChange={handleFilterChange}
          filters={filters}
          hasEdit={canUpdate}
          hasDelete={canDelete}
          onEdit={handleDisplayUpdatePage}
          hasStatus={false}
          hasView={false}
          onDelete={handleDelete}
        />
      </div>

      {/* Role Detail Popup */}
      <RoleDetail
        openModal={openModal}
        selectedId={id}
        onClose={() => {
          setOpenModal(false);
          setId("");
        }}
        onSave={handleRefreshData}
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
