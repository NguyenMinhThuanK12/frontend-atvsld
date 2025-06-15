"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import CustomizedDataGrid, {
  ColumnConfig,
} from "@/libs/core/components/Table/CustomizedDataGrid";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { UserType } from "@/libs/shared/core/enums/userType";
import UserDetail from "./popup/user-detail";
import { fetchBusinesses } from "../../components/BusinessFeature/handleBusinessFeatures";
import { fetchRoles } from "../../components/RoleFeature/handleRoleFeatures";
import { userTypeOptions } from "../../utils/fetchEnum";

import {
  deleteUserFeature,
  filterUsersFeature,
  getAllUsersFeature,
  resetUserPasswordFeature,
  toggleUserStatusFeature,
} from "../../components/UserFeature/handleUserFeatures";
import { HandleGetLabelByValue } from "../../utils/commonFunction";
import { User } from "@/libs/shared/atvsld/models/user.model";
import { handleGetPermissions } from "../../components/AuthFeature/handleAuthFeature";

export interface UserRow {
  id: string;
  fullName: string;
  username: string;
  userType: UserType | null;
  businessId: string | null;
  roleId: string | null;
  jobTitle: string;
  isActive: boolean;
}

export default function UserPage() {
  // get permissions from context
  const userPermission = handleGetPermissions().userPermission;
    const canView = userPermission[0];
    const canCreate = userPermission[1];
    const canUpdate = userPermission[2];
    const canDelete = userPermission[3];
    if (!canView && !canCreate && !canUpdate && !canDelete) {
      return (
        <div className="container w-full flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold text-gray-700">
            Bạn không có quyền truy cập vào trang này.
          </h1>
        </div>
      );
    }


  // data rows send to CustomizedDataGrid
  const [dataRows, setDataRows] = useState<UserRow[]>([]);
  // Popup modal for creating or editing user
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  // fetch businesses and roles options
  const [businessOptions, setBusinessOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [roleOptions, setRoleOptions] = useState<
    { value: string; label: string }[]
  >([]);
  // handle select rows for deleting
  const [selectedRows, setSelectedRows] = useState<UserRow[]>([]);

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
    setTimeout(() => setAlert(null), duration);
  }

  useEffect(() => {
    if (businessOptions.length === 0 && roleOptions.length === 0) return;
    handleGetAll();
  }, [businessOptions, roleOptions]);

  const convertToUserRows = (users: User[]): UserRow[] => {
    return users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      userType: user.userType,
      businessId:
        user.businessId !== null
          ? HandleGetLabelByValue(user.businessId, businessOptions)
          : null,
      roleId:
        user.roleId !== null
          ? HandleGetLabelByValue(user.roleId, roleOptions)
          : null,
      jobTitle: user.jobTitle,
      isActive: user.isActive,
    }));
  };

  // handle get all users
  const handleGetAll = async () => {
    try {
      const response = await getAllUsersFeature();
      if (!response) {
        showAlert("Không có người dùng nào được tìm thấy.", "info", 2000);
        return;
      }

      const rows: UserRow[] = convertToUserRows(response);
      setDataRows(rows);
    } catch (error) {
      console.error("Error refreshing users:", error);
      showAlert(
        "Có lỗi xảy ra khi làm mới danh sách người dùng.",
        "error",
        2000
      );
    }
  };

  // fetch businesses and roles for filter box
  useEffect(() => {
    if (roleOptions.length > 0 && businessOptions.length > 0) return;
    let isMounted = true;
    (async () => {
      const businessesList = await fetchBusinesses();
      const rolesList = await fetchRoles();
      if (isMounted && businessesList && rolesList) {
        const businessOptions = [
          { value: "", label: "Tất cả" },
          ...businessesList.map((business) => ({
            value: business.id,
            label: business.name,
          })),
        ];
        const roleOptions = [
          { value: "", label: "Tất cả" },
          ...rolesList.map((role) => ({
            value: role.id,
            label: role.name,
          })),
        ];
        setBusinessOptions(businessOptions);
        setRoleOptions(roleOptions);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const ColumnConfig: ColumnConfig[] = [
    {
      field: "fullName",
      headerName: "Họ và tên",
      inputType: "text",
      minWidth: 100,
      flex: 0.8,
    },
    {
      field: "username",
      headerName: "Tài khoản",
      inputType: "text",
      minWidth: 100,
      flex: 0.8,
    },
    {
      field: "userType",
      headerName: "Kiểu người dùng",
      inputType: "select",
      minWidth: 100,
      flex: 0.8,
      options: [{ value: "", label: "Tất cả" }, ...userTypeOptions],
    },
    {
      field: "businessId",
      headerName: "Doanh nghiệp",
      inputType: "select",
      minWidth: 100,
      flex: 0.8,
      options: businessOptions,
    },
    {
      field: "roleId",
      headerName: "Vai trò",
      inputType: "select",
      options: roleOptions,
      minWidth: 100,
      flex: 0.8,
    },
    {
      field: "jobTitle",
      headerName: "Chức vụ",
      inputType: "text",
      minWidth: 100,
      flex: 0.8,
    },
  ];

  // handle filter change
  const [filters, setFilters] = useState<Record<string, string>>({});
  const handleFilterChange = (field: string, value: string) => {
    const updatedFilters = { ...filters };

    value ? (updatedFilters[field] = value) : delete updatedFilters[field];

    setFilters(updatedFilters);
  };

  useEffect(() => {
    const applyFilters = async () => {
      try {
        const filteredUsers = await filterUsersFeature(filters);
        if (filteredUsers) {
          const rows: UserRow[] = convertToUserRows(filteredUsers);
          setDataRows(rows);
          if (rows.length === 0) {
            showAlert(
              "Không tìm thấy người dùng phù hợp với điều kiện lọc.",
              "warning",
              5000
            );
          }
        }
      } catch (error) {
        console.error("Error applying filters:", error);
        showAlert("Có lỗi xảy ra khi áp dụng bộ lọc.", "error");
      }
    };

    applyFilters();
  }, [filters]);

  // handle status change
  const handleStatusChange = async (rowId: string, newStatus: boolean) => {
    try {
      const updatedStatus = await toggleUserStatusFeature(rowId, newStatus);

      if (!updatedStatus) {
        console.error("Không thể cập nhật trạng thái người dùng.");
        
      }
      showAlert(
        `Trạng thái người dùng đã được ${
          newStatus ? "kích hoạt" : "vô hiệu hóa"
        }.`,
        "success"
      );
      handleGetAll(); // Refresh data after status change
    } catch (error) {
      showAlert(
        error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật trạng thái người dùng.",
        "error"
      );
    }
    
  }

  // handle reset password
  const handleResetPassword = async (rowId: string) => {
    try {
      const response = await resetUserPasswordFeature(rowId);
      if (response) {
        showAlert("Mật khẩu được khôi phục là: Abcd1@34.", "success");
      } else {
        showAlert("Không thể đặt lại mật khẩu cho người dùng này.", "error");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      showAlert("Có lỗi xảy ra khi đặt lại mật khẩu.", "error");
    }
  }

  const handleDisplayCreationPopup = () => {
    setOpenModal(true);
    setId("");
  };

  const handleDisplayEditPopup = (row: UserRow) => {
    setOpenModal(true);
    setId(row.id);
  };

  const handleRefreshData = () => {
    setOpenModal(false);
    handleGetAll();
    showAlert(
      id ? "Cập nhật người dùng thành công" : "Thêm mới người dùng thành công",
      "success"
    );
    setId("");
  };

  const handleDeleteSelectedRows = async () => {
    try {
      const deleted = await deleteUserFeature(selectedRows);

      if (!deleted) {
        showAlert("Không thể xóa doanh nghiệp đã chọn.", "error");
        return;
      }

      setSelectedRows([]);
      handleGetAll();
      showAlert("Xóa người dùng thành công.", "success");
    } catch (error) {
      console.error("Error deleting users:", error);
      showAlert("Có lỗi xảy ra khi xóa tài khoản.", "error");
    }
  };

  return (
    <div className="w-full h-full px-2">
      <Header
        title="Danh sách người dùng"
        creationPermission={canCreate}
        hasImport={true}
        hasExport={true}
        onAddNewClick={handleDisplayCreationPopup}
      />
      <div className="w-full h-full flex items-center justify-between pb-4">
        <CustomizedDataGrid
          rows={dataRows}
          columnsConfig={ColumnConfig}
          onRowSelectionChange={(selectedData: UserRow[]) =>
            setSelectedRows(selectedData)
          }
          hasEdit={canUpdate}
          onEdit={handleDisplayEditPopup}
          hasView={false}
          hasDelete={canDelete}
          onDelete={handleDeleteSelectedRows}
          filters={filters}
          onFilterChange={handleFilterChange}
          onStatusChange={handleStatusChange}
          hasResetPassword={true}
          onResetPassword={handleResetPassword}
        />
      </div>
      <UserDetail
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
