import { Types } from "mongoose";
import { Gender } from "../user/user.enums.js";
import { UserResponseDTO } from "../user/user.dto.js";

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
  userId: Types.ObjectId;
  isVerified: boolean;
  emailVerificationTokenHash: string;
  emailVerificationTokenExpiresAt: Date;
};

export type LoginRequestDTO = {
  email: string;
  password: string;
};

export type RefreshTokenCreationDTO = {
  authAccountId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  deviceName?: string;
};

export type LoginResponseDTO = {
  user: UserResponseDTO;
  accessToken: string;
  refreshToken: string;
};

export type RefreshRequestDTO = {
  refreshToken: string;
};

export type VerifyEmailRequestDTO = {
  userId: string;
  token: string;
};

export type RefreshResponseDTO = {
  updatedAccessToken: string;
  updatedRefreshToken: string;
};
