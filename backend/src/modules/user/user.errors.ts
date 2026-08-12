import { AppError } from "../../errors/app.error.js";

export class UserNotFoundError extends AppError {
  constructor() {
    super(404, "User Not found");
  }
}
