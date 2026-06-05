import { endOfDay, startOfDay } from "date-fns";
import { env } from "@/config/env";
import { testCotizaVEData } from "@/data";
import type { CambioCostoOperativo } from "@/entities/CambioCostoOperativo";
import type { CambioMoneda } from "@/entities/CambioMoneda";
import type { TipoCambio } from "@/entities/TipoCambio";
import {
  cotizaVeEndpointEnumObject,
  cotizaVeRatesResponseMarketEnumObject,
  cotizaVeRatesResponseTypeEnumObject,
  type TCotizaVeRatesResponse,
  type TCotizaVeRatesResponseRate,
} from "@/types/CotizaVe";
import { monedaEnumObject, type TMoneda } from "@/types/Moneda";

export class CotizaVeService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = String(env.cotizaveApiUrl);
    this.apiKey = String(env.cotizaveApiKey);

    if (!this.apiUrl) {
      throw new Error(
        "La variable de entorno COTIZAVE_API_URL no está definida.",
      );
    }

    if (!this.apiKey) {
      throw new Error(
        "La variable de entorno COTIZAVE_API_KEY no está definida.",
      );
    }
  }

  public isRatesValid({ rates }: TCotizaVeRatesResponse): boolean {
    return Boolean(rates && rates?.length > 0);
  }

  async findAllRates(): Promise<TCotizaVeRatesResponse> {
    if (env.nodeEnv === "development") {
      return testCotizaVEData;
    }

    const response = await fetch(
      `${this.apiUrl}${cotizaVeEndpointEnumObject["/rates"]}`,
      {
        headers: {
          "X-API-Key": this.apiKey,
          Accept: "application/json",
        },
      },
    );

    const rates = (await response.json()) as TCotizaVeRatesResponse;

    if (!this.isRatesValid(rates)) {
      throw new Error("No se pudieron obtener las tasas de cambio.");
    }

    return rates;
  }

  private calculateAverage(rates: TCotizaVeRatesResponseRate[]): string {
    if (!rates) throw new Error("No se pudieron obtener las tasas de cambio.");

    const filteredRates = rates
      .filter(
        (rate) =>
          rate.market === cotizaVeRatesResponseMarketEnumObject.binance ||
          rate.market === cotizaVeRatesResponseMarketEnumObject.eur_reference,
      )
      .map(({ mid }) => mid);

    const average_price = (
      filteredRates
        .filter((value) => value !== null)
        .reduce((acc, value) => acc + value, 0) / filteredRates.length
    ).toFixed(2);

    return average_price;
  }

  private calculateOficialDolarPrice(
    rates: TCotizaVeRatesResponseRate[],
  ): number {
    if (!rates) throw new Error("No se pudieron obtener las tasas de cambio.");

    const oficialDolarPrice = rates.find(
      (rate) =>
        rate.type === cotizaVeRatesResponseTypeEnumObject.reference &&
        rate.market === cotizaVeRatesResponseMarketEnumObject.reference,
    );

    if (!oficialDolarPrice?.mid) {
      throw new Error("No se pudo obtener la tasa de cambio oficial.");
    }

    return Number(oficialDolarPrice.mid);
  }

  public castToTipoCambio(rates?: TCotizaVeRatesResponseRate[]): TipoCambio[] {
    if (!rates) throw new Error("No se pudieron obtener las tasas de cambio.");

    return rates
      .filter(
        (rate) =>
          rate?.type?.includes(cotizaVeRatesResponseTypeEnumObject.reference) ||
          rate?.market?.includes(cotizaVeRatesResponseMarketEnumObject.binance),
      )
      .map(({ market, mid, updated_at }) => {
        let moneda: TMoneda = monedaEnumObject.USD;

        if (market === cotizaVeRatesResponseMarketEnumObject.eur_reference) {
          moneda = monedaEnumObject.EUR;
        }

        if (market === cotizaVeRatesResponseMarketEnumObject.binance) {
          moneda = monedaEnumObject.USDC;
        }

        return {
          moneda,
          valor: Number(mid),
          fechaModificacion: new Date(),
          fechaValor: startOfDay(String(updated_at)),
        };
      });
  }

  public castToCambioMoneda(rates: TCotizaVeRatesResponseRate[]): CambioMoneda {
    if (!rates) throw new Error("No se pudieron obtener las tasas de cambio.");

    const { updated_at } = rates[0];

    return {
      fechaFin: endOfDay(String(updated_at)),
      fechaInicio: startOfDay(String(updated_at)),
      valorMoneda: this.calculateOficialDolarPrice(rates),
    };
  }

  public castToCambioCostosOperativos(
    rates: TCotizaVeRatesResponseRate[],
  ): CambioCostoOperativo {
    if (!rates) throw new Error("No se pudieron obtener las tasas de cambio.");

    const { updated_at } = rates[0];

    const valorAplicable = Number(this.calculateAverage(rates));

    return {
      valorAplicable,
      fechaFin: endOfDay(String(updated_at)),
      fechaInicio: startOfDay(String(updated_at)),
    };
  }
}
