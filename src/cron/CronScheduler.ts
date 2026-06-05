import { Cron } from "croner";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";
import type { JobService } from "@/services/JobService.js";
import type { TJob } from "@/types/Job.js";

export class CronScheduler {
  private jobs: TJob[] = [];
  private cronInstance: Cron | null = null;

  constructor(private jobService: JobService) {}

  registerJob(job: TJob): void {
    this.jobs.push(job);
    logger.info(`Job registered: ${job.name}`);
  }

  start(): void {
    if (this.cronInstance) {
      logger.warn("Cron already running, stopping previous...");
      this.cronInstance.stop();
    }

    this.cronInstance = new Cron(env.cronSchedule, async () => {
      logger.info("Cron tick - starting all jobs");
      await this.runAllJobs();
    });

    logger.info(`Cron scheduler started with schedule: ${env.cronSchedule}`);
  }

  private async runAllJobs(): Promise<void> {
    const promises = this.jobs.map((job) =>
      this.jobService.runJob(job.name, async () => {
        await job.execute();
      }),
    );
    await Promise.allSettled(promises);
  }

  async stop(): Promise<void> {
    if (this.cronInstance) {
      this.cronInstance.stop();
      logger.info("Cron scheduler stopped");
    }
  }

  // Para ejecución manual (modo one-shot)
  async runJobManually(jobName: string): Promise<void> {
    const job = this.jobs.find((j) => j.name === jobName);
    if (!job) {
      throw new Error(`Job ${jobName} not found`);
    }
    logger.info(`Manual execution of job: ${jobName}`);
    await this.jobService.runJob(job.name, () => job.execute());
  }
}
