import { Types } from "mongoose";
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

  async findByUserId(userId: Types.ObjectId): Promise<AuthDocument | null> {
    const authAccount: AuthDocument | null = await authModel.findOne({
      userId: userId,
    });
    return authAccount;
  }
}

export class RefreshTokenRepository {
  async create(
    refreshTokenData: RefreshTokenCreationDTO,
  ): Promise<refreshTokenDocument> {
    return await refreshTokenModel.create(refreshTokenData);
  }

  async findByIdAndAuthAccountId(
    id: Types.ObjectId,
    authAccountId: Types.ObjectId,
  ): Promise<refreshTokenDocument | null> {
    return await refreshTokenModel.findOne({
      _id: id,
      authAccountId: authAccountId,
    });
  }

  async deleteById(id: Types.ObjectId) {
    await refreshTokenModel.findByIdAndDelete(id);
  }
}
