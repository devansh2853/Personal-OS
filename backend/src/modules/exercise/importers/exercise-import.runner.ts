import { ExerciseDatasetReader } from "./exercise-dataset.reader.js";
import { ExerciseImportService } from "./exercise-import.service.js";

export interface ExerciseImportResult {
  totalProcessed: number;
  totalImported: number;
  totalFailed: number;
}

export class ExerciseImportRunner {
  constructor(
    private readonly exerciseDatasetReader: ExerciseDatasetReader,
    private readonly exerciseImportService: ExerciseImportService,
    private readonly batchSize: number = 100,
  ) {}

  public async run() {
    let totalProcessed = 0;
    let totalImported = 0;
    let totalFailed = 0;

    for await (const batch of this.exerciseDatasetReader.readBatches(
      this.batchSize,
    )) {
      totalProcessed += batch.length;

      try {
        await this.exerciseImportService.importExercises(batch);
        totalImported += batch.length;

        console.info(`Imported ${totalImported}/${totalProcessed} exercises`);
      } catch (err) {
        totalFailed += batch.length;
        console.error(
          `Failed to import batch of ${batch.length} exercises`,
          err,
        );
      }
    }
    return {
      totalProcessed,
      totalImported,
      totalFailed,
    };
  }
}
