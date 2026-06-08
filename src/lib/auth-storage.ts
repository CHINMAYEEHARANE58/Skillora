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
  return user ? (JSON.parse(user) as AuthUser) : null;
}

export function persistAuthSession(session: AuthResponse) {
  window.localStorage.setItem(accessTokenKey, session.accessToken);
  window.localStorage.setItem(refreshTokenKey, session.refreshToken);
  window.localStorage.setItem(userKey, JSON.stringify(session.user));
}

export function clearAuthSession() {
  window.localStorage.removeItem(accessTokenKey);
  window.localStorage.removeItem(refreshTokenKey);
  window.localStorage.removeItem(userKey);
}
