import { Gender } from "../user/user.enums.js";

export type RegisterRequestDTO = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
};

export type AuthAccountCreationDTO = {
  email: string;
  passwordHash: string;
  userId: string;
};
