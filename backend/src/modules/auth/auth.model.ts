import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

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

export const authModel = model("authAccount", authSchema);
export type AuthDocument = HydratedDocument<InferSchemaType<typeof authModel>>;
