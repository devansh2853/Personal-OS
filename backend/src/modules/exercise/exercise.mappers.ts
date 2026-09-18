import {
  ExerciseDetailResponseDTO,
  ExerciseListItemResponseDTO,
  ExerciseListItemWithReferences,
  ExerciseReference,
  ExerciseReferenceDTO,
  ExerciseWithReferences,
} from "./exercise.dtos.js";

export const toExerciseReferenceDTO = (
  exerciseReference: ExerciseReference,
): ExerciseReferenceDTO => ({
  id: exerciseReference._id.toString(),
  name: exerciseReference.name,
  displayName: exerciseReference.displayName,
});

export const toExerciseDetailResponseDTO = (
  exercise: ExerciseWithReferences,
): ExerciseDetailResponseDTO => ({
  id: exercise._id.toString(),
  name: exercise.name,

  primaryMuscleGroups: exercise.primaryMuscleGroups.map(
    (muscleGroup: ExerciseReference) => toExerciseReferenceDTO(muscleGroup),
  ),
  secondaryMuscleGroups: exercise.secondaryMuscleGroups.map(
    (muscleGroup: ExerciseReference) => toExerciseReferenceDTO(muscleGroup),
  ),
  equipment: exercise.equipment.map((equipment: ExerciseReference) =>
    toExerciseReferenceDTO(equipment),
  ),

  force: exercise.force,
  level: exercise.level,
  mechanic: exercise.mechanic,
  category: exercise.category,

  instructions: exercise.instructions,
  weightType: exercise.weightType,

  imageUrls: exercise.imageUrls,
  instructionalVideoUrl: exercise.instructionalVideoUrl,
});

export const toExerciseListResponseDTO = (
  exercise: ExerciseListItemWithReferences,
): ExerciseListItemResponseDTO => {
  return {
    id: exercise._id.toString(),
    name: exercise.name,
    level: exercise.level,
    category: exercise.category,
    primaryMuscleGroups: exercise.primaryMuscleGroups,
    equipment: exercise.equipment,
  };
};
