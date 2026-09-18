import { UserUpdationRequestDTO } from "./user.dto.js";
import { UserService } from "./user.service.js";
import { Request, Response } from "express";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getUser(req: Request, res: Response): Promise<void> {
    const userId = req.userId;

    const user = await this.userService.getUserById(userId);
    res.status(200).json(user);
  }

  async updateUser(
    req: Request<{}, {}, UserUpdationRequestDTO>,
    res: Response,
  ): Promise<void> {
    const userId = req.userId;
    const updateData = req.body;
    const updatedUser = await this.userService.updateUserById(
      userId,
      updateData,
    );
    res.status(200).json(updatedUser);
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const userId = req.userId;

    await this.userService.deleteUserById(userId);
    res.sendStatus(204);
  }
}
