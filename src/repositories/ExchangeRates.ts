import { AppDataSource } from "@/config/database";
import { TipoCambio } from "@/entities/TipoCambio";
import { CotizaVeService } from "@/services/CotizaVeService";
import { In, type Repository } from "typeorm";

export class ExchangeRatesRepository {
  private cotizaVeService: CotizaVeService;
  private repo: Repository<TipoCambio>;

  constructor() {
    this.repo = AppDataSource.getRepository(TipoCambio);
    this.cotizaVeService = new CotizaVeService();
  }

  async findAllRates(): Promise<TipoCambio[]> {
    const { rates } = await this.cotizaVeService.findAllRates();
    return this.cotizaVeService.castToTipoCambio(rates);
  }

  async saveAllRates(data: TipoCambio[]): Promise<void> {
    await this.repo.upsert(data, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ["moneda", "fechaValor"],
    });
  }
}
