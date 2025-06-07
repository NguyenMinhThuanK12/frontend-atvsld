import {
  getComponentPermissionsByGroup,
  getGroupPermissions,
} from "../../services/api/permissionApi";
import { checkDuplicateRoleCode } from "../../services/api/roleApi";

export interface GroupPermissionRow {
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

// Fetch group permissions
const fetchGroupPermissions = async () => {
  try {
    const groupResponse = await getGroupPermissions();
    if (!groupResponse || !groupResponse.data) {
      console.log("Không có dữ liệu quyền nhóm", "warning");
      return;
    }
    const groupPermissions: GroupPermissionRow[] = groupResponse.data.map(
      (group) => ({
        id: group.id,
        perCode: group.code,
        perName: group.name,
        components: [],
      })
    );
    return groupPermissions;
  } catch (error) {
    console.log("Error fetching group permissions:", error);
  }
};

// Fetch component permissions
const fetchComponentPermissions = async (parentCode: string) => {
  try {
    const response = await getComponentPermissionsByGroup(parentCode);
    if (!response || !response.data) {
      console.log("Không có dữ liệu quyền thành phần", "warning");
      return;
    }
    const componentPermissions: ComponentPermissionRow[] = response.data.map(
      (component) => ({
        id: component.id,
        funcCode: component.code,
        funcName: component.name,
      })
    );
    return componentPermissions;
  } catch (error) {
    console.log("Error fetching component permissions:", error);
  }
};

// Load component permissions
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
  return updatedGroupPermissions;
};

// Fetch data
const fetchData = async () => {
  const groupPermissions = await fetchGroupPermissions();
  if (groupPermissions) {
    const result = await loadComponentPermissions(groupPermissions);
    return result;
  } else {
    console.log("Không có dữ liệu quyền nhóm", "warning");
    return;
  }
};

export const PermissionData = fetchData();


export const isDuplicateRoleCode = async (code: string): Promise<boolean> => {
    try {
      const response = await checkDuplicateRoleCode(code);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return false;
    } catch (error) {
      console.error("Error checking duplicate role code:", error);
      return false;
    }
};
  

export const applyFilters = (
  localFilters: Record<string, string>,
  globalPermissionRows: GroupPermissionRow[],
) => {
  const filteredRows = globalPermissionRows.filter((row) => {
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
  });
  return filteredRows;
};
