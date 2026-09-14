import { ExerciseSourceDTO } from "./exercise-source.dto.js";

export const mapExerciseSource = (
  source: ExerciseSourceDTO,
): ExerciseSourceDTO => ({
  id: source.id.trim(),
  name: source.name.trim(),
  force: source.force,
  level: source.level,
  mechanic: source.mechanic,
  equipment: source.equipment,
  primaryMuscles: source.primaryMuscles.map((muscle) =>
    muscle.trim().toLowerCase(),
  ),
  secondaryMuscles: source.secondaryMuscles.map((muscle) =>
    muscle.trim().toLowerCase(),
  ),
  instructions: source.instructions.map((instruction) => instruction.trim()),
  category: source.category.trim().toLowerCase(),
  images: source.images.map((image) => image.trim()),
});
