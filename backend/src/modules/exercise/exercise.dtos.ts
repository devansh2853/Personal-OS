import { Types } from "mongoose";
import { ExerciseAttrs } from "./exercise.model.js";

// exercise.dtos.ts
export interface ExerciseReference {
  _id: Types.ObjectId;
  name: string;
  displayName: string;
}

// One populated/domain type. Field names now match the DTO 1:1
// (primaryMuscleGroups / secondaryMuscleGroups / equipment),
// so the mapper below becomes a pure id-stringify, no renames.
type ExercisePublicAttrs = Pick<
  ExerciseAttrs,
  | "name"
  | "force"
  | "level"
  | "mechanic"
  | "category"
  | "instructions"
  | "weightType"
  | "imageUrls"
  | "instructionalVideoUrl"
>;

export type ExerciseWithReferences = ExercisePublicAttrs & {
  _id: Types.ObjectId;
  primaryMuscleGroups: ExerciseReference[];
  secondaryMuscleGroups: ExerciseReference[];
  equipment: ExerciseReference[];
};

export type ExerciseListItemWithReferences = ExercisePublicAttrs & {
  _id: Types.ObjectId;
  primaryMuscleGroups: ExerciseReference[];
  equipment: ExerciseReference[];
};

export interface ExerciseReferenceDTO {
  id: string;
  name: string;
  displayName: string;
}

export type ExerciseDetailResponseDTO = Omit<
  ExerciseWithReferences,
  "_id" | "primaryMuscleGroups" | "secondaryMuscleGroups" | "equipment"
> & {
  id: string;
  primaryMuscleGroups: ExerciseReferenceDTO[];
  secondaryMuscleGroups: ExerciseReferenceDTO[];
  equipment: ExerciseReferenceDTO[];
};

export interface ExercisesRequestDTO {
  name?: string;
  primaryMuscleGroupId?: string;
  equipmentId?: string;
  page?: string;
  size?: string;
}

export interface ExerciseFilters {
  name?: string;
  primaryMuscleGroupId?: Types.ObjectId;
  equipmentId?: Types.ObjectId;
  page: number;
  size: number;
}

export interface ExerciseListItemResponseDTO {
  id: string;
  name: string;
  level: string;
  category: string;
  primaryMuscleGroups: ExerciseReference[];
  equipment: ExerciseReference[];
}
