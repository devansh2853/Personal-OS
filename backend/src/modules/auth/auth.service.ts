import { toUserCreationDTO } from "../user/user.mapper.js";
import { UserDocument } from "../user/user.model.js";
import { UserRepository } from "../user/user.repository.js";
import { RegisterRequestDTO } from "./auth.dtos.js";
import { EmailAlreadyExistsError } from "./auth.errors.js";
import { toAuthAccountCreationDTO } from "./auth.mapper.js";
import { AuthDocument } from "./auth.model.js";
import { AuthRepository } from "./auth.repository.js";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async register(registrationDetails: RegisterRequestDTO): Promise<void> {
    //find by email
    const existingAccount: AuthDocument | null =
      await this.authRepository.findByEmail(registrationDetails.email);
    if (existingAccount) {
      throw EmailAlreadyExistsError;
    }
    //user create
    const user: UserDocument = await this.userRepository.create(
      toUserCreationDTO(registrationDetails),
    );

    //Password hash
    const passwordHash: string = "something";
    const userId: string = user._id.toString();

    //auth account create
    try {
      await this.authRepository.create(
        toAuthAccountCreationDTO(registrationDetails, userId, passwordHash),
      );
    } catch (err) {
      console.log(err);
      await this.userRepository.deleteById(user._id.toString());
      throw Error(
        "Error in creating auth account. Deleting the created user account",
      );
    }

    return;
  }
}
