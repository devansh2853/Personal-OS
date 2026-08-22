import { Router } from "express";
import { AuthRepository, RefreshTokenRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { UserRepository } from "../user/user.repository.js";
import {
  extractRefreshToken,
  verifyJWT,
} from "../../middleware/auth.middleware.js";

const authRoutes = Router();

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const authService = new AuthService(
  authRepository,
  userRepository,
  refreshTokenRepository,
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

export default authRoutes;
