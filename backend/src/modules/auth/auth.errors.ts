import { AppError } from "../../errors/app.error.js";

export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super(409, "Email Already Exists");
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(401, "The given credentials are incorrect");
  }
}

export class EmailNotVerifiedError extends AppError {
  constructor() {
    super(401, "The Email is not verified for this account");
  }
}
