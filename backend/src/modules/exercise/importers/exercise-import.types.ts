import { Types } from "mongoose";

import {
  ExerciseCategory,
  ExerciseForce,
  ExerciseLevel,
  ExerciseMechanic,
  WeightType,
} from "../exercise.enums.js";

export interface ExerciseImportData {
  name: string;

  primaryMuscleGroupIds: Types.ObjectId[];

  secondaryMuscleGroupIds: Types.ObjectId[];

  equipmentIds: Types.ObjectId[];

  force: ExerciseForce | null;

  level: ExerciseLevel;

  mechanic: ExerciseMechanic | null;

  category: ExerciseCategory;

  instructions: string[];

  weightType: WeightType;

  imageUrls: string[];

  instructionalVideoUrl: string | null;

  sourceProvider: string;

  sourceId: string;

  isActive: boolean;
}
