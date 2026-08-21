import {
  AuthAccountCreationDTO,
  RefreshTokenCreationDTO,
} from "./auth.dtos.js";
import {
  AuthDocument,
  authModel,
  refreshTokenDocument,
  refreshTokenModel,
} from "./auth.model.js";

export class AuthRepository {
  async findByEmail(registeredEmail: string): Promise<AuthDocument | null> {
    const authAccount: AuthDocument | null = await authModel.findOne({
      email: registeredEmail,
    });
    return authAccount;
  }

  async create(authAccountData: AuthAccountCreationDTO): Promise<AuthDocument> {
    const authAccount: AuthDocument = await authModel.create(authAccountData);
    return authAccount;
  }
}

export class RefreshTokenRepository {
  async create(
    refreshTokenData: RefreshTokenCreationDTO,
  ): Promise<refreshTokenDocument> {
    return await refreshTokenModel.create(refreshTokenData);
  }
}
