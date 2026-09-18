import { Types } from "mongoose";
import { AppError } from "../../../errors/app.error.js";
import { MuscleGroupDocument } from "./muscle-group.model.js";
import { MuscleGroupRepository } from "./muscle-group.repository.js";
import { MuscleGroupResponseDTO } from "./muscle-group.dtos.js";

export class MuscleGroupService {
  constructor(private readonly muscleGroupRepository: MuscleGroupRepository) {}

  public async getMuscleGroupById(
    id: Types.ObjectId,
  ): Promise<MuscleGroupResponseDTO> {
    const muscleGroup: MuscleGroupDocument | null =
      await this.muscleGroupRepository.findById(id);

    if (!muscleGroup) {
      throw new AppError(404, "Muscle group not found");
    }

    return {
      id: muscleGroup._id.toString(),
      displayName: muscleGroup.displayName,
    };
  }

  public async getMuscleGroups(): Promise<MuscleGroupResponseDTO[]> {
    const muscleGroups: MuscleGroupDocument[] =
      await this.muscleGroupRepository.findAll();

    return muscleGroups.map((muscleGroup) => ({
      id: muscleGroup._id.toString(),
      displayName: muscleGroup.displayName,
    }));
  }
}
