import { UserRepository } from "../user/user.repository.js";
import { RegisterRequestDTO } from "./auth.dtos.js";
import { toAuthAccountCreationDTO, toUserCreationDTO } from "./auth.mapper.js";
import { AuthRepository } from "./auth.repository.js";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async register(registrationDetails: RegisterRequestDTO) {
    //find by email
    const existingAccount = await this.authRepository.findByEmail(
      registrationDetails.email,
    );
    if (existingAccount) {
      throw Error("User Already Exists");
    }
    //user create
    const user = await this.userRepository.create(
      toUserCreationDTO(registrationDetails),
    );

    //Password hash
    const passwordHash = "";
    const userId = user._id.toString();

    //auth account create
    const authAccount = await this.authRepository.create(
      toAuthAccountCreationDTO(registrationDetails, userId, passwordHash),
    );
  }
}
