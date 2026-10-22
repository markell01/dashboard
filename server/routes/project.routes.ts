import { Router } from "express";
import {
  getProjectById,
  getAllProjects,
  createProjectController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/project.controller.js";

export const projectRouter = Router();

projectRouter.get("/", getAllProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.post("/", createProjectController);
projectRouter.patch("/:id", updateProjectController);
projectRouter.delete("/:id", deleteProjectController);