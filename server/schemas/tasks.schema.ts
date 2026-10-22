import z from "zod";
import { idSchema, limitSchema, offsetSchema } from "./common.schema.js";

export const taskQuerySchema = z
  .object({
    projectId: idSchema.optional(),
    limit: limitSchema,
    offset: offsetSchema,
  })
  .strict();

export const taskParamsSchema = z
  .object({
    id: idSchema,
  })
  .strict();

export const createTaskSchema = z
  .object({
    projectId: z.number().int().min(1).max(2147483647),
    title: z.string().trim().min(1).max(200),
    estimatedCost: z
      .string()
      .regex(
        /^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/,
        "Число должно быть от 0 до 9999999999.99, максимум 2 знака после точки",
      ),
    dueDate: z.iso.date(),
    priority: z.number().int().min(1).max(5),
  })
  .strict();

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Для обновления нужно передать хотя бы одно поле",
  });

export type TaskQuery = z.infer<typeof taskQuerySchema>;
export type CreateTask = z.infer<typeof createTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
