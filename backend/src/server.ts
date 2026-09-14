import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  const { default: app } = await import("./app.js");
  const { default: connectDatabase } = await import("./config/database.js");
  await connectDatabase();
  console.log("MongoDB database connected successfully");
  app.listen(PORT, () => {
    console.log(`Your server is running on PORT: ${PORT}`);
  });
};

startServer();
