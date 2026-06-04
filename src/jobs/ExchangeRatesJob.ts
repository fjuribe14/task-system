import { env } from "@/config/env";
import { logger } from "@/config/logger.js";
import type { TJob } from "@/types/Job.js";
import { ExchangeRatesRepository } from "@/repositories/ExchangeRates";

export class ExchangeRatesJob implements TJob {
  public name = "ExchangeRatesJob";
  public cron = env.cronSchedule;
  private repo: ExchangeRatesRepository;

  constructor() {
    this.repo = new ExchangeRatesRepository();
  }

  async execute(): Promise<void> {
    try {
      logger.info(
        `${this.name}: Iniciando obtencion de tasa de cambio en ${env.cronSchedule}`,
      );

      const rates = await this.repo.findAllRates();
      await this.repo.saveAllRates(rates);
      // fetch(
      //   "https://api.apis.gob.mx/v1/denue/v1/consultas/consulta-geometria/vgr?format=json",
      // )
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log(data);
      //   });

      logger.info(`${this.name}: proceso completado exitosamente`);
    } catch (error) {
      logger.error(`${this.name}: proceso fallido`, error);
    }
  }
}
