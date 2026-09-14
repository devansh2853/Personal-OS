import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

import {
  ExerciseCategory,
  ExerciseForce,
  ExerciseLevel,
  ExerciseMechanic,
  WeightType,
} from "../exercise.enums.js";

const exerciseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    primaryMuscleGroupIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "muscleGroup",
        },
      ],
      required: true,
      default: [],
      index: true,
    },

    secondaryMuscleGroupIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "muscleGroup",
        },
      ],
      required: true,
      default: [],
    },

    equipmentIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "equipment",
        },
      ],
      required: true,
      default: [],
      index: true,
    },

    force: {
      type: String,
      enum: [...Object.values(ExerciseForce), null],
      default: null,
    },

    level: {
      type: String,
      enum: Object.values(ExerciseLevel),
      required: true,
    },

    mechanic: {
      type: String,
      enum: [...Object.values(ExerciseMechanic), null],
      default: null,
    },

    category: {
      type: String,
      enum: Object.values(ExerciseCategory),
      required: true,
    },

    instructions: {
      type: [String],
      required: true,
      default: [],
    },

    weightType: {
      type: String,
      enum: Object.values(WeightType),
      required: true,
    },

    imageUrls: {
      type: [String],
      required: true,
      default: [],
    },

    instructionalVideoUrl: {
      type: String,
      default: null,
    },

    sourceProvider: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    sourceId: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const exerciseModel = model("exercise", exerciseSchema);
export type ExerciseAttrs = InferSchemaType<typeof exerciseSchema>;

export type ExerciseDocument = HydratedDocument<
  InferSchemaType<typeof exerciseSchema>
>;
