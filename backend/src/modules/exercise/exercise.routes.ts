import { Router } from "express";
import { ExerciseRepository } from "./exercise.repository.js";
import { ExerciseService } from "./exercise.service.js";
import { ExerciseController } from "./exercise.controller.js";

const exerciseRoutes = Router();

const exerciseRepository = new ExerciseRepository();
const exerciseService = new ExerciseService(exerciseRepository);
const exerciseController = new ExerciseController(exerciseService);
exerciseRoutes.get(
  "/:id",
  exerciseController.getExercise.bind(exerciseController),
);

export default exerciseRoutes;
