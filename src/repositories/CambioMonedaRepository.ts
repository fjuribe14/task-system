import type { Repository } from "typeorm";
import { AppDataSource } from "@/config/database.js";
import {
  CambioMoneda,
  CambioMonedaUniqueConstraint,
} from "@/entities/CambioMoneda";

export class CambioMonedaRepository {
  private repo: Repository<CambioMoneda>;

  constructor() {
    this.repo = AppDataSource.getRepository(CambioMoneda);
  }

  async findAll(): Promise<CambioMoneda[]> {
    return await this.repo.find();
  }

  async findLast(): Promise<CambioMoneda | null> {
    const tipoCambio = await this.repo.find({
      order: { fechaInicio: "DESC" },
      take: 1,
    });

    return tipoCambio[0];
  }

  async save(data: CambioMoneda[]): Promise<void> {
    await this.repo.upsert(data, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: CambioMonedaUniqueConstraint,
    });
  }
}
