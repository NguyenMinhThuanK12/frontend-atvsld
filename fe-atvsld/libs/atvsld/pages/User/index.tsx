"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import CustomizedDataGrid, {
  ColumnConfig,
} from "@/libs/core/components/Table/CustomizedDataGrid";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { getUsers } from "../../services/api/userApi";
import { UserType } from "@/libs/shared/core/enums/userType";
import { Business } from "@/libs/shared/atvsld/models/business.model";
import { Role } from "@/libs/shared/atvsld/models/role.model";
import { getBusinesses } from "../../services/api/businessApi";
import { getRoles } from "../../services/api/roleApi";
import UserDetail from "./popup/user-detail";
import { fetchBusinesses } from "../../components/BusinessFeature/handleBusinessFeatures";
import { fetchRoles } from "../../components/RoleFeature/handleRoleFeatures";
import { userTypeOptions } from "../../utils/fetchEnum";
import { useAuth } from "../../services/context/AuthContext";

interface UserRow {
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
  // set permissions in this layout
  const permissions = useAuth().permissions;

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
  };

  // fetch businesses and roles for filter box
  useEffect(() => {
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

  const [filters, setFilters] = useState<Record<string, string>>({});
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleDisplayCreationPopup = () => {
    setOpenModal(true);
    setId("");
  };

  const handleDisplayEditPopup = (row: UserRow) => {
    setOpenModal(true);
    setId(row.id);
  }

  return (
    <div className="w-full h-full px-2">
      <Header
        title="Danh sách người dùng"
        creationPermission={true}
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
          hasEdit={true}
          hasView={false}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
      <UserDetail
        openModal={openModal}
        onClose={() => {
          setOpenModal(false);
          setId("");
        }}
        idSelected={id}
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
