import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "@/config/env.js";
import { JobLog } from "@/entities/JobLog.js";
import { logger } from "./logger";
import { TipoCambio } from "@/entities/TipoCambio";
import { CambioMoneda } from "@/entities/CambioMoneda";
import { CambioCostoOperativo } from "@/entities/CambioCostoOperativo";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: env.dbPath,
  synchronize: true, // solo para desarrollo; en producción usar migraciones
  // logging: env.nodeEnv === "development",
  entities: [JobLog, TipoCambio],
  subscribers: [],
  migrations: [],
});

export const dataSourceSqlSrv = new DataSource({
  type: "mssql",
  host: env.sqlSrvHost,
  port: env.sqlSrvPort,
  username: env.sqlSrvUsername,
  password: env.sqlSrvPassword,
  database: env.sqlSrvDatabase,
  // logging: env.nodeEnv === "development",
  options: {
    encrypt: false, // Cambiar a false si tu SQL Server no usa SSL
    trustServerCertificate: true, // Aceptar certificado autofirmado (necesario para desarrollo local)
    cryptoCredentialsDetails: {
      // ciphers: "SSLv3",
      minVersion: "TLSv1",
      // maxVersion: "TLSv1.2",
    },
  },
  entities: [TipoCambio, CambioMoneda, CambioCostoOperativo],
  subscribers: [],
  migrations: [],
});

export async function InitDataSources() {
  try {
    await Promise.all([
      AppDataSource.initialize().catch((error) => {
        logger.error("Error al inicializar AppDataSource", error);
      }),
      // dataSourceSqlSrv.initialize().catch((error) => {
      //   logger.error("Error al inicializar dataSourceSqlSrv", error);
      // }),
    ]);
    logger.info("DataSources inicializadas exitosamente");
  } catch (error) {
    logger.error(
      "Error al inicializar las conexiones a las bases de datos",
      error,
    );
  }
}

export async function CloseDataSources() {
  try {
    await Promise.all([
      AppDataSource.destroy().catch((error) => {
        logger.error("Error al cerrar AppDataSource", error);
      }),
      // dataSourceSqlSrv.destroy().catch((error) => {
      //   logger.error("Error al cerrar dataSourceSqlSrv", error);
      // }),
    ]);
    logger.info("DataSources cerradas exitosamente");
  } catch (error) {
    logger.error("Error al cerrar las conexiones a las bases de datos", error);
  }
}
