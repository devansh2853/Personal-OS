import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose";
import {
  Gender,
  ActivityLevel,
  FitnessGoal,
  HeightUnit,
} from "./user.enums.js";
import { WaterUnit, WeightUnit } from "../../global.enum.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
    },

    heightCm: {
      type: Number,
      min: 0,
    },

    preferredHeightUnit: {
      type: String,
      enum: Object.values(HeightUnit),
    },

    preferredWeightUnit: {
      type: String,
      enum: Object.values(WeightUnit),
    },

    preferredWaterUnit: {
      type: String,
      enum: Object.values(WaterUnit),
    },

    timeZone: {
      type: String,
      trim: true,
    },

    activityLevel: {
      type: String,
      enum: Object.values(ActivityLevel),
    },

    fitnessGoal: {
      type: String,
      enum: Object.values(FitnessGoal),
    },

    profileSetupCompleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const userModel = model("user", userSchema);
// export type UserDocument = HydratedDocument<typeof userSchema>;
export type UserDocument = HydratedDocument<InferSchemaType<typeof userSchema>>;

console.log("User collection:", userModel.collection.name);
