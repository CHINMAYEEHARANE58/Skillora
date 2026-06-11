import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
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
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((session: AuthResponse) => {
    persistAuthSession(session);
    setUser(session.user);
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrapSession() {
      const storedUser = getStoredUser();

      if (!storedUser) {
        console.info("[Skillora Auth] No stored session found.");
        if (active) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        console.info("[Skillora Auth] Validating stored session for", storedUser.email);
        const response = await api.get<AuthUser>("/users/me");

        if (active) {
          setUser(response.data);
          console.info("[Skillora Auth] Stored session is valid.");
        }
      } catch (error) {
        console.error("[Skillora Auth] Stored session validation failed.", error);
        clearAuthSession();

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void bootstrapSession();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      console.info("[Skillora Auth] Login submitted", { email: payload.email });
      const response = await api.post<AuthResponse>("/auth/login", payload);
      applySession(response.data);
    },
    [applySession]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      console.info("[Skillora Auth] Signup submitted", { email: payload.email });
      const response = await api.post<AuthResponse>("/auth/register", payload);
      applySession(response.data);
    },
    [applySession]
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        console.info("[Skillora Auth] Logout submitted");
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
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
    }),
    [forgotPassword, isLoading, login, logout, register, resetPassword, user]
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
