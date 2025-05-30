import { PermissionType } from "@/libs/shared/core/enums/permissionType";

export interface PermissionResponse {
  id: string;
  code: string;
  name: string;
  type: PermissionType; // 'Group' | 'Component'
  parentCode?: string; // chỉ có nếu là Component
}
