import { ClientSession, Types } from "mongoose";
import { UserCreationDTO, UserUpdationRequestDTO } from "./user.dto.js";
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

  async create(
    userData: UserCreationDTO,
    session?: ClientSession,
  ): Promise<UserDocument> {
    const [user]: UserDocument[] = await userModel.create([userData], {
      session,
    });
    return user;
  }

  async updateById(
    userId: Types.ObjectId,
    updateData: UserUpdationRequestDTO,
  ): Promise<UserDocument | null> {
    const updatedUser: UserDocument | null = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true },
    );
    return updatedUser;
  }
}
