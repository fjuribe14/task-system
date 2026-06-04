import { logger } from "@/config/logger.js";
import type { JobLogRepository } from "@/repositories/JobLogRepository.js";

export class LockService {
  private memoryLocks: Map<string, boolean> = new Map();

  constructor(private jobLogRepo: JobLogRepository) {}

  async acquireLock(jobName: string): Promise<boolean> {
    // Primero verificar lock en memoria (más rápido)
    if (this.memoryLocks.get(jobName)) {
      logger.warn(`Lock in memory active for job: ${jobName}`);
      return false;
    }

    // Verificar en DB si el último job no ha terminado
    const lastLog = await this.jobLogRepo.findLastByJobName(jobName);
    if (lastLog && (lastLog.status === "started" || lastLog.status === null)) {
      logger.warn(
        `Lock in DB active for job: ${jobName} (last status: ${lastLog.status})`,
      );
      return false;
    }

    // Adquirir lock
    this.memoryLocks.set(jobName, true);
    logger.info(`Lock acquired for job: ${jobName}`);
    return true;
  }

  releaseLock(jobName: string): void {
    this.memoryLocks.delete(jobName);
    logger.info(`Lock released for job: ${jobName}`);
  }
}
