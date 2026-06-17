import "reflect-metadata";
import "@/config/sentry";
import * as Sentry from "@sentry/node";
import { CloseDataSources, InitDataSources } from "@/config/database.js";
import { logger } from "@/config/logger.js";
import { CronScheduler } from "@/cron/CronScheduler.js";
import { ExchangeRatesJob } from "@/jobs/ExchangeRatesJob.js";
import { JobLogRepository } from "@/repositories/JobLogRepository.js";
import { JobService } from "@/services/JobService.js";
import { LockService } from "@/services/LockService.js";

async function bootstrap() {
  try {
    // Inicializar base de datos
    await InitDataSources();

    // Repositorios y servicios
    const jobLogRepo = new JobLogRepository();
    const lockService = new LockService(jobLogRepo);
    const jobService = new JobService(jobLogRepo, lockService);
    const scheduler = new CronScheduler(jobService);

    // Registrar jobs
    const tipoCambioJob = new ExchangeRatesJob();
    scheduler.registerJob(tipoCambioJob);

    // Modo normal: iniciar cron
    scheduler.start();

    // Graceful shutdown
    const shutdown = async () => {
      logger.info("Shutting down gracefully...");
      await scheduler.stop();
      await CloseDataSources();
      logger.info("Cleanup done, exiting.");
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    Sentry.captureException(error);
    logger.error("Failed to start application:", error);
    process.exit(1);
  }
}

bootstrap();
