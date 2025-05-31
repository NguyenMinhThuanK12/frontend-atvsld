export interface RoleResponse {
    id: string;
    code: string;
    name: string;
    permissionIds: string[]; // quyền đã được gán
}