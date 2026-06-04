import { logger } from "@/config/logger.js";
import type { TJob } from "@/types/Job.js";
import { delay } from "@/utils/delay.js";

export class TestJob implements TJob {
  public name = "TestJob";
  public cron = "* * * * *";

  async execute(): Promise<void> {
    logger.info("TestJob: iniciando proceso simulado");

    // Simular trabajo asíncrono (ej: llamada a API, procesamiento)
    await delay(2000);

    // Simular posible error aleatorio (20% de probabilidad, solo para demostración)
    if (Math.random() < 0.2) {
      throw new Error("Error aleatorio simulado en TestJob");
    }

    logger.info("TestJob: proceso completado exitosamente");
  }
}
