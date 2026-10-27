import type { Request, Response } from "express";
import {
  createProjectSchema,
  projectParamsSchema,
  projectsQuerySchema,
  updateProjectSchema,
} from "../schemas/projects.schema.js";
import {
  countProjects,
  createProject,
  deleteProject,
  getProjects,
  projectsById,
  updateProject,
} from "../models/project.model.js";
import z from "zod";

export async function getAllProjects(req: Request, res: Response) {
  const parsedQuery = projectsQuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Некорректные параметры запроса",
        fieldErrors: z.flattenError(parsedQuery.error).fieldErrors,
      },
    });

    return;
  }

  const [items, total] = await Promise.all([
    getProjects(parsedQuery.data),
    countProjects(parsedQuery.data.search),
  ]);

  res.status(200).json({
    items,
    total,
  });
}

export async function getProjectById(req: Request, res: Response) {
  const parsedParams = projectParamsSchema.safeParse(req.params);

  if (!parsedParams.success) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Некорректные параметры запроса",
        fieldErrors: z.flattenError(parsedParams.error).fieldErrors,
      },
    });

    return;
  }

  const project = await projectsById(parsedParams.data.id);

  if (!project) {
    res.status(404).json({
      error: {
        code: "PROJECT_NOT_FOUND",
        message: `Проект с id ${parsedParams.data.id} не найден`,
      },
    });

    return;
  }

  res.status(200).json(project);
}

export async function createProjectController(req: Request, res: Response) {
  const parsedBody = createProjectSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Некорректные параметры запроса",
        fieldErrors: z.flattenError(parsedBody.error).fieldErrors,
      }
    });

    return;
  }

  const project = await createProject(parsedBody.data);

  res.status(201).json(project);
}

export async function updateProjectController(req: Request, res: Response) {
    const parsedParams = projectParamsSchema.safeParse(req.params);

  if (!parsedParams.success) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Некорректные параметры запроса",
        fieldErrors: z.flattenError(parsedParams.error).fieldErrors,
      },
    });

    return;
  }

  const parsedBody = updateProjectSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const flattenedError = z.flattenError(parsedBody.error)

    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Некорректные параметры запроса",
        fieldErrors: flattenedError.fieldErrors,
        formErrors: flattenedError.formErrors,
      }
    });

    return;
  }

  const project = await updateProject(parsedParams.data.id, parsedBody.data);

  if (!project) {
    res.status(404).json({
      error: {
        code: "PROJECT_NOT_FOUND",
        message: `Проект с id ${parsedParams.data.id} не найден`,
      },
    });

    return;
  }

  res.status(200).json(project);
}

export async function deleteProjectController(req: Request, res: Response) {
  const parsedParams = projectParamsSchema.safeParse(req.params);

  if (!parsedParams.success) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Некорректные параметры запроса",
        fieldErrors: z.flattenError(parsedParams.error).fieldErrors,
      },
    });

    return;
  }

  const result = await deleteProject(parsedParams.data.id);

  if (!result) {
    res.status(404).json({
      error: {
        code: "PROJECT_NOT_FOUND",
        message: `Проект с id ${parsedParams.data.id} не найден`,
      }
    });

    return;
  }

  res.status(204).send();
}
