import { UserDocument, userModel } from "./user.model.js";

export class UserRepository {
  async findById(userId: string): Promise<UserDocument | null> {
    const user = await userModel.findById(userId);
    return user;
  }
}
