import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const equipmentSchema = new Schema(
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

export const equipmentModel = model("equipment", equipmentSchema);

export type EquipmentDocument = HydratedDocument<
  InferSchemaType<typeof equipmentSchema>
>;
