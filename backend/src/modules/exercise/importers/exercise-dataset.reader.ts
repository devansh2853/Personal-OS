import { ExerciseSourceDTO } from "./exercise-source.dto.js";
import { promises as fs } from "node:fs";
import path from "node:path";
export class ExerciseDatasetReader {
  public constructor(private readonly datasetDirectoryPath: string) {}

  public async *readBatches(
    batchSize: number,
  ): AsyncGenerator<ExerciseSourceDTO[], void, void> {
    if (batchSize <= 0) {
      throw new Error("Batch size must be greater than 0");
    }
    const fileNames = await this.getJsonFileNames();

    let batch: ExerciseSourceDTO[] = [];
    for (const fileName of fileNames) {
      const filePath = path.join(this.datasetDirectoryPath, fileName);
      const exercise = await this.readExercise(filePath);

      batch.push(exercise);

      if (batch.length >= batchSize) {
        yield batch;
        batch = [];
      }
    }
    if (batch.length > 0) {
      yield batch;
    }
  }

  private async getJsonFileNames(): Promise<string[]> {
    const entries = await fs.readdir(this.datasetDirectoryPath, {
      withFileTypes: true,
    });
    return entries
      .filter((entry) => entry.isFile() && path.extname(entry.name) === ".json")
      .map((entry) => entry.name)
      .sort();
  }

  private async readExercise(filePath: string): Promise<ExerciseSourceDTO> {
    const fileContent = await fs.readFile(filePath, "utf-8");
    try {
      return JSON.parse(fileContent) as ExerciseSourceDTO;
    } catch {
      throw new Error(`Invalid JSON file: ${filePath}`);
    }
  }
}
