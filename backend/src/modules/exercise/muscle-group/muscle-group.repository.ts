import { Types } from "mongoose";
import { MuscleGroupDocument, muscleGroupModel } from "./muscle-group.model.js";

export class MuscleGroupRepository {
  public async findById(
    id: Types.ObjectId,
  ): Promise<MuscleGroupDocument | null> {
    return muscleGroupModel.findById(id);
  }

  public async findAll(): Promise<MuscleGroupDocument[]> {
    return muscleGroupModel.find();
  }
}
