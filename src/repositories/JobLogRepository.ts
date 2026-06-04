import type { Repository } from "typeorm";
import { AppDataSource } from "@/config/database.js";
import { JobLog } from "@/entities/JobLog.js";

export class JobLogRepository {
  private repo: Repository<JobLog>;

  constructor() {
    this.repo = AppDataSource.getRepository(JobLog);
  }

  async create(log: Partial<JobLog>): Promise<JobLog> {
    const entity = this.repo.create(log);
    return await this.repo.save(entity);
  }

  async findLastByJobName(jobName: string): Promise<JobLog | null> {
    return await this.repo.findOne({
      where: { jobName },
      order: { createdAt: "DESC" },
    });
  }
}
