import {
  ExerciseCategory,
  ExerciseForce,
  ExerciseLevel,
  ExerciseMechanic,
} from "../exercise.enums.js";

const isEnumValue = <T extends Record<string, string>>(
  enumObject: T,
  value: string,
): value is T[keyof T] => {
  return Object.values(enumObject).includes(value);
};

export const parseExerciseForce = (
  value: string | null,
): ExerciseForce | null => {
  if (value === null) {
    return null;
  }

  if (!isEnumValue(ExerciseForce, value)) {
    throw new Error(`Invalid exercise force: ${value}`);
  }

  return value;
};

export const parseExerciseLevel = (value: string): ExerciseLevel => {
  if (!isEnumValue(ExerciseLevel, value)) {
    throw new Error(`Invalid exercise level: ${value}`);
  }

  return value;
};

export const parseExerciseMechanic = (
  value: string | null,
): ExerciseMechanic | null => {
  if (value === null) {
    return null;
  }

  if (!isEnumValue(ExerciseMechanic, value)) {
    throw new Error(`Invalid exercise mechanic: ${value}`);
  }

  return value;
};

export const parseExerciseCategory = (value: string): ExerciseCategory => {
  if (!isEnumValue(ExerciseCategory, value)) {
    throw new Error(`Invalid exercise category: ${value}`);
  }

  return value;
};
