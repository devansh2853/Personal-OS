import { toUserCreationDTO, toUserResponseDTO } from "../user/user.mapper.js";
import { UserDocument } from "../user/user.model.js";
import { UserRepository } from "../user/user.repository.js";
import {
  LoginRequestDTO,
  LoginResponseDTO,
  RefreshResponseDTO,
  RegisterRequestDTO,
  VerifyEmailRequestDTO,
} from "./auth.dtos.js";
import { InvalidCredentialsError } from "./auth.errors.js";
import {
  toAuthAccountCreationDTO,
  toRefreshTokenCreationDTO,
} from "./auth.mapper.js";
import { AuthDocument, refreshTokenDocument } from "./auth.model.js";
import { AuthRepository, RefreshTokenRepository } from "./auth.repository.js";
import { hashSecret, matchSecret } from "../../utils/hash.js";
import {
  generateAccessToken,
  generateEmailVerificationToken,
  generateRefreshToken,
} from "../../utils/token.js";
import { Types } from "mongoose";
import { EmailService } from "../../utils/email/email.service.js";
import { AppError } from "../../errors/app.error.js";
import { TransactionManager } from "../../config/transaction.manager.js";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly emailService: EmailService,
    private readonly transactionManager: TransactionManager,
  ) {}

  async register(registrationDetails: RegisterRequestDTO): Promise<void> {
    //find by email
    const existingAccount: AuthDocument | null =
      await this.authRepository.findByEmail(registrationDetails.email);

    if (existingAccount) {
      throw new AppError(409, "An Account with this email already exists");
    }

    //Password hash
    const passwordHash: string = await hashSecret(registrationDetails.password);

    //Create Email Verification Token
    const emailVerificationToken = generateEmailVerificationToken();
    const emailVerificationTokenHash = await hashSecret(emailVerificationToken);
    const emailVerificationTokenExpiresAt: Date = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    const user: UserDocument = await this.transactionManager.execute(
      async (session) => {
        const createdUser: UserDocument = await this.userRepository.create(
          toUserCreationDTO(registrationDetails),
          session,
        );

        const userId: Types.ObjectId = createdUser._id;
        await this.authRepository.create(
          toAuthAccountCreationDTO(
            registrationDetails,
            userId,
            passwordHash,
            emailVerificationTokenHash,
            emailVerificationTokenExpiresAt,
          ),
          session,
        );
        return createdUser;
      },
    );

    await this.emailService.sendVerificationEmail(
      registrationDetails.email,
      emailVerificationToken,
      user._id.toString(),
    );
    return;
  }

  async login(loginDetails: LoginRequestDTO): Promise<LoginResponseDTO> {
    const authAccount: AuthDocument | null =
      await this.authRepository.findByEmail(loginDetails.email);
    if (!authAccount) {
      throw new AppError(401, "The given credentials are incorrect");
    }

    const passwordMatch: boolean = await matchSecret(
      authAccount.passwordHash,
      loginDetails.password,
    );

    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }
    if (!authAccount.isVerified) {
      throw new AppError(401, "The Email is not verified for this account");
    }

    const user: UserDocument | null = await this.userRepository.findById(
      authAccount.userId,
    );
    if (!user) {
      throw new AppError(404, "User Not Found");
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

  async logout(
    userId: Types.ObjectId,
    sessionId: Types.ObjectId,
  ): Promise<void> {
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
  ): Promise<RefreshResponseDTO> {
    const refreshToken: refreshTokenDocument | null =
      await this.refreshTokenRepository.findById(sessionId);

    if (!refreshToken) {
      throw new InvalidCredentialsError();
    }

    if (refreshToken.expiresAt.getTime() <= Date.now()) {
      await this.refreshTokenRepository.deleteById(sessionId);
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
      throw new AppError(
        500,
        "There was an internal error in creating a new refresh token",
      );
    }

    const createdAccessToken: string = generateAccessToken(authAccount.userId);

    return {
      updatedAccessToken: createdAccessToken,
      updatedRefreshToken: `${updatedRefreshToken._id.toString()}.${updatedRefreshTokenString}`,
    };
  }

  async verifyEmail(
    emailVerificationDetails: VerifyEmailRequestDTO,
  ): Promise<void> {
    const token = emailVerificationDetails.token;

    if (!Types.ObjectId.isValid(emailVerificationDetails.userId)) {
      throw new AppError(400, "Invalid User ID");
    }

    const userId = new Types.ObjectId(emailVerificationDetails.userId);
    const authAccount: AuthDocument | null =
      await this.authRepository.findByUserId(userId);

    if (!authAccount) {
      throw new AppError(400, "Account Not Found");
    }

    if (authAccount.isVerified) {
      return;
    }

    const hashedToken = authAccount.emailVerificationTokenHash;
    const emailVerificationTokenExpiresAt =
      authAccount.emailVerificationTokenExpiresAt;
    if (!hashedToken || !emailVerificationTokenExpiresAt) {
      throw new AppError(400, "Invalid Verification Token");
    }

    if (emailVerificationTokenExpiresAt.getTime() <= Date.now()) {
      await this.regenerateEmailVerificationToken(authAccount);

      throw new AppError(400, "Verification Token Expired");
    }

    if (!(await matchSecret(hashedToken, token))) {
      throw new AppError(400, "Invalid Verification Token");
    }

    await this.authRepository.verifyEmail(authAccount._id);
  }

  private async regenerateEmailVerificationToken(
    authAccount: AuthDocument,
  ): Promise<void> {
    const rawToken = generateEmailVerificationToken();
    const tokenHash = await hashSecret(rawToken);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.authRepository.updateEmailVerificationTokenById(
      authAccount._id,
      tokenHash,
      expiresAt,
    );

    await this.emailService.sendVerificationEmail(
      authAccount.email,
      rawToken,
      authAccount.userId.toString(),
    );
  }
}
