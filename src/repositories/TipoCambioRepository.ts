import type { Repository } from "typeorm";
import { AppDataSource } from "@/config/database.js";
import { TipoCambio } from "@/entities/TipoCambio.js";

export class TipoCambioRepository {
  private repo: Repository<TipoCambio>;

  constructor() {
    this.repo = AppDataSource.getRepository(TipoCambio);
  }

  async findAll(): Promise<TipoCambio[]> {
    return await this.repo.find();
  }

  async findLast(): Promise<TipoCambio | null> {
    const tipoCambio = await this.repo.find({
      order: { fechaRegistro: "DESC" },
      take: 1,
    });

    return tipoCambio[0];
  }

  async save(data: TipoCambio[]): Promise<void> {
    await this.repo.upsert(data, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ["moneda", "fechaValor"],
    });
  }
}
