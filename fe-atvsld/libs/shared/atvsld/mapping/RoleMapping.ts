import { RoleResponse } from "../dto/response/role/RoleResponse";
import { Role } from "../models/role.model";

export const mappingRoleResponseToRole = (role: RoleResponse): Role => {
  return {
    id: role.id,
    name: role.name,
    code: role.code,
    permissionIds: role.permissionIds,
  };
}