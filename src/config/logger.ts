import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { env } from "@/config/env.js";

const { combine, timestamp, printf, colorize, json } = winston.format;

const myFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
});

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: combine(colorize(), timestamp(), myFormat),
  }),
];

if (env.nodeEnv !== "test") {
  transports.push(
    new DailyRotateFile({
      filename: "logs/%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
      format: combine(timestamp(), json()),
    }),
  );
}

export const logger = winston.createLogger({
  level: env.logLevel,
  format: combine(timestamp()),
  transports,
});
