import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { ForeignKeyConstraintError } from "sequelize";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Ошибка:", error);

  if (error instanceof ForeignKeyConstraintError) {
    res.status(409).json({
      error: {
        code: "PROJECT_HAS_TASKS",
        message: "Проект нельзя удалять из-за связанных задач"
      }
    });

    return;
  }

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Ошибка сервера",
    },
  });
};
