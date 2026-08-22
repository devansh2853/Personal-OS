import { randomBytes } from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";

export const generateRefreshToken = (): string => {
  const token = randomBytes(32).toString("base64url");

  return token;
};

export const generateAccessToken = (userId: Types.ObjectId): string => {
  const payload = {
    sub: userId,
  };
  const secret: string | undefined = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT secret is not configured");
  }
  const options: SignOptions = {
    expiresIn: "30m",
  };
  const accessToken: string = jwt.sign(payload, secret, options);
  return accessToken;
};
