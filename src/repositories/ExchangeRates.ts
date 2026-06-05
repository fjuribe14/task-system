import type { TipoCambio } from "@/entities/TipoCambio";
import { CambioCostoOperativoRepository } from "@/repositories/CambioCostoOperativoRepository";
import { CambioMonedaRepository } from "@/repositories/CambioMonedaRepository";
import { TipoCambioRepository } from "@/repositories/TipoCambioRepository";
import { CotizaVeService } from "@/services/CotizaVeService";
import { DolarApiService } from "@/services/DolarApiService";
import { TipoCambioService } from "@/services/TipoCambioService";
import type { TCotizaVeRatesResponse } from "@/types/CotizaVe";
import type { DolarAPIRatesResponse } from "@/types/DolarApi";

export class ExchangeRatesRepository {
  private cotizaVeService: CotizaVeService;
  private dolarApiService: DolarApiService;
  private tipoCambioService: TipoCambioService;
  private tipoCambioRepo: TipoCambioRepository;
  private cambioMonedaRepo: CambioMonedaRepository;
  private cambioCostoOperativoRepo: CambioCostoOperativoRepository;

  constructor() {
    this.cotizaVeService = new CotizaVeService();
    this.dolarApiService = new DolarApiService();
    this.dolarApiService = new DolarApiService();
    this.tipoCambioService = new TipoCambioService();
    this.tipoCambioRepo = new TipoCambioRepository();
    this.cambioCostoOperativoRepo = new CambioCostoOperativoRepository();
    this.cambioMonedaRepo = new CambioMonedaRepository();
  }

  async findAllRates(): Promise<TipoCambio[]> {
    let response: TCotizaVeRatesResponse | DolarAPIRatesResponse[];
    response = await this.cotizaVeService.findAllRates();

    if (this.cotizaVeService.isRatesValid(response)) {
      return this.cotizaVeService.castToTipoCambio(response.rates);
    }

    response = await this.dolarApiService.findAllRates();
    return this.dolarApiService.castToTipoCambio(response);
  }

  async saveAllRates(data: TipoCambio[]): Promise<void> {
    const cambioCostoOperativo =
      this.tipoCambioService.castToCambioCostoOperativo(data);

    const cambioMoneda = this.tipoCambioService.castToCambioMoneda(data);

    await Promise.all([
      this.tipoCambioRepo.save(data),
      this.cambioCostoOperativoRepo.save([cambioCostoOperativo]),
      this.cambioMonedaRepo.save([cambioMoneda]),
    ]);
  }
}
