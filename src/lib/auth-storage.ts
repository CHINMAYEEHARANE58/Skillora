import type { AuthResponse, AuthUser } from "../types/auth";

const accessTokenKey = "skillora-access-token";
const refreshTokenKey = "skillora-refresh-token";
const userKey = "skillora-user";

export function getAccessToken() {
  return window.localStorage.getItem(accessTokenKey);
}

export function getRefreshToken() {
  return window.localStorage.getItem(refreshTokenKey);
}

export function getStoredUser(): AuthUser | null {
  const user = window.localStorage.getItem(userKey);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    console.warn("[Skillora Auth] Stored user payload was invalid and has been cleared.");
    clearAuthSession();
    return null;
  }
}

export function persistAuthSession(session: AuthResponse) {
  console.info("[Skillora Auth] Persisting auth session", {
    userId: session.user.id,
    email: session.user.email,
    roles: session.user.roles,
  });
  window.localStorage.setItem(accessTokenKey, session.accessToken);
  window.localStorage.setItem(refreshTokenKey, session.refreshToken);
  window.localStorage.setItem(userKey, JSON.stringify(session.user));
}

export function clearAuthSession() {
  console.info("[Skillora Auth] Clearing auth session");
  window.localStorage.removeItem(accessTokenKey);
  window.localStorage.removeItem(refreshTokenKey);
  window.localStorage.removeItem(userKey);
}
