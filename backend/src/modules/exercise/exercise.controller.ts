import { Request, Response } from "express";
import { ExerciseService } from "./exercise.service.js";
import { Types } from "mongoose";
import { AppError } from "../../errors/app.error.js";
import {
  ExerciseListItemResponseDTO,
  ExercisesRequestDTO,
} from "./exercise.dtos.js";

export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  async getExercise(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      throw new AppError(400, "Invalid exercise id");
    }

    const exercise = await this.exerciseService.getExerciseById(
      new Types.ObjectId(id),
    );

    res.status(200).json(exercise);
  }

  async getExercises(
    req: Request<{}, {}, {}, ExercisesRequestDTO>,
    res: Response,
  ): Promise<void> {
    const exercises: ExerciseListItemResponseDTO[] =
      await this.exerciseService.getExercisesByFilters(req.query);

    res.status(200).json(exercises);
  }
}
