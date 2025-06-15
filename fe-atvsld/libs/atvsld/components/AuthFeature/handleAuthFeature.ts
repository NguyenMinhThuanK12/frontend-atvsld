import { useAuth } from "@/libs/core/hooks/AuthContext";

export const clientMenuItems = [
  {
    name: "Báo cáo ATVSLĐ",
    href: "/ATVSLD/report-sanitation",
  },
];

const hasAnyPermission = (permissions: (boolean | undefined)[]): boolean => {
  return permissions.some((perm) => perm === true);
};

export const handleGetPermissions = () => {
  const { permissions } = useAuth();

  console.log("Permissions:", permissions);
  

  // Business permissions
  const canViewBusiness = permissions?.BUSINESS?.VIEW === true;
  const canCreateBusiness = permissions?.BUSINESS?.CREATE === true;
  const canUpdateBusiness = permissions?.BUSINESS?.UPDATE === true;
  const canDeleteBusiness = permissions?.BUSINESS?.DELETE === true;

  // Permission permissions
  const canViewPermission = permissions?.PERMISSION?.VIEW === true;


  // Role permissions
  const canViewRole = permissions?.ROLE?.VIEW === true;
  const canCreateRole = permissions?.ROLE?.CREATE === true;
  const canUpdateRole = permissions?.ROLE?.UPDATE === true;
  const canDeleteRole = permissions?.ROLE?.DELETE === true;

  // User permissions
  const canViewUser = permissions?.USER?.VIEW === true;
  const canCreateUser = permissions?.USER?.CREATE === true;
  const canUpdateUser = permissions?.USER?.UPDATE === true;
  const canDeleteUser = permissions?.USER?.DELETE === true;

  // Report-configuration permissions
  const canCreateReport = permissions?.REPORT_CONFIGURATION?.CREATE === true;
  const canUpdateReport = permissions?.REPORT_CONFIGURATION?.UPDATE === true;

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

  const permissionsList = {
    businessPermission,
    permissionPermission,
    rolePermission,
    userPermission,
    reportConfigurationPermission,
  };

  return permissionsList; 
}


export const useAdminMenuItems = () => {
  const permissionsList = handleGetPermissions();

  console.log("Permissions List:", permissionsList);
  

  const menuConfig = [
    {
      permission: permissionsList.businessPermission,
      name: "Quản lý doanh nghiệp",
      href: "/dashboard/businesses",
    },
    {
      permission: permissionsList.permissionPermission,
      name: "Phân quyền",
      href: "/dashboard/permissions",
    },
    {
      permission: permissionsList.rolePermission,
      name: "Vai trò",
      href: "/dashboard/roles",
    },
    {
      permission: permissionsList.userPermission,
      name: "Tài khoản",
      href: "/dashboard/users",
    },
    {
      permission: permissionsList.reportConfigurationPermission,
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