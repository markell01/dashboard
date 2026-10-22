import type { Request, Response } from "express";
import {
  createTaskSchema,
  taskParamsSchema,
  taskQuerySchema,
  updateTaskSchema,
} from "../schemas/tasks.schema.js";
import {
  countTasks,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../models/task.model.js";
import z from "zod";

export async function getAllTask(req: Request, res: Response) {
  const parsedQuery = taskQuerySchema.safeParse(req.query);

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
    getTasks(parsedQuery.data),
    countTasks(parsedQuery.data.projectId),
  ]);

  res.status(200).json({
    items,
    total,
  });
}

export async function getTaskByIdController(req: Request, res: Response) {
  const parsedParams = taskParamsSchema.safeParse(req.params);

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

  const task = await getTaskById(parsedParams.data.id);

  if (!task) {
    res.status(404).json({
      error: {
        code: "TASK_NOT_FOUND",
        message: `Задача с id ${parsedParams.data.id} не найдена`,
      },
    });

    return;
  }

  return res.status(200).json(task);
}

export async function createTaskController(req: Request, res: Response) {
  const parsedBody = createTaskSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Некорректные параметры запроса",
        fieldErrors: z.flattenError(parsedBody.error).fieldErrors,
      },
    });

    return;
  }

  const task = await createTask(parsedBody.data);

  if (!task) {
    res.status(409).json({
      error: {
        code: "PROJECT_REFERENCE_CONFLICT",
        message: `Проект с id ${parsedBody.data.projectId} не существует`,
      },
    });

    return;
  }

  return res.status(201).json(task);
}

export async function updateTaskController(req: Request, res: Response) {
  const parsedParams = taskParamsSchema.safeParse(req.params);

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

  const parsedBody = updateTaskSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const flattenedError = z.flattenError(parsedBody.error);

    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Некорректные данные задачи",
        fieldErrors: flattenedError.fieldErrors,
        formErrors: flattenedError.formErrors,
      },
    });

    return;
  }

  const result = await updateTask(
    parsedParams.data.id,
    parsedBody.data
  );

  if (result.status === "taskNotFound") {
    res.status(404).json({
      error: {
        code: "TASK_NOT_FOUND",
        message: `Задача с id ${parsedParams.data.id} не найдена`,
      },
    });

    return;
  }

  if (result.status === "projectNotFound") {
    res.status(409).json({
      error: {
        code: "PROJECT_REFERENCE_CONFLICT",
        message: `Проект с id ${parsedBody.data.projectId} не существует`,
      },
    });

    return;
  }

  res.status(200).json(result.task);
}

export async function deleteTaskController(req: Request, res: Response) {
  const parsedParams = taskParamsSchema.safeParse(req.params);

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

  const result = await deleteTask(parsedParams.data.id);

  if (!result) {
    res.status(404).json({
      error: {
        code: "TASK_NOT_FOUND",
        message: `Задача с id ${parsedParams.data.id} не найдена`,
      }
    });

    return;
  }

  res.status(204).send();
}
