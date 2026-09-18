import { Types } from "mongoose";
import { AppError } from "../../../errors/app.error.js";
import { EquipmentDocument } from "./equipment.model.js";
import { EquipmentRepository } from "./equipment.repository.js";
import { EquipmentResponseDTO } from "./equipment.dtos.js";

export class EquipmentService {
  constructor(private readonly equipmentRepository: EquipmentRepository) {}

  public async getEquipmentById(
    id: Types.ObjectId,
  ): Promise<EquipmentResponseDTO> {
    const equipment: EquipmentDocument | null =
      await this.equipmentRepository.findById(id);
    if (!equipment) {
      throw new AppError(404, "Equipment Not Found");
    }
    return {
      id: equipment._id.toString(),
      displayName: equipment.displayName,
    };
  }

  public async getEquipments(): Promise<EquipmentResponseDTO[]> {
    const equipments: EquipmentDocument[] =
      await this.equipmentRepository.findAll();
    return equipments.map((equipment) => ({
      id: equipment._id.toString(),
      displayName: equipment.displayName,
    }));
  }
}
