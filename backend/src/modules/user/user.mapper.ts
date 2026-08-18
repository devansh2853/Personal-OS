import { RegisterRequestDTO } from "../auth/auth.dtos.js";
import { UserCreationDTO, UserResponseDTO } from "./user.dto.js";
import { UserDocument } from "./user.model.js";

export const toUserResponseDTO = (user: UserDocument): UserResponseDTO => {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    heightCm: user.heightCm ?? undefined,
    preferredHeightUnit: user.preferredHeightUnit ?? undefined,
    preferredWeightUnit: user.preferredWeightUnit ?? undefined,
    preferredWaterUnit: user.preferredWaterUnit ?? undefined,
    timeZone: user.timeZone ?? undefined,
    activityLevel: user.activityLevel ?? undefined,
    fitnessGoal: user.fitnessGoal ?? undefined,
    profileSetupCompleted: user.profileSetupCompleted,
  };
};

export const toUserCreationDTO = (
  registrationDetails: RegisterRequestDTO,
): UserCreationDTO => {
  return {
    firstName: registrationDetails.firstName,
    lastName: registrationDetails.lastName,
    dateOfBirth: registrationDetails.dateOfBirth,
    gender: registrationDetails.gender,
  };
};
