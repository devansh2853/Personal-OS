import { CookieOptions, Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { LoginRequestDTO, RegisterRequestDTO } from "./auth.dtos.js";

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
}
