import { BaseEntity, TimestampFields, BaseQueryParams, CreateInput, UpdateInput } from '../common';

export type UserRole = "user" | "admin";

export interface User extends BaseEntity {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  userName: string | null;
  password: string | null;
}

export type CreateUser = CreateInput<User> & { password: string };

export type UpdateUser = UpdateInput<User>;

export interface UserProfile extends User {
  stats: {
    totalDeliveries: number;
    totalSentParcels: number;
    averageRating: number;
    greenPoints: number;
    badges: number;
  };
}

export interface Session extends TimestampFields {
  id: string;
  expiresAt: Date;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  impersonatedBy: string | null;
}

export interface Account extends TimestampFields {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
}

export interface Verification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface RateLimit {
  id: string;
  key: string | null;
  count: number | null;
  lastRequest: number | null;
}

export interface UserQueryParams extends BaseQueryParams {
  role: UserRole;
  banned: boolean;
  search: string;
}