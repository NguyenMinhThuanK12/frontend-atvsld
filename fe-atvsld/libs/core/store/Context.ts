import { createContext } from "react";

type PermissionAction = "VIEW" | "CREATE" | "UPDATE" | "DELETE";

type PermissionMap = Partial<Record<PermissionAction, boolean>>;

type Permissions = Record<string, PermissionMap>;

interface AuthContextType {
  permissions: Permissions | null;
  setAuthData: (permissionList: Permissions | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };