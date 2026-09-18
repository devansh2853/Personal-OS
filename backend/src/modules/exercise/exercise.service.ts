import { Types } from "mongoose";
import { ExerciseRepository } from "./exercise.repository.js";
import { AppError } from "../../errors/app.error.js";
import {
  ExerciseDetailResponseDTO,
  ExerciseFilters,
  ExerciseListItemResponseDTO,
  ExerciseListItemWithReferences,
  ExercisesRequestDTO,
  ExerciseWithReferences,
} from "./exercise.dtos.js";
import {
  toExerciseDetailResponseDTO,
  toExerciseListResponseDTO,
} from "./exercise.mappers.js";

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

  public async getExercisesByFilters(
    filters: ExercisesRequestDTO,
  ): Promise<ExerciseListItemResponseDTO[]> {
    const exercises: ExerciseListItemWithReferences[] =
      await this.exerciseRepository.findAll(this.mapRequestToFilters(filters));
    return exercises.map((exercise) => toExerciseListResponseDTO(exercise));
  }

  private mapRequestToFilters(request: ExercisesRequestDTO): ExerciseFilters {
    return {
      name: request.name,
      primaryMuscleGroupId: request.primaryMuscleGroupId
        ? new Types.ObjectId(request.primaryMuscleGroupId)
        : undefined,
      equipmentId: request.equipmentId
        ? new Types.ObjectId(request.equipmentId)
        : undefined,
      page: Number(request.page ?? 0),
      size: Number(request.size ?? 20),
    };
  }
}
