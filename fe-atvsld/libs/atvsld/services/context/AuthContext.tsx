'use client';

import { createContext, ReactNode, useContext, useState } from "react";
import type { Permissions as AppPermissions } from "@/libs/shared/atvsld/dto/response/auth/userAuthenticated-response";

type AuthContextType = {
  permissions?: AppPermissions;
  setAuthData: (permissionList: AppPermissions) => void;
  clearAuthData: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [permissions, setPermissions] = useState<AppPermissions>();

    const setAuthData = (permissionList: AppPermissions) => {
      setPermissions(permissionList);
    };

    const clearAuthData = () => {
        setPermissions(undefined);
    };

    return (
        <AuthContext.Provider value={{ permissions, setAuthData, clearAuthData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}