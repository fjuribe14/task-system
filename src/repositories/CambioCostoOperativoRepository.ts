import type { Repository } from "typeorm";
import { AppDataSource } from "@/config/database.js";
import {
  CambioCostoOperativo,
  CambioCostoOperativoUniqueConstraint,
} from "@/entities/CambioCostoOperativo.js";

export class CambioCostoOperativoRepository {
  private repo: Repository<CambioCostoOperativo>;

  constructor() {
    this.repo = AppDataSource.getRepository(CambioCostoOperativo);
  }

  async findAll(): Promise<CambioCostoOperativo[]> {
    return await this.repo.find();
  }

  async findLast(): Promise<CambioCostoOperativo | null> {
    const tipoCambio = await this.repo.find({
      order: { fechaRegistro: "DESC" },
      take: 1,
    });

    return tipoCambio[0];
  }

  async save(data: CambioCostoOperativo[]): Promise<void> {
    await this.repo.upsert(data, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: CambioCostoOperativoUniqueConstraint,
    });
  }
}
