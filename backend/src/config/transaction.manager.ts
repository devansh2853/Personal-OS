import mongoose, { ClientSession } from "mongoose";

export class TransactionManager {
  async execute<T>(
    operation: (session: ClientSession) => Promise<T>,
  ): Promise<T> {
    const session: ClientSession = await mongoose.startSession();
    try {
      let result!: T;
      await session.withTransaction(async () => {
        result = await operation(session);
      });
      return result;
    } finally {
      await session.endSession();
    }
  }
}
