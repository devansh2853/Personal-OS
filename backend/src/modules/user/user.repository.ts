import { UserDocument, userModel } from "./user.model.js";

export class UserRepository {
  async findById(userId: string): Promise<UserDocument | null> {
    const user: UserDocument | null = await userModel.findById(userId);
    return user;
  }

  async deleteById(userId: string): Promise<UserDocument | null> {
    const deletedUser: UserDocument | null =
      await userModel.findByIdAndDelete(userId);
    return deletedUser;
  }
}
