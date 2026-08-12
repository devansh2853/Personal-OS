import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./modules/user/user.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(errorMiddleware);

app.use("/user", userRoutes);

export default app;
