import { Types } from "mongoose";
import { UserResponseDTO, UserUpdationRequestDTO } from "./user.dto.js";
import { toUserResponseDTO } from "./user.mapper.js";
import { UserDocument } from "./user.model.js";
import { UserRepository } from "./user.repository.js";
import { AppError } from "../../errors/app.error.js";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getUserById(userId: Types.ObjectId): Promise<UserResponseDTO> {
    const user: UserDocument | null =
      await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, "User Not found");
    }
    const userResponse = toUserResponseDTO(user);
    return userResponse;
  }

  async updateUserById(
    userId: Types.ObjectId,
    updateData: UserUpdationRequestDTO,
  ): Promise<UserResponseDTO> {
    const updatedUser: UserDocument | null =
      await this.userRepository.updateById(userId, updateData);
    if (!updatedUser) {
      throw new AppError(404, "User Not found");
    }
    const updatedUserResponse = toUserResponseDTO(updatedUser);
    return updatedUserResponse;
  }

  async deleteUserById(userId: Types.ObjectId): Promise<void> {
    const deletedUser = await this.userRepository.deleteById(userId);
    if (!deletedUser) {
      throw new AppError(404, "User Not found");
    }
  }
}
