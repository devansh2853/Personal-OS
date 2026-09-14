import { Types } from "mongoose";
import { ExerciseImportData } from "./importers/exercise-import.types.js";
import { exerciseModel } from "./models/exercise.model.js";
import { ExerciseReference, ExerciseWithReferences } from "./exercise.dtos.js";

export class ExerciseRepository {
  public async bulkUpsert(exercises: ExerciseImportData[]): Promise<void> {
    if (exercises.length == 0) {
      return;
    }
    await exerciseModel.bulkWrite(
      exercises.map((exercise) => ({
        updateOne: {
          filter: {
            sourceProvider: exercise.sourceProvider,
            sourceId: exercise.sourceId,
          },
          update: {
            $set: exercise,
          },
          upsert: true,
        },
      })),
    );
  }

  public async findById(
    id: Types.ObjectId,
  ): Promise<ExerciseWithReferences | null> {
    const exercise = await exerciseModel
      .findById(id)
      .populate<{
        primaryMuscleGroupIds: ExerciseReference[];
      }>("primaryMuscleGroupIds")
      .populate<{
        secondaryMuscleGroupIds: ExerciseReference[];
      }>("secondaryMuscleGroupIds")
      .populate<{ equipmentIds: ExerciseReference[] }>("equipmentIds")
      .lean()
      .exec();

    if (!exercise) return null;

    const {
      primaryMuscleGroupIds,
      secondaryMuscleGroupIds,
      equipmentIds,
      ...rest
    } = exercise;

    return {
      ...rest,
      primaryMuscleGroups: primaryMuscleGroupIds,
      secondaryMuscleGroups: secondaryMuscleGroupIds,
      equipment: equipmentIds,
    } satisfies ExerciseWithReferences;
  }
}
