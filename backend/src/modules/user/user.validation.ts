import {z} from 'zod';
import { ActivityLevel, FitnessGoal, Gender, HeightUnit } from './user.enums.js';
import { WeightUnit, WaterUnit } from '../../global.enum.js';


export const UserUpdationRequestScehma = z.strictObject({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    dateOfBirth: z.coerce.date().optional(),
    gender: z.enum(Gender).optional(),
    heightCm: z.number().optional(),
    preferredHeightUnit: z.enum(HeightUnit).optional(),
    preferredWeightUnit: z.enum(WeightUnit).optional(),
    preferredWaterUnit: z.enum(WaterUnit).optional(),
    timeZone: z.string().optional(),
    activityLevel: z.enum(ActivityLevel).optional(),
    fitnessGoal: z.enum(FitnessGoal).optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided",
  }
)