import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { RegisterRequestDTO } from "./auth.dtos.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}
  async register(
    req: Request<{}, {}, RegisterRequestDTO>,
    res: Response,
  ): Promise<void> {
    await this.authService.register(req.body);
    res.sendStatus(201);
  }
}
