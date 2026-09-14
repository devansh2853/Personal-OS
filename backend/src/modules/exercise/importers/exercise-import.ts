import dotenv from "dotenv";

import connectDatabase from "../../../config/database.js";
import { ExerciseRepository } from "../exercise.repository.js";
import { ExerciseDatasetReader } from "./exercise-dataset.reader.js";
import { ExerciseImportRunner } from "./exercise-import.runner.js";
import { ExerciseImportService } from "./exercise-import.service.js";
import mongoose from "mongoose";

dotenv.config();

const DATASET_PATH =
  process.env.EXERCISE_DATASET_PATH ?? "./data/free-exercise-db/exercises";

const BATCH_SIZE = Number(process.env.EXERCISE_IMPORT_BATCH_SIZE ?? 100);
if (!Number.isInteger(BATCH_SIZE) || BATCH_SIZE <= 0) {
  throw new Error("EXERCISE_IMPORT_BATCH_SIZE must be a positive integer");
}

const runExerciseImport = async (): Promise<void> => {
  await connectDatabase();
  console.log("MongoDB database connected successfully");
  console.log(`Exercise dataset path: ${DATASET_PATH}`);
  console.log(`Exercise import batch size: ${BATCH_SIZE}`);

  try {
    const exerciseRepository = new ExerciseRepository();
    const exerciseImportService = new ExerciseImportService(exerciseRepository);
    const exerciseDatasetReader = new ExerciseDatasetReader(DATASET_PATH);
    const exerciseImportRunner = new ExerciseImportRunner(
      exerciseDatasetReader,
      exerciseImportService,
      BATCH_SIZE,
    );

    const result = await exerciseImportRunner.run();
    console.log("Exercise import completed successfully");
    console.log(`Total processed: ${result.totalProcessed}`);
    console.log(`Total imported: ${result.totalImported}`);
    console.log(`Total failed: ${result.totalFailed}`);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB database disconnected");
  }
};

runExerciseImport().catch((error: unknown) => {
  console.error("Exercise import failed", error);
  process.exitCode = 1;
});
