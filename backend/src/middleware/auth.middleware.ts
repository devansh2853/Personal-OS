import { NextFunction, Request, Response } from "express";
import { InvalidCredentialsError } from "../modules/auth/auth.errors.js";
import jwt from "jsonwebtoken";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const accessToken =
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
    const decodedToken = jwt.verify(accessToken, secret);

    if (typeof decodedToken === "string" || !decodedToken.sub) {
      throw new Error("Invalid JWT payload");
    }
    req.userId = decodedToken.sub;
    req.sessionId = decodedToken.sid;
    next();
  } catch (error) {
    throw new InvalidCredentialsError();
  }
};
