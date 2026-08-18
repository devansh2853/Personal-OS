import { AuthAccountCreationDTO, RegisterRequestDTO } from "./auth.dtos.js";

export const toAuthAccountCreationDTO = (
  registrationDetails: RegisterRequestDTO,
  userId: string,
  passwordHash: string,
): AuthAccountCreationDTO => {
  return {
    email: registrationDetails.email,
    passwordHash: passwordHash,
    userId: userId,
    isVerified: false,
  };
};
