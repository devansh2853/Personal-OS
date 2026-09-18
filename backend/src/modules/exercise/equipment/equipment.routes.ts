import { Router } from "express";
import { EquipmentController } from "./equipment.controller.js";
import { EquipmentRepository } from "./equipment.repository.js";
import { EquipmentService } from "./equipment.service.js";

const equipmentRoutes = Router();

const equipmentRepository = new EquipmentRepository();
const equipmentService = new EquipmentService(equipmentRepository);
const equipmentController = new EquipmentController(equipmentService);
equipmentRoutes.get(
  "/",
  equipmentController.getEquipments.bind(equipmentController),
);
equipmentRoutes.get(
  "/:id",
  equipmentController.getEquipment.bind(equipmentController),
);

export default equipmentRoutes;
