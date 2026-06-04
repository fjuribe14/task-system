import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  format: ["esm"],
  dts: false,
  clean: true,
  outDir: "dist",
  sourcemap: true,
  target: "node20",
  platform: "node",
  splitting: false,
  shims: true,
  minify: true,
  external: [
    "better-sqlite3",
    "croner",
    "dotenv",
    "reflect-metadata",
    "typeorm",
    "winston",
    "winston-daily-rotate-file",
  ],
});
