import { AppError } from "../../errors/app.error.js";

export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super(409, "Email Already Exists");
  }
}
