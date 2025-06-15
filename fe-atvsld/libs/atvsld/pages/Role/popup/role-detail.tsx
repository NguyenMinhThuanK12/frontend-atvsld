import {
  applyFilters,
  GroupPermissionRow,
  isDuplicateRoleCode,
  fetchData as PermissionData,
} from "@/libs/atvsld/components/PermissionFeature/handlePerrmissionFeatures";
import {
  createRole,
  getById,
  updateRole,
} from "@/libs/atvsld/services/api/roleApi";
import { renderLabelWithAsterisk } from "@/libs/atvsld/utils/commonFunction";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import PrimaryTextField from "@/libs/core/components/FormFields/primaryTextInput";
import CustomizedCollapseTableWithCheckbox from "@/libs/core/components/Table/TableWithCheckbox";
import { CreationRoleRequest } from "@/libs/shared/atvsld/dto/request/role/creationRoleRequest";
import { UpdateRoleRequest } from "@/libs/shared/atvsld/dto/request/role/updateRoleRequest";
import { Role } from "@/libs/shared/atvsld/models/role.model";
import { Dialog, DialogActions, DialogTitle, Divider } from "@mui/material";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

interface RoleDetailProps {
  openModal: boolean;
  onClose?: () => void;
  onSave: () => void;
  selectedId?: string;
}

export default function RoleDetail(props: RoleDetailProps) {
  const { openModal, onClose, onSave, selectedId } = props;
  const [value, setValue] = useState<Role>();
  const [filteredPermissionRows, setFilteredPermissionRows] = useState<
    GroupPermissionRow[]
  >([]); // contains filtered permissions data
  const [globalPermissionRows, setGlobalPermissionRows] = useState<
    GroupPermissionRow[]
  >([]); // contains all permissions data for filtering
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    value?.permissionIds || []
  );
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
  const [roleCodeHelperText, setRoleCodeHelperText] = useState<string>("");
  const [roleCodeError, setRoleCodeError] = useState<boolean>(false);
  const [roleNameError, setRoleNameError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // notify
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
    duration?: number; // optional duration for the alert
  } | null>(null);

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

  // handle get by id for edit
  useEffect(() => {
    const fetchData = async () => {
      if (selectedId) {
        await getDetail(selectedId);
      }
      else {
        setValue({
          id: "",
          code: "",
          name: "",
          permissionIds: [],
        });
        setSelectedPermissions([]);
      }
    };
    fetchData();
  }, [selectedId]);

  const getDetail = async (id: string) => {
    try {
      const response = await getById(id);
      if (response.status !== 200 || !response.data) {
        showAlert("Không tìm thấy vai trò", "error");
        return;
      }

      setValue(response.data);      
      setSelectedPermissions(response.data.permissionIds || []);
    } catch (error) {
      console.error("Error fetching role details:", error);
      showAlert("Lỗi khi tải thông tin vai trò", "error");
    }
  };

  // handle query permissions table
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const data = await PermissionData();
      if (isMounted && data) {
        setFilteredPermissionRows(data);
        setGlobalPermissionRows(data);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // handle select permissions
  const handleSelectPermissions = (componentIds: string[]) => {
    setSelectedPermissions(componentIds);
  };

  // handle filter change
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      if (value === "") {
        delete updatedFilters[field];
      } else {
        updatedFilters[field] = value;
      }
      const filteredRows = applyFilters(updatedFilters, globalPermissionRows);
      setTimeout(() => {
        if (
          filteredRows.length === 0 &&
          (updatedFilters.permissionCode || updatedFilters.permissionName)
        ) {
          showAlert(
            "Không tìm thấy quyền phù hợp với điều kiện lọc.",
            "warning"
          );
        }
      }, 500);
      setFilteredPermissionRows(filteredRows);
      return updatedFilters;
    });
  };

  // handle validate role
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
    const isRoleCodeEmpty = value?.code.trim() === "";
    const isRoleNameEmpty = value?.name.trim() === "";
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
  };

  // handle create
  const handleCreate = async (role: CreationRoleRequest): Promise<Boolean> => {
    try {
      const response = await createRole(role);
      if (response.status !== 201 || !response.data) {
        showAlert("Không thể tạo vai trò mới", "error");
        return false;
      }
      return true
    } catch (error) {
      console.error("Error creating role:", error);
      showAlert("Lỗi khi tạo vai trò mới", "error");
      return false;
    }
  };

  // Handle update
  const handleUpdate = async (
    role: UpdateRoleRequest,
    id: string
  ): Promise<Boolean> => {
    try {
      const response = await updateRole(id, role);
      if (response.status !== 200 || !response.data) {
        showAlert(response.message || "Không thể cập nhật vai trò", "error");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error updating role:", error);
      showAlert("Lỗi khi cập nhật vai trò", "error");
      return false;
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    const isValid = validateRole();
    if (!isValid) {
      return; // Stop submission if validation fails
    }
    setLoading(true);
    const success = selectedId
      ? await handleUpdate(
          {
            name: value?.name || "",
            permissionIds: selectedPermissions,
          },
          selectedId
        )
      : await handleCreate({
          code: value?.code || "",
          name: value?.name || "",
          permissionIds: selectedPermissions,
      });
    setLoading(false);
    if (success) {
      onSave(); // Call onSave callback if provided
    }
    
  };

  return (
    <>
      {/* Dialog */}
      <Dialog
        open={openModal}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
          },
        }}
      >
        {/* Header */}
        <DialogTitle id="alert-dialog-title">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-black font-semibold text-2xl">
              {selectedId ? "Chỉnh sửa vai trò" : "Thêm mới vai trò" }
            </h1>
            <button
              className="p-2 flex items-center justify-center cursor-pointe hover:bg-gray-50 rounded-full"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogTitle>
        <Divider
          sx={{
            borderColor: "#e6e6e6",
            borderBottomWidth: 2,
            mx: "auto",
            width: "97%",
          }}
        />
        {/* Textfield */}
        <div className="flex items-center justify-between w-full px-4 space-x-6 mt-4">
          <PrimaryTextField
            label={renderLabelWithAsterisk("Mã vai trò", true)}
            className="w-full"
            size="small"
            value={value?.code || ""}
            onChange={async (e) => {
              setTimeout(async () => {
                const isDuplicated = await isDuplicateRoleCode(e.target.value);
                if (isDuplicated) {
                  setIsDuplicate(true);
                  setRoleCodeError(true);
                  setRoleCodeHelperText("Mã vai trò đã tồn tại");
                } else {
                  setIsDuplicate(false);
                  setRoleCodeError(false);
                  setRoleCodeHelperText("");
                }
              }, 1000);
              setValue((prev) =>
                prev
                  ? { ...prev, code: e.target.value }
                  : {
                      id: selectedId ?? "",
                      code: e.target.value,
                      name: "",
                      permissionIds: [],
                    }
              );
            }}
            error={roleCodeError}
            helperText={roleCodeHelperText}
            disabled={selectedId !== ""} // Disable input in edit mode
          />

          <PrimaryTextField
            label={renderLabelWithAsterisk("Tên vai trò", true)}
            className="w-full"
            size="small"
            value={value?.name || ""}
            onChange={(e) => {
              setValue((prev) =>
                prev
                  ? { ...prev, name: e.target.value }
                  : {
                      id: "",
                      code: "",
                      name: e.target.value,
                      permissionIds: [],
                    }
              );
            }}
            error={roleNameError}
          />
        </div>

        {/* Permission Table */}
        <div className="w-full h-full overflow-auto flex flex-col items-start justify-start p-4">
          <CustomizedCollapseTableWithCheckbox
            rows={filteredPermissionRows}
            permissionIds={selectedPermissions}
            onComponentSelect={handleSelectPermissions}
            onGroupSelect={handleSelectPermissions}
            onFilterChange={handleFilterChange}
            filters={filters}
          />
        </div>
        <DialogActions>
          <PrimaryButton content="Lưu" type="button" onClick={handleSubmit} />
        </DialogActions>

        {/* Notify */}
        {alert && (
          <Alert
            content={alert.content}
            type={alert.type}
            duration={alert.duration}
            onClose={() => setAlert(null)}
          />
        )}
      </Dialog>
    </>
  );
}
