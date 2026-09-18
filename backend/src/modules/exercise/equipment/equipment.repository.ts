import { Types } from "mongoose";
import {
  EquipmentDocument,
  equipmentModel,
} from "../models/equipment.model.js";

export class EquipmentRepository {
  public async findById(id: Types.ObjectId): Promise<EquipmentDocument | null> {
    return equipmentModel.findById(id);
  }

  public async findAll(): Promise<EquipmentDocument[]> {
    return equipmentModel.find();
  }
}
