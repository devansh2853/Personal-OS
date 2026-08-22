import { UserNotFoundError } from "../user/user.errors.js";
import { toUserCreationDTO, toUserResponseDTO } from "../user/user.mapper.js";
import { UserDocument } from "../user/user.model.js";
import { UserRepository } from "../user/user.repository.js";
import {
  LoginRequestDTO,
  LoginResponseDTO,
  RegisterRequestDTO,
} from "./auth.dtos.js";
import {
  EmailAlreadyExistsError,
  EmailNotVerifiedError,
  InvalidCredentialsError,
} from "./auth.errors.js";
import {
  toAuthAccountCreationDTO,
  toRefreshTokenCreationDTO,
} from "./auth.mapper.js";
import { AuthDocument, refreshTokenDocument } from "./auth.model.js";
import { AuthRepository, RefreshTokenRepository } from "./auth.repository.js";
import { hashSecret, matchSecret } from "../../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";
import { Types } from "mongoose";

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
    const userId: Types.ObjectId = user._id;

    //auth account create
    try {
      await this.authRepository.create(
        toAuthAccountCreationDTO(registrationDetails, userId, passwordHash),
      );
    } catch (err) {
      console.log(err);
      await this.userRepository.deleteById(user._id);
      throw Error(
        "Error in creating auth account. Deleting the created user account",
      );
    }

    return;
  }

  async login(loginDetails: LoginRequestDTO): Promise<LoginResponseDTO> {
    const authAccount: AuthDocument | null =
      await this.authRepository.findByEmail(loginDetails.email);
    if (!authAccount) {
      throw new InvalidCredentialsError();
    }

    const passwordMatch: boolean = await matchSecret(
      authAccount.passwordHash,
      loginDetails.password,
    );

    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }
    // if (!authAccount.isVerified) {
    //   throw new EmailNotVerifiedError();
    // }

    const user: UserDocument | null = await this.userRepository.findById(
      authAccount.userId,
    );
    if (!user) {
      throw new UserNotFoundError();
    }
    const refreshTokenString: string = generateRefreshToken();
    const hashedToken: string = await hashSecret(refreshTokenString);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const authAccountId = authAccount._id;
    const createdRefreshToken: refreshTokenDocument =
      await this.refreshTokenRepository.create(
        toRefreshTokenCreationDTO(authAccountId, hashedToken, expiresAt),
      );

    const createdAccessToken: string = generateAccessToken(authAccount.userId);

    return {
      user: toUserResponseDTO(user),
      accessToken: createdAccessToken,
      refreshToken: `${createdRefreshToken._id.toString()}.${refreshTokenString}`,
    };
  }

  async logout(userId: Types.ObjectId, sessionId: Types.ObjectId) {
    const authAccount: AuthDocument | null =
      await this.authRepository.findByUserId(userId);
    if (!authAccount) {
      throw new InvalidCredentialsError();
    }
    const refreshToken: refreshTokenDocument | null =
      await this.refreshTokenRepository.findByIdAndAuthAccountId(
        sessionId,
        authAccount._id,
      );

    if (!refreshToken) {
      throw new InvalidCredentialsError();
    }

    await this.refreshTokenRepository.deleteById(sessionId);
    return;
  }

  async refreshAccessToken(
    sessionId: Types.ObjectId,
    providedRefreshToken: string,
  ) {
    const refreshToken: refreshTokenDocument | null =
      await this.refreshTokenRepository.findById(sessionId);

    if (!refreshToken) {
      throw new InvalidCredentialsError();
    }

    const matchToken: boolean = await matchSecret(
      refreshToken.tokenHash,
      providedRefreshToken,
    );
    if (!matchToken) {
      throw new InvalidCredentialsError();
    }

    const authAccount: AuthDocument | null = await this.authRepository.findById(
      refreshToken.authAccountId,
    );
    if (!authAccount) {
      throw new InvalidCredentialsError();
    }

    const updatedRefreshTokenString = generateRefreshToken();
    const updatedRefreshTokenHash: string = await hashSecret(
      updatedRefreshTokenString,
    );
    const updatedExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const updatedRefreshToken = await this.refreshTokenRepository.updateToken(
      sessionId,
      updatedRefreshTokenHash,
      updatedExpiresAt,
    );

    if (!updatedRefreshToken) {
      throw new Error(
        "There was an internal error in creating a new refresh token",
      );
    }

    const createdAccessToken: string = generateAccessToken(authAccount.userId);

    return {
      updatedAccessToken: createdAccessToken,
      updatedRefreshToken: `${updatedRefreshToken._id.toString()}.${updatedRefreshTokenString}`,
    };
  }
}
