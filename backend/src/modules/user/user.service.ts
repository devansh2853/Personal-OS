import { UserResponseDTO } from "./user.dto.js";
import { UserNotFoundError } from "./user.errors.js";
import { toUserResponseDTO } from "./user.mapper.js";
import { UserDocument } from "./user.model.js";
import { UserRepository } from "./user.repository.js";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getUserById(userId: string): Promise<UserResponseDTO> {
    const user: UserDocument | null =
      await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    const userResponse = toUserResponseDTO(user);
    return userResponse;
  }
}
