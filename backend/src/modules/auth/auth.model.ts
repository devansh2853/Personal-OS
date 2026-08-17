import { HydratedDocument, InferSchemaType, Model, Schema } from "mongoose";

const authSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      red: "user",
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

export const authModel = new Model("authAccount", authSchema);
export type AuthDocument = HydratedDocument<InferSchemaType<typeof authModel>>;
