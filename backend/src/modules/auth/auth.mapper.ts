import { UserCreationDTO } from "../user/user.dto.js";
import { RegisterRequestDTO } from "./auth.dtos.js";

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

export const toAuthAccountCreationDTO = (
  registrationDetails: RegisterRequestDTO,
  userId: string,
  passwordHash: string,
) => {
  return {
    email: registrationDetails.email,
    passwordHash: passwordHash,
    userId: userId,
  };
};
