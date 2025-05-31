export interface Role {
    id: string;
    code: string; // Mã vai trò
    name: string; // Tên vai trò
    permissionIds: string[]; // Danh sách ID quyền đã được gán cho vai trò này
}