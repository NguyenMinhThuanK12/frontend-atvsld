"use client";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import PrimaryTextField from "@/libs/core/components/FormFields/primaryTextInput";
import CustomizedCollapseTableWithCheckbox from "@/libs/core/components/Table/TableWithCheckbox";
import { Divider } from "@mui/material";
import { X } from "lucide-react";
import { NextPage } from "next";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, {  useCallback, useEffect, useState } from "react";
import {
  getComponentPermissionsByGroup,
  getGroupPermissions,
} from "../../services/api/permissionApi";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { CreationRoleRequest } from "@/libs/shared/atvsld/dto/request/role/creationRoleRequest";
import { UpdateRoleRequest } from "@/libs/shared/atvsld/dto/request/role/updateRoleRequest";
import { checkDuplicateRoleCode, createRole, getById, updateRole } from "../../services/api/roleApi";
import { Role } from "@/libs/shared/atvsld/models/role.model";


interface GroupPermissionRow {
  id: string;
  perCode: string;
  perName: string;
  components: ComponentPermissionRow[];
}

interface ComponentPermissionRow {
  id: string;
  funcCode: string;
  funcName: string;
}

export const RoleDetail: NextPage = () => {
  const pageType = useParams();  
  const [id, setId] = useState<string>("");
  const isView = pageType?.pageType === " view";
  const isUpdate = pageType?.pageType === "update";
  const isCreate = pageType?.pageType === "create";
  const query = useSearchParams();
  const router = useRouter();

  const [groupDataRows, setGroupDataRows] = useState<GroupPermissionRow[]>([]);
  const [globalDataRows, setGlobalDataRows] = useState<GroupPermissionRow[]>([]); // for filtering
  
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
  const [roleCodeHelperText, setRoleCodeHelperText] = useState<string>("");

  const [currRole, setCurrRole] = useState<Role>({} as Role);
  const [roleCode, setRoleCode] = useState<string>(currRole.code ?? "");
  const [roleName, setRoleName] = useState<string>(currRole.name ?? "");
  const [roleCodeError, setRoleCodeError] = useState<boolean>(false);
  const [roleNameError, setRoleNameError] = useState<boolean>(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(currRole.permissionIds ?? []);
  
  
  useEffect(() => {
    const id = query.get("id");
    if (id) {
      setId(id);
    }
  }, []);

  useEffect(() => {
    if (isView || isUpdate) {
      getDetail(id);
    }
  }, [id]);


  const getDetail = async (id: string) => {
    try {
      const response = await getById(id);
      if (response.status !== 200 || !response.data) {
        showAlert("Không tìm thấy vai trò", "error");
        return;
      }
      setCurrRole(response.data);
      setRoleCode(response.data.code ?? "");
      setRoleName(response.data.name  ?? "");
      setSelectedPermissions(response.data.permissionIds ?? []);
      
    } catch (error) {
      console.error("Error fetching role details:", error);
      showAlert("Lỗi khi tải thông tin vai trò", "error");
      
    } 
  };

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
      setAlert({ content, type, duration });
      setTimeout(() => setAlert(null), duration);
    },
    []
  );

  // fetch data
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
          id: group.id, // Assuming group has an id field
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
  };

  const fetchComponentPermissions = async (parentCode: string) => {
    try {
      const response = await getComponentPermissionsByGroup(parentCode);

      if (!response || !response.data) {
        showAlert("Không có dữ liệu quyền thành phần", "warning");
        return;
      }
      const componentPermissions: ComponentPermissionRow[] = response.data.map(
        (component, index) => ({
          id: component.id, // Assuming component has an id field
          funcCode: component.code,
          funcName: component.name,
        })
      );

      return componentPermissions;
    } catch (error) {
      console.log("Error fetching component permissions:", error);
      showAlert("Lỗi khi tải dữ liệu quyền thành phần", "error");
    }
  };

  const loadComponentPermissions = async (
    groupPermissions: GroupPermissionRow[]
  ) => {
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
  };

  const fetchData = async () => {
    const groupPermissions = await fetchGroupPermissions();
    if (groupPermissions) {
      await loadComponentPermissions(groupPermissions);
    } else {
      showAlert("Không có dữ liệu quyền nhóm", "warning");
      return;
    }
    return;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderLabelWithAsterisk = (label: string, required: boolean) => (
    <span>
      {label}
      {required && <span style={{ color: "red" }}> *</span>}
    </span>
  );

  // get selected rows
  
  const handleComponentSelect = (componentIds: string[]) => {
    console.log("Selected Component IDs:", componentIds);
    setSelectedPermissions(componentIds);
  };

  // Callback to log selected group component IDs
  const handleGroupSelect = (componentIds: string[]) => {
    console.log("Selected Component IDs:", componentIds);
    setSelectedPermissions(componentIds);
  };


  // check duplicate role code
  const isDuplicateRoleCode = async (code: string): Promise<boolean> => {
    try {
      const response = await checkDuplicateRoleCode(code);
      if (response.status === 200 && response.data) {
        return response.data; // Assuming the API returns a boolean indicating duplication
      }
      return false; // Default to false if no data is returned
    } catch (error) {
      console.error("Error checking duplicate role code:", error);
      return false; // Default to false on error
    }
  }

  // Validate role
  const validateRole = (): boolean => {
    // Reset error states
    setRoleCodeError(false);
    setRoleNameError(false);

    // if role code is duplicate
    if (isDuplicate) {
      showAlert("Mã vai trò đã tồn tại", "error");
      setRoleCodeError(true);
      return false;
    }

    // Validate fields
    const isRoleCodeEmpty = roleCode.trim() === "";
    const isRoleNameEmpty = roleName.trim() === "";
    const isPermissionsEmpty = selectedPermissions.length === 0;

    if (isRoleCodeEmpty || isRoleNameEmpty) {
      if (isRoleCodeEmpty) setRoleCodeError(true);
      if (isRoleNameEmpty) setRoleNameError(true);
      showAlert("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return false;
    }

    if (isPermissionsEmpty) {
      showAlert("Vui lòng chọn ít nhất một quyền.", "error");
      return false;
    }

    return true;
  }

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
          showAlert(
            "Không tìm thấy quyền phù hợp với điều kiện lọc.",
            "warning"
          );
        }
      }, 500)
    };

  // handle submit
  const handleSubmit = () => {
    const isValid = validateRole();
    if (!isValid) {
      return; // Stop submission if validation fails
    }

    isCreate
      ? handleCreate({
          code: roleCode,
          name: roleName,
          permissionIds: selectedPermissions,
        })
      : handleUpdate(
          {
            name: roleName,
            permissionIds: selectedPermissions,
          },
          id
      );
  };

  // handle create
  const handleCreate = async (role: CreationRoleRequest) => {
    try {
      const response = await createRole(role);

      if(response.status != 201 || !response.data) {
        showAlert("Không thể tạo vai trò mới", "error");
        return;
      }
      router.push("/dashboard/roles?create=success");

    } catch (error) {
      console.error("Error creating role:", error);
      showAlert("Lỗi khi tạo vai trò", "error");
      return;
      
    }
    
  };

  // handle update
  const handleUpdate = async (role: UpdateRoleRequest, id: string) => {
    try {
      const response = await updateRole(id, role);

      if(response.status != 200 || !response.data) {
        showAlert(response.message, "error");
        return;
      }

      router.push("/dashboard/roles?update=success");

    } catch (error) {
      console.error("Error updating role:", error);
      showAlert("Lỗi khi cập nhật vai trò", "error");
      return;
    }
  };

  return (
    <div className="w-full h-full container mx-auto px-4 py-4">
      <div className="flex flex-col items-start justify-between w-full h-full bg-white rounded-lg">
        <div className="flex items-center justify-between w-full px-4 pt-2">
          <h1 className="text-black font-semibold text-2xl">
            {isCreate ? "Thêm mới vai trò" : "Chỉnh sửa vai trò"}
          </h1>
          <button className="p-2 flex items-center justify-center cursor-pointe hover:bg-gray-50 rounded-full">
            <X
              className="w-5 h-5"
              onClick={(e) => {
                e.preventDefault();
                router.push("/dashboard/roles");
              }}
            />
          </button>
        </div>
        <Divider
          sx={{
            my: 1, // Margin top and bottom for spacing
            borderColor: "#e6e6e6", // Make the divider black for visibility
            borderBottomWidth: 2, // Increase thickness for better visibility
            mx: "auto", // Center the divider (optional, since variant="middle" already adds margins)
            width: "97%", // Ensure the divider has a defined width to see the "middle" effect
          }}
        />
        <div className="flex items-center justify-between w-full px-4 space-x-[12rem] mt-2">
          <PrimaryTextField
            label={renderLabelWithAsterisk("Mã vai trò", true)}
            className="w-full"
            value={roleCode}
            onChange={(e) => {
              setTimeout(() => {
                isDuplicateRoleCode(e.target.value).then((isDuplicate) => {
                  if (isDuplicate) {
                    setIsDuplicate(true);
                    setRoleCodeError(true);
                    setRoleCodeHelperText("Mã vai trò đã tồn tại");
                  } else {
                    setIsDuplicate(false);
                    setRoleCodeError(false);
                    setRoleCodeHelperText("");
                  }
                });
              }, 1000); // Debounce to avoid too many API calls
              setRoleCode(e.target.value);
              setRoleCodeError(false); // Reset error when user starts typing
            }}
            error={roleCodeError}
            helperText={roleCodeHelperText}
            disabled={isView || isUpdate} // Disable input in view mode
          />

          <PrimaryTextField
            label={renderLabelWithAsterisk("Tên vai trò", true)}
            className="w-full"
            value={roleName}
            onChange={(e) => {
              setRoleName(e.target.value);
              setRoleNameError(false); // Reset error when user starts typing
            }}
            error={roleNameError}
          />
        </div>
        <div className="w-full h-full overflow-auto flex flex-col items-start justify-start p-4">
          <CustomizedCollapseTableWithCheckbox
            rows={groupDataRows}
            permissionIds={selectedPermissions}
            onComponentSelect={handleComponentSelect}
            onGroupSelect={handleGroupSelect}
            onFilterChange={handleFilterChange}
            filters={filters}
          />
        </div>
        <div className="w-full h-16 flex items-center justify-end px-4 my-4">
          <PrimaryButton content="Lưu" size="medium" onClick={handleSubmit} />
        </div>
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
};
