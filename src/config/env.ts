import "dotenv/config";

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  cronSchedule: process.env.CRON_SCHEDULE || "* * * * *",
  dbPath: process.env.DB_PATH || "database/db.sqlite",
  logLevel: process.env.LOG_LEVEL || "info",

  // SQL Server config
  sqlSrvHost: process.env.SQL_SRV_HOST,
  sqlSrvPort: Number(process.env.SQL_SRV_PORT),
  sqlSrvUsername: process.env.SQL_SRV_USERNAME,
  sqlSrvPassword: process.env.SQL_SRV_PASSWORD,
  sqlSrvDatabase: process.env.SQL_SRV_DATABASE,

  // Exchange Rates API's
  cotizaveApiKey: process.env.COTIZAVE_API_KEY,
  cotizaveApiUrl: process.env.COTIZAVE_API_URL,
  dolarApiUrl: process.env.DOLAR_API_URL,
};
