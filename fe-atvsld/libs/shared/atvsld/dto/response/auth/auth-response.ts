import { UserType } from "@/libs/shared/core/enums/userType";

export type PermissionAction = "VIEW" | "CREATE" | "UPDATE" | "DELETE";

export type PermissionMap = Partial<Record<PermissionAction, boolean>>;

export type Permissions = Record<string, PermissionMap>;

export interface UserAuthenticatedResponse {
  id: string;
  full_name: string;
  user_type: UserType;
  avatar: string;
  permissions: Permissions;
}

export interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
  userAuthenticated: UserAuthenticatedResponse;
}

