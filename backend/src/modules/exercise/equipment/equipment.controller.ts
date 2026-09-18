import { Request, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../../../errors/app.error.js";
import { EquipmentService } from "./equipment.service.js";
import { EquipmentResponseDTO } from "./equipment.dtos.js";

export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  async getEquipment(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      throw new AppError(400, "Invalid Equipment id");
    }

    const equipment: EquipmentResponseDTO =
      await this.equipmentService.getEquipmentById(new Types.ObjectId(id));

    res.status(200).json(equipment);
  }

  async getEquipments(req: Request, res: Response): Promise<void> {
    const equipments: EquipmentResponseDTO[] =
      await this.equipmentService.getEquipments();

    res.status(200).json(equipments);
  }
}
