import { Router } from "express";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";
import { UserUpdationRequestScehma } from "./user.validation.js";
import { validate } from "../../middleware/validate.js";

const userRoutes = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRoutes.get("/:userId", userController.getUser.bind(userController));
userRoutes.delete("/:userId", userController.deleteUser.bind(userController));
userRoutes.patch("/:userId", validate(UserUpdationRequestScehma), userController.updateUser.bind(userController));

export default userRoutes;
