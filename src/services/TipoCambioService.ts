import { endOfDay, startOfDay } from "date-fns";
import type { CambioCostoOperativo } from "@/entities/CambioCostoOperativo";
import type { CambioMoneda } from "@/entities/CambioMoneda";
import type { TipoCambio } from "@/entities/TipoCambio";
import { monedaEnumObject } from "@/types/Moneda";

export class TipoCambioService {
  private calculatePromedioCosto(rates: TipoCambio[]): number {
    const filteredRates = rates.filter(
      (rate) =>
        rate.moneda === monedaEnumObject.USDC ||
        rate.moneda === monedaEnumObject.EUR,
    );
    return Number(
      (
        filteredRates.reduce((acc, rate) => acc + rate.valor, 0) /
        filteredRates.length
      )?.toFixed(2),
    );
  }

  private calculateOficialDolarPrice(rates: TipoCambio[]): number {
    const oficialDolarPrice = rates.find(
      (rate) => rate.moneda === monedaEnumObject.USD,
    );

    if (!oficialDolarPrice?.valor) {
      throw new Error("No se pudo obtener la tasa de cambio oficial.");
    }

    return Number(oficialDolarPrice.valor);
  }

  public castToCambioCostoOperativo(rates: TipoCambio[]): CambioCostoOperativo {
    const valorAplicable = this.calculatePromedioCosto(rates);

    if (!valorAplicable) {
      throw new Error("No se pudo obtener la tasa de cambio oficial.");
    }

    return {
      idPais: 1,
      idTipoMoneda: 5,
      valorAplicable,
      fechaFin: endOfDay(rates[0].fechaValor),
      fechaInicio: startOfDay(rates[0].fechaValor),
    };
  }

  public castToCambioMoneda(rates: TipoCambio[]): CambioMoneda {
    if (!rates) {
      throw new Error("No se pudieron obtener las tasas de cambio de dolares.");
    }

    const { fechaValor } = rates[0];

    return {
      idPais: 1,
      idTipoMoneda: 5,
      fechaFin: endOfDay(fechaValor),
      fechaInicio: startOfDay(fechaValor),
      valorMoneda: this.calculateOficialDolarPrice(rates),
    };
  }
}
