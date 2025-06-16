import { useAuth } from "@/libs/core/hooks/AuthContext";
import { useEffect } from "react";

export const clientMenuItems = [
  {
    name: "Báo cáo ATVSLĐ",
    href: "/ATVSLD/report-sanitation",
  },
];

const hasAnyPermission = (state: (boolean | undefined)[]): boolean => {
  return state.some((perm) => perm === true);
};

export const handleGetPermissions = () => {
  const { state } = useAuth();

  console.log("state:", state);
  

  // Business state
  const canViewBusiness = state?.permissions?.BUSINESS?.VIEW === true;
  const canCreateBusiness = state?.permissions?.BUSINESS?.CREATE === true;
  const canUpdateBusiness = state?.permissions?.BUSINESS?.UPDATE === true;
  const canDeleteBusiness = state?.permissions?.BUSINESS?.DELETE === true;

  // Permission state
  const canViewPermission = state?.permissions?.PERMISSION?.VIEW === true;


  // Role state
  const canViewRole = state?.permissions?.ROLE?.VIEW === true;
  const canCreateRole = state?.permissions?.ROLE?.CREATE === true;
  const canUpdateRole = state?.permissions?.ROLE?.UPDATE === true;
  const canDeleteRole = state?.permissions?.ROLE?.DELETE === true;

  // User state
  const canViewUser = state?.permissions?.USER?.VIEW === true;
  const canCreateUser = state?.permissions?.USER?.CREATE === true;
  const canUpdateUser = state?.permissions?.USER?.UPDATE === true;
  const canDeleteUser = state?.permissions?.USER?.DELETE === true;

  // Report-configuration state
  const canCreateReport = state?.permissions?.REPORT_CONFIGURATION?.CREATE === true;
  const canUpdateReport = state?.permissions?.REPORT_CONFIGURATION?.UPDATE === true;

  const businessPermission = [
    canViewBusiness,
    canCreateBusiness,
    canUpdateBusiness,
    canDeleteBusiness,
  ];

  const permissionPermission = [
    canViewPermission,
  ];

  const rolePermission = [
    canViewRole,
    canCreateRole,
    canUpdateRole,
    canDeleteRole,
  ];

  const userPermission = [
    canViewUser,
    canCreateUser,
    canUpdateUser,
    canDeleteUser,
  ];

  const reportConfigurationPermission = [
    canCreateReport,
    canUpdateReport,
  ];

  const stateList = {
    businessPermission,
    permissionPermission,
    rolePermission,
    userPermission,
    reportConfigurationPermission,
  };

  return stateList; 
}


export const useAdminMenuItems = () => {
  const stateList = handleGetPermissions();

  console.log("state List:", stateList);

  const menuConfig = [
    {
      permission: stateList.businessPermission,
      name: "Quản lý doanh nghiệp",
      href: "/dashboard/businesses",
    },
    {
      permission: stateList.permissionPermission,
      name: "Phân quyền",
      href: "/dashboard/state",
    },
    {
      permission: stateList.rolePermission,
      name: "Vai trò",
      href: "/dashboard/roles",
    },
    {
      permission: stateList.userPermission,
      name: "Tài khoản",
      href: "/dashboard/users",
    },
    {
      permission: stateList.reportConfigurationPermission,
      name: "Cấu hình báo cáo",
      href: "/dashboard/report-configuration",
    },
  ];

  const AdminMenuItems = menuConfig
    .filter((item) => hasAnyPermission(item.permission))
    .map(({ name, href }) => ({ name, href }));

  return AdminMenuItems;
}

export const testMenuConfig = [
  {
    name: "Quản lý doanh nghiệp",
    href: "",
  },
  {
    name: "Phân quyền",
    href: "",
  },
  {
    name: "Vai trò",
    href: "",
  },
  {
    name: "Tài khoản",
    href: "",
  },
  {
    name: "Cấu hình báo cáo",
    href: "",
  },
];