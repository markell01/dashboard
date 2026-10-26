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
  next: NextFunction,
) => {
  console.error("Ошибка:", error);

  if (res.headersSent) {
    next(error);
    return;
  }

  const errorType =
    typeof error === "object" && error !== null && "type" in error
      ? error.type
      : undefined;

  if (errorType === "entity.parse.failed") {
    res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "Тело запроса содержит некорректный JSON",
      },
    });
    return;
  }

  if (errorType === "entity.too.large") {
    res.status(413).json({
      error: {
        code: "PAYLOAD_TOO_LARGE",
        message: "Превышен допустимый размер тела запроса",
      },
    });
    return;
  }

  if (error instanceof ForeignKeyConstraintError) {
    res.status(409).json({
      error: {
        code: "PROJECT_HAS_TASKS",
        message: "Проект нельзя удалять из-за связанных задач",
      },
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
