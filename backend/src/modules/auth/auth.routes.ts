import { Router } from "express";
import { AuthRepository, RefreshTokenRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { UserRepository } from "../user/user.repository.js";
import {
  extractRefreshToken,
  verifyJWT,
} from "../../middleware/auth.middleware.js";
import { EmailService } from "../email/email.service.js";
import { ResendEmailProvider } from "../email/providers/resend.email.provider.js";
import { AppError } from "../../errors/app.error.js";
import { GmailEmailProvider } from "../email/providers/gmail.email.provider.js";
import { TransactionManager } from "../../config/transaction.manager.js";

const authRoutes = Router();

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const transactionManager = new TransactionManager();

const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
if (!GMAIL_APP_PASSWORD) {
  throw new AppError(500, "Gmail App Password Not found");
}
const emailService = new EmailService(
  new GmailEmailProvider("devanshbansal2021@gmail.com", GMAIL_APP_PASSWORD),
);
const authService = new AuthService(
  authRepository,
  userRepository,
  refreshTokenRepository,
  emailService,
  transactionManager,
);
const authController = new AuthController(authService);

authRoutes.post("/register", authController.register.bind(authController));

authRoutes.post("/login", authController.login.bind(authController));

authRoutes.post(
  "/logout",
  verifyJWT,
  extractRefreshToken,
  authController.logout.bind(authController),
);

authRoutes.post(
  "/refresh",
  extractRefreshToken,
  authController.refresh.bind(authController),
);

authRoutes.post(
  "/verify-email",
  authController.verifyEmail.bind(authController),
);
export default authRoutes;
