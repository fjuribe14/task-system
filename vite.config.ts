import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "croner",
        "dotenv",
        "reflect-metadata",
        "sqlite3",
        "typeorm",
        "winston",
        "winston-daily-rotate-file",
      ],
    },
  },
});
