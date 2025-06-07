// types/permissions.ts
export type PermissionAction = "VIEW" | "CREATE" | "UPDATE" | "DELETE";

export type PermissionMap = Partial<Record<PermissionAction, boolean>>;

export type Permissions = Record<string, PermissionMap>;

export interface UserAuthenticatedResponse {
  id: string;
  full_name: string;
  permissions: Permissions;
}
