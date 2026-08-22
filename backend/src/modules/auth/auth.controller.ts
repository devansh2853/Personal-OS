import { CookieOptions, Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import {
  LoginRequestDTO,
  RefreshRequestDTO,
  RegisterRequestDTO,
} from "./auth.dtos.js";
import { InvalidCredentialsError } from "./auth.errors.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}
  async register(
    req: Request<{}, {}, RegisterRequestDTO>,
    res: Response,
  ): Promise<void> {
    await this.authService.register(req.body);
    res.sendStatus(201);
  }

  async login(req: Request<{}, {}, LoginRequestDTO>, res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      req.body,
    );
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
  }

  async logout(req: Request, res: Response) {
    const userId = req.userId;
    const sessionId = req.sessionId;
    if (!userId || !sessionId) {
      throw new InvalidCredentialsError();
    }
    await this.authService.logout(userId, sessionId);
    res.clearCookie("accessToken").clearCookie("refreshToken").sendStatus(204);
  }

  async refresh(req: Request<{}, {}, RefreshRequestDTO>, res: Response) {
    const sessionId = req.sessionId;
    const refreshToken = req.refreshToken;

    if (!sessionId || !refreshToken) {
      throw new InvalidCredentialsError();
    }

    const { updatedAccessToken, updatedRefreshToken } =
      await this.authService.refreshAccessToken(sessionId, refreshToken);

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
    };
    res
      .cookie("accessToken", updatedAccessToken, cookieOptions)
      .cookie("refreshToken", updatedRefreshToken)
      .json({
        accessToken: updatedAccessToken,
        refreshToken: updatedRefreshToken,
      });
  }
}
