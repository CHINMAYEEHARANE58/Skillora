import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { api } from "../lib/api";
import {
  clearAuthSession,
  getRefreshToken,
  getStoredUser,
  persistAuthSession,
} from "../lib/auth-storage";
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from "../types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string | null>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const applySession = useCallback((session: AuthResponse) => {
    persistAuthSession(session);
    setUser(session.user);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await api.post<AuthResponse>("/auth/login", payload);
      applySession(response.data);
    },
    [applySession]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await api.post<AuthResponse>("/auth/register", payload);
      applySession(response.data);
    },
    [applySession]
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } finally {
      clearAuthSession();
      setUser(null);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const response = await api.post<{ resetToken: string | null }>("/auth/password/forgot", {
      email,
    });
    return response.data.resetToken;
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    await api.post("/auth/password/reset", { token, newPassword });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
    }),
    [forgotPassword, login, logout, register, resetPassword, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
