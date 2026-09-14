import { Types } from "mongoose";

import { WeightType } from "../exercise.enums.js";
import { ExerciseSourceDTO } from "./exercise-source.dto.js";
import { ExerciseImportData } from "./exercise-import.types.js";
import {
  parseExerciseCategory,
  parseExerciseForce,
  parseExerciseLevel,
  parseExerciseMechanic,
} from "./exercise-import.validation.js";

const SOURCE_PROVIDER = "free-exercise-db";

export interface ExerciseReferenceMaps {
  muscleGroups: Map<string, Types.ObjectId>;
  equipment: Map<string, Types.ObjectId>;
}

const determineWeightType = (equipment: string | null): WeightType => {
  if (equipment === null || equipment === "body only") {
    return WeightType.BODYWEIGHT;
  }

  if (equipment === "machine") {
    return WeightType.MACHINE;
  }

  if (equipment === "bands") {
    return WeightType.RESISTANCE_BAND;
  }

  return WeightType.EXTERNAL_WEIGHT;
};

const resolveMuscleGroupIds = (
  muscles: string[],
  muscleGroups: Map<string, Types.ObjectId>,
): Types.ObjectId[] => {
  return muscles.map((muscle) => {
    const muscleGroupId = muscleGroups.get(muscle);

    if (!muscleGroupId) {
      throw new Error(`Unknown muscle group: ${muscle}`);
    }

    return muscleGroupId;
  });
};

const resolveEquipmentId = (
  equipment: string | null,
  equipmentMap: Map<string, Types.ObjectId>,
): Types.ObjectId[] => {
  if (equipment === null) {
    return [];
  }

  const equipmentId = equipmentMap.get(equipment);

  if (!equipmentId) {
    throw new Error(`Unknown equipment: ${equipment}`);
  }

  return [equipmentId];
};

export const mapExerciseToImportData = (
  source: ExerciseSourceDTO,
  references: ExerciseReferenceMaps,
): ExerciseImportData => {
  return {
    name: source.name,

    primaryMuscleGroupIds: resolveMuscleGroupIds(
      source.primaryMuscles,
      references.muscleGroups,
    ),

    secondaryMuscleGroupIds: resolveMuscleGroupIds(
      source.secondaryMuscles,
      references.muscleGroups,
    ),

    equipmentIds: resolveEquipmentId(source.equipment, references.equipment),

    force: parseExerciseForce(source.force),

    level: parseExerciseLevel(source.level),

    mechanic: parseExerciseMechanic(source.mechanic),

    category: parseExerciseCategory(source.category),

    instructions: source.instructions,

    weightType: determineWeightType(source.equipment),

    imageUrls: source.images,

    instructionalVideoUrl: null,

    sourceProvider: SOURCE_PROVIDER,

    sourceId: source.id,

    isActive: true,
  };
};
