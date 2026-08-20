import { randomBytes } from "crypto";

export const generateRefreshToken = (): string => {
  const token = randomBytes(32).toString("base64url");
  return token;
};
