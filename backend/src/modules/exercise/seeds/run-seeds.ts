import mongoose from "mongoose";
import connectDatabase from "../../../config/database.js";
import { equipmentModel } from "../models/equipment.model.js";
import { muscleGroupModel } from "../models/muscle-group.model.js";
import { equipment } from "./equipments.seed.js";
import { muscleGroups } from "./muscle-groups.seed.js";
import { configDotenv } from "dotenv";

configDotenv();
const toDisplayName = (value: string): string =>
  value.replace(/\b\w/g, (character) => character.toUpperCase());

const seedMuscleGroups = async (): Promise<void> => {
  await muscleGroupModel.bulkWrite(
    muscleGroups.map((name) => ({
      updateOne: {
        filter: { name },
        update: {
          $set: {
            displayName: toDisplayName(name),
            isActive: true,
          },
          $setOnInsert: {
            name,
          },
        },
        upsert: true,
      },
    })),
  );
  console.log(`Seeded ${muscleGroups.length} muscle groups.`);
};

const seedEquipment = async (): Promise<void> => {
  await equipmentModel.bulkWrite(
    equipment.map((name) => ({
      updateOne: {
        filter: { name },
        update: {
          $set: {
            displayName: toDisplayName(name),
            isActive: true,
          },
          $setOnInsert: {
            name,
          },
        },
        upsert: true,
      },
    })),
  );

  console.log(`Seeded ${equipment.length} equipment types.`);
};

const run = async (): Promise<void> => {
  try {
    await connectDatabase();

    await seedMuscleGroups();
    await seedEquipment();

    console.log("Exercise reference data seeding completed.");
  } catch (error) {
    console.error("Exercise reference data seeding failed.", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void run();
