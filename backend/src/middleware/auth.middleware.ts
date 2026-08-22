import { NextFunction, Request, Response } from "express";
import { InvalidCredentialsError } from "../modules/auth/auth.errors.js";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const accessToken: string =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new InvalidCredentialsError();
  }

  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("Access token secret is not set");
  }
  try {
    const decodedAccessToken = jwt.verify(accessToken, secret);

    if (typeof decodedAccessToken === "string" || !decodedAccessToken.sub) {
      throw new Error("Invalid JWT payload");
    }
    if (!Types.ObjectId.isValid(decodedAccessToken.sub)) {
      throw new InvalidCredentialsError();
    }
    req.userId = new Types.ObjectId(decodedAccessToken.sub);
    next();
  } catch (error) {
    throw new InvalidCredentialsError();
  }
};

export const extractRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken: string =
    req.cookies?.refreshToken || req.header("X-Refresh-Token");

  if (!refreshToken) {
    throw new InvalidCredentialsError();
  }
  const [sessionIdString, rawToken] = refreshToken.split(".");

  if (
    !sessionIdString ||
    !rawToken ||
    !Types.ObjectId.isValid(sessionIdString)
  ) {
    throw new InvalidCredentialsError();
  }

  req.sessionId = new Types.ObjectId(sessionIdString);
  req.refreshToken = rawToken;

  next();
};
