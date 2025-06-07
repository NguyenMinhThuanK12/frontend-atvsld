import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/Header";
import CustomizedTable from "@/libs/core/components/Table/CustomizedTable";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { getComponentPermissionsByGroup, getGroupPermissions } from "../../services/api/permissionApi";
import { PermissionData } from "../../components/PermissionFeature/handlePerrmissionFeatures";

interface GroupPermissionRow {
  numOrder: number;
  type: string;
  perCode: string;
  perName: string;
  components: ComponentPermissionRow[];
}

interface ComponentPermissionRow {
  numOrder: number;
  type: string;
  funcCode: string;
  funcName: string;
}

export default function PermissionPage() {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");
  const viewPermission = permissions?.PERMISSION?.VIEW;
  const createPermission = permissions?.PERMISSION?.CREATE;
  const updatePermission = permissions?.PERMISSION?.UPDATE;
  const deletePermission = permissions?.PERMISSION?.DELETE;

  // notify
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
    duration?: number; // optional duration for the alert
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

  const [groupDataRows, setGroupDataRows] = useState<GroupPermissionRow[]>([]);
  const [globalDataRows, setGlobalDataRows] = useState<GroupPermissionRow[]>(
    []
  ); // for filtering
  
  // fetch permissions
  const fetchGroupPermissions = async () => {
    try {
      // fetch group permissions
      const groupResponse = await getGroupPermissions();
      if (!groupResponse || !groupResponse.data) {
        showAlert("Không có dữ liệu quyền nhóm", "warning");
        return;
      }

      const groupPermissions: GroupPermissionRow[] = groupResponse.data.map(
        (group, index) => ({
          numOrder: index + 1,
          type: group.type,
          perCode: group.code,
          perName: group.name,
          components: [], // Initialize with empty array
        })
      );

      return groupPermissions;
    } catch (error) {
      console.log("Error fetching group permissions:", error);
      showAlert("Lỗi khi tải dữ liệu quyền nhóm", "error");
    }
  }

  const fetchComponentPermissions = async (parentCode: string) => {
    try {
      const response = await getComponentPermissionsByGroup(parentCode);

      if (!response || !response.data) {
        showAlert("Không có dữ liệu quyền thành phần", "warning");
        return;
      }
      const componentPermissions: ComponentPermissionRow[] = response.data.map(
        (component, index) => ({
          numOrder: index + 1,
          type: component.type,
          funcCode: component.code,
          funcName: component.name,
        })
      );

      return componentPermissions;
    } catch (error) {
      console.log("Error fetching component permissions:", error);
      showAlert("Lỗi khi tải dữ liệu quyền thành phần", "error");
    }
  }

  const loadComponentPermissions = async (groupPermissions: GroupPermissionRow[]) => {
    const updatedGroupPermissions = await Promise.all(
      groupPermissions.map(async (group) => {
        const components = await fetchComponentPermissions(group.perCode);
        return {
          ...group,
          components: components || [],
        };
      })
    );
    setGroupDataRows(updatedGroupPermissions);
    setGlobalDataRows(updatedGroupPermissions); // Store global data for filtering
    console.log("Updated group permissions:", updatedGroupPermissions);
    
    showAlert("Tải dữ liệu quyền thành công", "success");
  }

  const fetchData = async () => {
    const groupPermissions = await fetchGroupPermissions();
    if (groupPermissions) {
      await loadComponentPermissions(groupPermissions);
    } else {
      showAlert("Không có dữ liệu quyền nhóm", "warning");
      return;
    }
    return;
  }

  useEffect(() => {
    console.log("Running useEffect for data fetch");
    if (globalDataRows.length > 0 || groupDataRows.length > 0) {
      return; // Avoid refetching
    }
    fetchData();
  }, [globalDataRows.length, groupDataRows.length]);


  // filter
  const [filters, setFilters] = useState<Record<string, string>>({});
  const handleFilterChange = (field: string, value: string) => {
    
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      if (value === "") {
        delete updatedFilters[field]; // Remove filter key if value is empty
      } else {
        updatedFilters[field] = value; // Update filter value
      }
      applyFilters(updatedFilters);
      return updatedFilters;
    });

  };

  const applyFilters = (localFilters: Record<string, string>) => {
    
    const filteredRows = globalDataRows.filter((row) => {
      // filter on local data
      const matchesCode = localFilters["permissionCode"]
        ? row.perCode
            .toLowerCase()
            .includes(localFilters["permissionCode"].toLowerCase())
        : true;
      const matchesName = localFilters["permissionName"]
        ? row.perName
            .toLowerCase()
            .includes(localFilters["permissionName"].toLowerCase())
        : true;
      return matchesCode && matchesName;
    })
    console.log("Filtered rows:", filteredRows);
    
    setGroupDataRows(filteredRows);
    setTimeout(() => { 
      if (
        filteredRows.length === 0 &&
        (localFilters.permissionCode || localFilters.permissionName)
      ) {
        showAlert("Không tìm thấy quyền phù hợp với điều kiện lọc.", "warning");
      }
    }, 500)
  };

  return (
    <div className="container w-full flex flex-col items-center justify-between h-full">
      <Header
        title="Danh Sách Quyền"
        creationPermission={false} // Assuming user has permission to create
      />

      <div className="flex-1 overflow-y-auto w-full px-2">
        <CustomizedTable
          rows={groupDataRows}
          onFilterChange={handleFilterChange}
          filters={filters}
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
