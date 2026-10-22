import z from "zod";

export const limitSchema = z
  .string()
  .regex(/^\d+$/, "Значение должно содержать только цифры")
  .default("50")
  .transform(Number)
  .pipe(z.number().int().min(1).max(100));

export const offsetSchema = z
  .string()
  .regex(/^\d+$/, "Значение должно содержать только цифры")
  .default("0")
  .transform(Number)
  .pipe(z.number().int().min(0).max(Number.MAX_SAFE_INTEGER));

export const idSchema = z
  .string()
  .regex(/^\d+$/, "ID должен содержать только цифры")
  .transform(Number)
  .pipe(z.number().int().min(1).max(2147483647));