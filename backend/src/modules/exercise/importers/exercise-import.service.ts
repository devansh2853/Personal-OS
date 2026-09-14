import { ExerciseRepository } from "../exercise.repository.js";
import { equipmentModel } from "../models/equipment.model.js";
import { muscleGroupModel } from "../models/muscle-group.model.js";
import {
  ExerciseReferenceMaps,
  mapExerciseToImportData,
} from "./exercise-import.mapper.js";
import { ExerciseImportData } from "./exercise-import.types.js";
import { ExerciseSourceDTO } from "./exercise-source.dto.js";
import { mapExerciseSource } from "./exercise-source.mapper.js";

export class ExerciseImportService {
  public constructor(private readonly exerciseRepository: ExerciseRepository) {}

  public async importExercises(
    sourceExercises: ExerciseSourceDTO[],
  ): Promise<void> {
    const exerciseReferenceMap: ExerciseReferenceMaps =
      await this.loadReferenceMaps();

    const importExercises: ExerciseImportData[] = sourceExercises.map(
      (exercise) =>
        mapExerciseToImportData(
          mapExerciseSource(exercise),
          exerciseReferenceMap,
        ),
    );
    await this.exerciseRepository.bulkUpsert(importExercises);
  }

  private async loadReferenceMaps(): Promise<ExerciseReferenceMaps> {
    const [muscleGroups, equipment] = await Promise.all([
      muscleGroupModel.find({ isActive: true }).lean(),
      equipmentModel.find({ isActive: true }).lean(),
    ]);
    return {
      muscleGroups: new Map(
        muscleGroups.map((muscleGroup) => [muscleGroup.name, muscleGroup._id]),
      ),
      equipment: new Map(
        equipment.map((equipmentItem) => [
          equipmentItem.name,
          equipmentItem._id,
        ]),
      ),
    };
  }
}
