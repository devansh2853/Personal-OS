import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const muscleGroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const muscleGroupModel = model("muscleGroup", muscleGroupSchema);

export type MuscleGroupDocument = HydratedDocument<
  InferSchemaType<typeof muscleGroupSchema>
>;
