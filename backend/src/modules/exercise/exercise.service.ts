import { Types } from "mongoose";
import { ExerciseRepository } from "./exercise.repository.js";
import { AppError } from "../../errors/app.error.js";
import {
  ExerciseDetailResponseDTO,
  ExerciseWithReferences,
} from "./exercise.dtos.js";
import { toExerciseDetailResponseDTO } from "./exercise.mappers.js";

export class ExerciseService {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  public async getExerciseById(
    id: Types.ObjectId,
  ): Promise<ExerciseDetailResponseDTO> {
    const exercise: ExerciseWithReferences | null =
      await this.exerciseRepository.findById(id);
    if (!exercise) {
      throw new AppError(404, "Exercise Not Found");
    }
    return toExerciseDetailResponseDTO(exercise);
  }
}
