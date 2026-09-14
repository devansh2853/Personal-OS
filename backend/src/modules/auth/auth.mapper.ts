import { Types } from "mongoose";
import {
  AuthAccountCreationDTO,
  RefreshTokenCreationDTO,
  RegisterRequestDTO,
} from "./auth.dtos.js";

export const toAuthAccountCreationDTO = (
  registrationDetails: RegisterRequestDTO,
  userId: Types.ObjectId,
  passwordHash: string,
  emailVerificationTokenHash: string,
  emailVerificationTokenExpiresAt: Date,
): AuthAccountCreationDTO => {
  return {
    email: registrationDetails.email,
    passwordHash: passwordHash,
    userId: userId,
    isVerified: false,
    emailVerificationTokenHash,
    emailVerificationTokenExpiresAt,
  };
};

export const toRefreshTokenCreationDTO = (
  authAccountId: Types.ObjectId,
  hashedToken: string,
  expiresAt: Date,
  deviceName?: string,
): RefreshTokenCreationDTO => {
  return {
    authAccountId: authAccountId,
    tokenHash: hashedToken,
    expiresAt: expiresAt,
    deviceName: deviceName,
  };
};
