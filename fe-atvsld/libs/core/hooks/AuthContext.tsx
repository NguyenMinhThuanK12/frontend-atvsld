'use client';

import { Permissions } from "@/libs/shared/atvsld/dto/response/auth/auth-response";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
    permissions: Permissions | null;
    setAuthData: (permissionList: Permissions | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<Permissions | null>(null);

  const setAuthData = (newPermissions: Permissions | null) => {
    setPermissions(newPermissions);
  };

  return (
    <AuthContext.Provider value={{ permissions, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}