import express from "express";
import { healthRouter } from "./routes/health.routes.js";
import { projectRouter } from "./routes/project.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

export const app = express();

app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/projects", projectRouter);

app.use(errorHandler);
