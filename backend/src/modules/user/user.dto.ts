import { WaterUnit, WeightUnit } from "../../global.enum.js";
import {
  ActivityLevel,
  FitnessGoal,
  Gender,
  HeightUnit,
} from "./user.enums.js";

export type UserResponseDTO = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  heightCm?: number;
  preferredHeightUnit?: HeightUnit;
  preferredWeightUnit?: WeightUnit;
  preferredWaterUnit?: WaterUnit;
  timeZone?: string;
  activityLevel?: ActivityLevel;
  fitnessGoal?: FitnessGoal;
  profileSetupCompleted: boolean;
};

export type UserCreationDTO = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
};

export type UserUpdationRequestDTO = {
    firstName?: string,
    lastName?: string,
    dateOfBirth?: Date,
    gender?: Gender,
    heightCm?: number,
    preferredHeightUnit?: HeightUnit,
    preferredWeightUnit?: WeightUnit,
    preferredWaterUnit?: WaterUnit,
    timeZone?: string,
    activityLevel?: ActivityLevel,
    fitnessGoal?: FitnessGoal,
}
