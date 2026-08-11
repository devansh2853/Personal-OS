import app from "./app.js";
import dotenv from "dotenv";
import connectDatabase from "./config/database.js";

const PORT = process.env.PORT || 3000;
dotenv.config();
const startServer = async (): Promise<void> => {
  await connectDatabase();
  console.log("MongoDB database connected successfully");
  app.listen(PORT, () => {
    console.log(`Your server is running on PORT: ${PORT}`);
  });
};

startServer();
