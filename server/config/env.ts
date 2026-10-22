import dotenv from "dotenv";
import { resolve } from "path";
import z from "zod";

dotenv.config({
  path: resolve(process.cwd(), "../.env"),
  quiet: true,
});

const portSchema = z.coerce.number().int().min(1).max(65535);

const envSchema = z.object({
  PORT: portSchema.default(3000),
  PG_HOST: z.string().trim().min(1),
  PG_PORT: portSchema,
  PG_DATABASE: z.string().trim().min(1),
  PG_USER: z.string().trim().min(1),
  PG_PASSWORD: z.string().min(1),
});

export const env = envSchema.parse(process.env);
