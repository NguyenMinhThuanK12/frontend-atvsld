"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useRouter } from "next/navigation";
import CustomizedDataGrid, {
  ColumnConfig,
} from "@/libs/core/components/Table/CustomizedDataGrid";
import { StringToNumber } from "lodash";
import Profile from "../../components/UserFeature/Profile";
import { UserResponse } from "@/libs/shared/atvsld/dto/response/user/UserReponse";
import { duration } from "@mui/material";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { getUsers } from "../../services/api/userApi";

interface UserRow {
  id: string;
  fullName: string;
  account: string;
  email: string;
  phone: string;
  role: string;
  jobTitle: string;
  isActive: boolean;
}

export default function UserPage() {
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
  }

  const [dataRows, setDataRows] = useState<UserRow[]>([
    {
      id: "1",
      fullName: "Nguyen Van A",
      account: "nguyenvana",
      email: "vana@example.com",
      phone: "0901234567",
      role: "Admin",
      jobTitle: "Manager",
      isActive: true,
    },
    {
      id: "2",
      fullName: "Tran Thi B",
      account: "tranthib",
      email: "thib@example.com",
      phone: "0912345678",
      role: "User",
      jobTitle: "Developer",
      isActive: true,
    },
    {
      id: "3",
      fullName: "Le Van C",
      account: "levanc",
      email: "vanc@example.com",
      phone: "0923456789",
      role: "User",
      jobTitle: "Tester",
      isActive: false,
    },
    {
      id: "4",
      fullName: "Pham Thi D",
      account: "phamthid",
      email: "thid@example.com",
      phone: "0934567890",
      role: "Admin",
      jobTitle: "HR",
      isActive: true,
    },
    {
      id: "5",
      fullName: "Hoang Van E",
      account: "hoangvane",
      email: "vane@example.com",
      phone: "0945678901",
      role: "User",
      jobTitle: "Designer",
      isActive: false,
    },
    {
      id: "6",
      fullName: "Vu Thi F",
      account: "vuthif",
      email: "thif@example.com",
      phone: "0956789012",
      role: "User",
      jobTitle: "Support",
      isActive: true,
    },
    {
      id: "7",
      fullName: "Do Van G",
      account: "dovang",
      email: "vang@example.com",
      phone: "0967890123",
      role: "Admin",
      jobTitle: "Manager",
      isActive: true,
    },
    {
      id: "8",
      fullName: "Bui Thi H",
      account: "buithih",
      email: "thih@example.com",
      phone: "0978901234",
      role: "User",
      jobTitle: "Developer",
      isActive: false,
    },
    {
      id: "9",
      fullName: "Nguyen Van I",
      account: "nguyenvani",
      email: "vani@example.com",
      phone: "0989012345",
      role: "User",
      jobTitle: "Tester",
      isActive: true,
    },
    {
      id: "10",
      fullName: "Tran Thi J",
      account: "tranthij",
      email: "thij@example.com",
      phone: "0990123456",
      role: "Admin",
      jobTitle: "HR",
      isActive: false,
    },
  ]);

  const [users, setUsers] = useState<UserResponse[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if(!response.data || response.data.length === 0) {
        showAlert("Không có người dùng nào được tìm thấy", "info");
        return;
      }
      
      const formattedRows: UserRow[] = response.data.map((user) => ({
        id: user.id,
        fullName: user.full_name,
        account: user.account,
        email: user.email,
        phone: user.phone,
        role: user.role.name,
        jobTitle: user.job_title,
        isActive: user.is_active,
      }));

      setDataRows(formattedRows);
      setUsers(response.data);

    } catch (error) {
      console.error("Error fetching users:", error);
      // Handle error appropriately, e.g., show a notification or alert
      
    }
  }

  useEffect(() => {
    fetchUsers(); 
  }, []);

  const [profilePopup, setProfilePopup] = useState<{
    isCreate: boolean;
    onClose: () => void;
  }>({
    isCreate: false,
    onClose: () => setProfilePopup({ isCreate: false, onClose: () => {} }),
  });

  const handleCreateUser = () => {
    // router.push("/dashboard/users/create");
    // setIsCreate(true);
    setProfilePopup({
      isCreate: true,
      onClose: () => setProfilePopup({ isCreate: false, onClose: () => {} }),
    });
  };

  const ColumnConfig: ColumnConfig[] = [
    {
      field: "fullName",
      headerName: "Họ và tên",
      inputType: "text",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "account",
      headerName: "Tài khoản",
      inputType: "text",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      inputType: "text",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      inputType: "text",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "role",
      headerName: "Vai trò",
      inputType: "select",
      options: [
        { key: "Admin", value: "Admin" },
        { key: "User", value: "User" },
      ],
      minWidth: 150,
      flex: 1,
    },
    {
      field: "jobTitle",
      headerName: "Chức vụ",
      inputType: "text",
      minWidth: 150,
      flex: 1,
    },
  ];

  const [selectedRows, setSelectedRows] = useState<UserRow[]>([]);
  const handleRowSelection = (selectedData: UserRow[]) => {
    setSelectedRows(selectedData);
    console.log("Selected rows:", selectedData);
  };

  const [filters, setFilters] = useState<Record<string, string>>({});
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  return (
    <div className="w-full h-full px-2">
      <Header
        title="Danh sách người dùng"
        creationPermission={true}
        hasImport={true}
        hasExport={true}
        onAddNewClick={handleCreateUser}
      />
      <div className="w-full h-full flex items-center justify-between pb-4">
        <CustomizedDataGrid
          rows={dataRows}
          columnsConfig={ColumnConfig}
          onRowSelectionChange={handleRowSelection}
          hasEdit={true}
          hasView={false}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
      <Profile isCreate={profilePopup.isCreate} onClose={profilePopup.onClose} />
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
