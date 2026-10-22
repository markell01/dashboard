import { sequelize } from "../config/dbconnection.js";

export async function checkDatabase(): Promise<void> {
  await sequelize.authenticate();
}
