import { Types } from "mongoose";
import { UserCreationDTO } from "./user.dto.js";
import { UserDocument, userModel } from "./user.model.js";

export class UserRepository {
  async findById(userId: Types.ObjectId): Promise<UserDocument | null> {
    const user: UserDocument | null = await userModel.findById(userId);
    return user;
  }

  async deleteById(userId: Types.ObjectId): Promise<UserDocument | null> {
    const deletedUser: UserDocument | null =
      await userModel.findByIdAndDelete(userId);
    return deletedUser;
  }

  async create(userData: UserCreationDTO): Promise<UserDocument> {
    const user: UserDocument = await userModel.create(userData);
    return user;
  }
}
