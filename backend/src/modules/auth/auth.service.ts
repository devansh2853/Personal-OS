import { UserNotFoundError } from "../user/user.errors.js";
import { toUserCreationDTO } from "../user/user.mapper.js";
import { UserDocument } from "../user/user.model.js";
import { UserRepository } from "../user/user.repository.js";
import { LoginRequestDTO, RegisterRequestDTO } from "./auth.dtos.js";
import { EmailAlreadyExistsError } from "./auth.errors.js";
import {
  toAuthAccountCreationDTO,
  toRefreshTokenCreationDTO,
} from "./auth.mapper.js";
import { AuthDocument, refreshTokenDocument } from "./auth.model.js";
import { AuthRepository, RefreshTokenRepository } from "./auth.repository.js";
import { hashSecret, matchSecret } from "./utils/hash.js";
import { generateRefreshToken } from "./utils/token.js";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
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
    const passwordHash: string = await hashSecret(registrationDetails.password);
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

  async login(loginDetails: LoginRequestDTO) {
    const authAccount: AuthDocument | null =
      await this.authRepository.findByEmail(loginDetails.email);
    if (!authAccount) {
      throw new UserNotFoundError();
    }

    const passwordMatch: boolean = await matchSecret(
      authAccount.passwordHash,
      loginDetails.password,
    );

    if (!passwordMatch) {
      throw new Error();
    }
    if (!authAccount.isVerified) {
      throw new Error();
    }

    const refreshTokenString: string = generateRefreshToken();
    const hashedToken: string = await hashSecret(refreshTokenString);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const authAccountId = authAccount._id.toString();
    const createdRefreshTokenDocument: refreshTokenDocument =
      await this.refreshTokenRepository.create(
        toRefreshTokenCreationDTO(authAccountId, hashedToken, expiresAt),
      );
  }
}
