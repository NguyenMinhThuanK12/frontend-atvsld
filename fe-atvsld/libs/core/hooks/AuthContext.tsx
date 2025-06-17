"use client";

import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
  useEffect,
} from "react";
import Cookies from "js-cookie";

type PermissionAction = "VIEW" | "CREATE" | "UPDATE" | "DELETE";
type PermissionMap = Partial<Record<PermissionAction, boolean>>;
export type Permissions = Record<string, PermissionMap>;

interface AuthState {
  permissions: Permissions | null;
}

const initialState: AuthState = {
  permissions: null,
};

type Action =
  | { type: "SET_PERMISSIONS"; payload: Permissions }
  | { type: "CLEAR_PERMISSIONS" };

const authReducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case "SET_PERMISSIONS":
      return { ...state, permissions: action.payload };
    case "CLEAR_PERMISSIONS":
      return { ...state, permissions: null };
    default:
      return state;
  }
};

const AuthContext = createContext<
  | {
      state: AuthState;
      dispatch: Dispatch<Action>;
    }
  | undefined
  >(undefined);

  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
      const stored = Cookies.get("permissions");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          dispatch({ type: "SET_PERMISSIONS", payload: parsed });
        } catch (e) {
          console.error("Invalid permissions cookie", e);
        }
      }
    }, []);

    return (
      <AuthContext.Provider value={{ state, dispatch }}>
        {children}
      </AuthContext.Provider>
    );
  };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};


