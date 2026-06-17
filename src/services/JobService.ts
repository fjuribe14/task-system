import { logger } from "@/config/logger.js";
import type { JobLogRepository } from "@/repositories/JobLogRepository.js";
import type { LockService } from "@/services/LockService.js";

export class JobService {
  constructor(
    private jobLogRepo: JobLogRepository,
    private lockService: LockService,
  ) {}

  async runJob(jobName: string, jobLogic: () => Promise<void>): Promise<void> {
    const lockAcquired = await this.lockService.acquireLock(jobName);
    if (!lockAcquired) {
      await this.jobLogRepo.create({
        jobName,
        status: "skipped",
        message: "Previous job still running",
      });
      logger.info(`Job ${jobName} skipped because previous not finished`);
      return;
    }

    try {
      logger.info(`Executing job: ${jobName}`);
      await jobLogic();

      // Log success
      await this.jobLogRepo.create({
        jobName,
        status: "completed",
        message: "Job completed successfully",
      });
      logger.info(`Job ${jobName} completed`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      await this.jobLogRepo.create({
        jobName,
        status: "failed",
        message: errorMsg,
      });
      logger.error(`Job ${jobName} failed: ${errorMsg}`);
    } finally {
      this.lockService.releaseLock(jobName);
    }
  }
}
