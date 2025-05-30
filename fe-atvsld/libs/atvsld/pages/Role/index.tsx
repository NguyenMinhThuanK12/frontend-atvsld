"use client";

import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/Header";
import CustomizedDataGrid, {
  ColumnConfig,
} from "@/libs/core/components/Table/CustomizedDataGrid";
import { useRouter } from "next/navigation";
import Alert from "@/libs/core/components/Alert/primaryAlert";

interface RoleRow {
  id: string;
  roleCode: string;
  roleName: string;
}

export default function RolePage() {
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

  // fetch roles
  const [dataRows, setDataRows] = React.useState<any[]>([]);

  const rows: RoleRow[] = [
    {
      id: "1",
      roleCode: "ADMIN",
      roleName: "Quản trị viên",
    },
    {
      id: "2",
      roleCode: "USER",
      roleName: "Người dùng",
    },
    {
      id: "3",
      roleCode: "GUEST",
      roleName: "Khách",
    },
    ];
    
  // Simulate fetching data
  useEffect(() => {
    // Simulate an API call
    setTimeout(() => {
      setDataRows(rows);
    }, 1000);
  }, []);
    
    
  // filters
  const [filters, setFilters] = useState<Record<string, string>>({});
  const handleFilterChange = useCallback((field: string, value: string) => {
    console.log("Filter change: field:", field, " - value:", value);
  }, []);

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

  const router = useRouter();

  const handleDisplayUpdatePage = useCallback((row: RoleRow) => {
    router.push(`/dashboard/roles/update?${row.id}`);
  }, []);

  const handleDisplayCreatePage = useCallback(() => {
    router.push("/dashboard/roles/create");
  }, []);

  return (
    <div className="container w-full flex flex-col items-center justify-between h-full">
      <Header
        title="Danh Sách Vai Trò"
        creationPermission={true}
        hasAddNew={true}
        onAddNewClick={handleDisplayCreatePage}
      />

      <CustomizedDataGrid
        rows={dataRows}
        columnsConfig={ColumnConfig}
        onRowSelectionChange={handleRowSelection}
        onFilterChange={handleFilterChange}
        filters={filters}
        onEdit={handleDisplayUpdatePage}
        hasStatus={false}
        hasView={false}
      />
      {/* <div className="flex-1 overflow-y-auto w-full px-2"></div> */}

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
