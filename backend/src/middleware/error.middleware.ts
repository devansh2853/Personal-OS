import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error.js";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  console.log(error);
  res.status(500).json({
    message: "Internal Server Error",
  });
};
