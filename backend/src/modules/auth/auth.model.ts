import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const authSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },

    resetPasswordTokenHash: {
      type: String,
    },
    resetPasswordExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const refreshTokenSchema = new Schema(
  {
    authAccountId: {
      type: Schema.Types.ObjectId,
      ref: "authAccount",
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    lastUsedAt: {
      type: Date,
    },
    revokedAt: {
      type: Date,
    },
    deviceName: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const authModel = model("authAccount", authSchema);
export type AuthDocument = HydratedDocument<InferSchemaType<typeof authSchema>>;

export const refreshTokenModel = model("refreshToken", refreshTokenSchema);
export type refreshTokenDocument = HydratedDocument<
  InferSchemaType<typeof refreshTokenSchema>
>;
