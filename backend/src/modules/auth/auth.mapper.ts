import { Types } from "mongoose";
import {
  AuthAccountCreationDTO,
  RefreshTokenCreationDTO,
  RegisterRequestDTO,
} from "./auth.dtos.js";

export const toAuthAccountCreationDTO = (
  registrationDetails: RegisterRequestDTO,
  userId: string,
  passwordHash: string,
): AuthAccountCreationDTO => {
  return {
    email: registrationDetails.email,
    passwordHash: passwordHash,
    userId: userId,
    isVerified: false,
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
