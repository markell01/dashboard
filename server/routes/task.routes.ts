import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getAllTask,
  getTaskByIdController,
  updateTaskController,
} from "../controllers/task.controller.js";

export const tasksRouter = Router();

tasksRouter.get("/", getAllTask);
tasksRouter.get("/:id", getTaskByIdController);
tasksRouter.post("/", createTaskController);
tasksRouter.patch("/:id", updateTaskController);
tasksRouter.delete("/:id", deleteTaskController);
