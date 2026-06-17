import * as Sentry from "@sentry/node";
import { env } from "@/config/env";
import { logger } from "@/config/logger.js";
import { ExchangeRatesRepository } from "@/repositories/ExchangeRates";
import type { TJob } from "@/types/Job.js";

export class ExchangeRatesJob implements TJob {
  public name = "ExchangeRatesJob";
  public cron = env.cronSchedule;
  private repo: ExchangeRatesRepository;

  constructor() {
    this.repo = new ExchangeRatesRepository();
  }

  async execute(): Promise<void> {
    try {
      logger.info(`${this.name}: Iniciando...`);
      const rates = await this.repo.findAllRates();
      await this.repo.saveAllRates(rates);
      logger.info(`${this.name}: Tasa de cambio guardada exitosamente`);
    } catch (error) {
      Sentry.captureException(error);
      logger.error(`${this.name}: proceso fallido`, error);
    }
  }
}
