import { Gender } from "../user/user.enums.js";

export type RegisterRequestDTO = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
};

export type AuthAccountCreationDTO = {
  email: string;
  passwordHash: string;
  userId: string;
  isVerified: boolean;
};

export type LoginRequestDTO = {
  email: string;
  password: string;
};

export type RefreshTokenCreationDTO = {
  authAccountId: string;
  tokenHash: string;
  expiresAt: Date;
  deviceName?: string;
};
