import "dotenv/config";

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  cronSchedule: process.env.CRON_SCHEDULE || "* * * * *",
  dbPath: process.env.DB_PATH || "database/db.sqlite",
  logLevel: process.env.LOG_LEVEL || "info",
};
