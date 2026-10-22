import { error } from "console";
import { app } from "./app.js";
import { sequelize } from "./config/dbconnection.js";
import { env } from "./config/env.js";

async function bootstrap(): Promise<void> {
  try {
    await sequelize.authenticate();

    console.log(`Подключение к БД ${env.PG_DATABASE} установлено`);

    app.listen(env.PORT, () => {
      console.log(`Сервер запущен на порту ${env.PORT}`);
    });
  } catch (err) {
    console.error("Ошибка запуска:", err);
    process.exitCode = 1;

    try {
      await sequelize.close();
    } catch (closeError: unknown) {
      console.error("Ошибка закрытия соединений:", closeError);
    }
  }
}

bootstrap();
