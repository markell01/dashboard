import { Sequelize } from "sequelize";
import { env } from "./env.js";

export const sequelize = new Sequelize(
  env.PG_DATABASE,
  env.PG_USER,
  env.PG_PASSWORD,
  {
    dialect: "postgres",
    host: env.PG_HOST,
    port: env.PG_PORT,
    logging: false,
    dialectOptions: {
      connectionTimeoutMillis: 5000,
    },
  },
);
