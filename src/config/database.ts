import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "@/config/env.js";
import { JobLog } from "@/entities/JobLog.js";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: env.dbPath,
  synchronize: true, // solo para desarrollo; en producción usar migraciones
  logging: env.nodeEnv === "development",
  entities: [JobLog],
  subscribers: [],
  migrations: [],
});
