import { Types, QueryFilter } from "mongoose";
import { ExerciseImportData } from "./importers/exercise-import.types.js";
import { ExerciseDocument, exerciseModel } from "./exercise.model.js";
import {
  ExerciseFilters,
  ExerciseListItemWithReferences,
  ExerciseReference,
  ExerciseWithReferences,
} from "./exercise.dtos.js";

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

  public async findAll(
    filters: ExerciseFilters,
  ): Promise<ExerciseListItemWithReferences[]> {
    const query: QueryFilter<ExerciseDocument> = {
      isActive: true,
    };
    if (filters.name) {
      query.name = {
        $regex: filters.name,
        $options: "i",
      };
    }

    if (filters.primaryMuscleGroupId) {
      query.primaryMuscleGroupIds = filters.primaryMuscleGroupId;
    }

    if (filters.equipmentId) {
      query.equipmentIds = filters.equipmentId;
    }

    const skip = filters.page * filters.size;

    const fetchedExercises = await exerciseModel
      .find(query)
      .sort({ name: 1, _id: 1 })
      .skip(skip)
      .limit(filters.size)
      .populate<{
        primaryMuscleGroupIds: ExerciseReference[];
      }>("primaryMuscleGroupIds")
      .populate<{ equipmentIds: ExerciseReference[] }>("equipmentIds")
      .lean();
    const exercises: ExerciseListItemWithReferences[] = [];
    for (let exercise of fetchedExercises) {
      const { primaryMuscleGroupIds, equipmentIds, ...rest } = exercise;
      exercises.push({
        ...rest,
        primaryMuscleGroups: primaryMuscleGroupIds,
        equipment: equipmentIds,
      } satisfies ExerciseListItemWithReferences);
    }

    return exercises;
  }
}
