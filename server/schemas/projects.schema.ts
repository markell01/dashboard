import z from "zod";

const limitSchema = z
  .string()
  .regex(/^\d+$/, "Значение должно содержать только цифры")
  .default("50")
  .transform(Number)
  .pipe(z.number().int().min(1).max(100));

const offsetSchema = z
  .string()
  .regex(/^\d+$/, "Значение должно содержать только цифры")
  .default("0")
  .transform(Number)
  .pipe(z.number().int().min(0).max(Number.MAX_SAFE_INTEGER));

const idSchema = z
  .string()
  .regex(/^\d+$/, "ID должен содержать только цифры")
  .transform(Number)
  .pipe(z.number().int().min(1).max(2147483647));

export const projectsQuerySchema = z
  .object({
    limit: limitSchema,
    offset: offsetSchema,
  })
  .strict();

export const projectParamsSchema = z
  .object({
    id: idSchema,
  })
  .strict();

export const createProjectSchema = z
  .object({
    title: z.string().trim().min(1).max(150),
    budget: z
      .string()
      .regex(
        /^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/,
        "Число должно быть от 0 до 9999999999.99, максимум 2 знака после точки",
      ),
    startDate: z.iso.date(),
    durationDays: z.number().int().min(1).max(2147483647),
  })
  .strict();

export const updateProjectSchema = createProjectSchema
  .partial()
  .refine(data => Object.keys(data).length >0, {
    message: "Для обновления нужно хотя бы одно поле"
  })

export type ProjectsQuery = z.infer<typeof projectsQuerySchema>;
export type CreateProjectType = z.infer<typeof createProjectSchema>;
export type UpdateProjectType = z.infer<typeof updateProjectSchema>;
