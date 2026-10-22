import type { Request, Response } from "express";
import { checkDatabase } from "../models/health.model.js";

export async function getHealth(_req: Request, res: Response) {
  try {
    await checkDatabase();

    res.status(200).json({
      status: "Ok",
      message: "database available",
    });
  } catch (err: unknown) {
    console.log("Error from database", err);

    res.status(503).json({
      status: "error",
      message: "database unavailable",
    });
  }
}
