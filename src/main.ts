import "reflect-metadata";
import { logger } from "@/config/logger.js";
import { JobLogRepository } from "@/repositories/JobLogRepository.js";
import { LockService } from "@/services/LockService.js";
import { JobService } from "@/services/JobService.js";
import { CronScheduler } from "@/cron/CronScheduler.js";
// import { TestJob } from "@/jobs/TestJob.js";
import { ExchangeRatesJob } from "@/jobs/ExchangeRatesJob.js";
import { CloseDataSources, InitDataSources } from "@/config/database.js";

// Detectar si se ejecuta manualmente un job específico
const args = process.argv.slice(2);
const manualJob = args.includes("--run-test-job");

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
    // const testJob = new TestJob();
    // scheduler.registerJob(testJob);

    const tipoCambioJob = new ExchangeRatesJob();
    scheduler.registerJob(tipoCambioJob);

    if (manualJob) {
      // Modo manual: ejecutar job una vez y salir
      logger.info("Running test job manually...");
      await scheduler.runJobManually("TestJob");
      logger.info("Manual execution finished");
      await CloseDataSources();
      process.exit(0);
    } else {
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
    }
  } catch (error) {
    logger.error("Failed to start application:", error);
    process.exit(1);
  }
}

bootstrap();
