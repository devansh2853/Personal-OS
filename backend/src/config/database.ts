import mongoose from "mongoose";

const connectDatabase = async function (): Promise<void> {
  try {
    mongoose.connect(process.env.MONGODB_URI!);
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDatabase;
