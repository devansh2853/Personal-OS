import { Request, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../../../errors/app.error.js";
import { MuscleGroupService } from "./muscle-group.service.js";
import { MuscleGroupResponseDTO } from "./muscle-group.dtos.js";

export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  async getMuscleGroup(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      throw new AppError(400, "Invalid muscle group ID");
    }

    const muscleGroup: MuscleGroupResponseDTO =
      await this.muscleGroupService.getMuscleGroupById(new Types.ObjectId(id));

    res.status(200).json(muscleGroup);
  }

  async getMuscleGroups(req: Request, res: Response): Promise<void> {
    const muscleGroups: MuscleGroupResponseDTO[] =
      await this.muscleGroupService.getMuscleGroups();

    res.status(200).json(muscleGroups);
  }
}
