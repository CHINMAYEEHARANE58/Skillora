export type Role = "USER" | "ADMIN";

export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  roles: Role[];
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};
