import { UserService } from "./user.service.js";
import { Request, Response } from "express";

type UserParams = {
  userId: string;
};

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getUser(req: Request<UserParams>, res: Response): Promise<void> {
    const userId = req.params.userId;

    const user = await this.userService.getUserById(userId);
    res.status(200).json(user);
  }

  async deleteUser(req: Request<UserParams>, res: Response): Promise<void> {
    const userId = req.params.userId;

    await this.userService.deleteUserById(userId);
    res.sendStatus(204);
  }
}
