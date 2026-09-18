import { Router } from "express";
import { MuscleGroupController } from "./muscle-group.controller.js";
import { MuscleGroupService } from "./muscle-group.service.js";
import { MuscleGroupRepository } from "./muscle-group.repository.js";

const muscleGroupRoutes = Router();

const muscleGroupRepository = new MuscleGroupRepository();
const muscleGroupService = new MuscleGroupService(muscleGroupRepository);
const muscleGroupController = new MuscleGroupController(muscleGroupService);

muscleGroupRoutes.get(
  "/",
  muscleGroupController.getMuscleGroups.bind(muscleGroupController),
);

muscleGroupRoutes.get(
  "/:id",
  muscleGroupController.getMuscleGroup.bind(muscleGroupController),
);

export default muscleGroupRoutes;
