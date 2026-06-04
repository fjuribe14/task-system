import { env } from "@/config/env";
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
import { endOfDay, startOfDay } from "date-fns";

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
    const response = await fetch(
      `${this.apiUrl}${cotizaVeEndpointEnumObject["/rates"]}`,
      {
        headers: {
          "X-API-Key": this.apiKey,
          Accept: "application/json",
        },
      },
    );

    return (await response.json()) as TCotizaVeRatesResponse;
  }

  public castToTipoCambio(rates?: TCotizaVeRatesResponseRate[]): TipoCambio[] {
    if (!rates) return [];

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
          fechaRegistro: new Date(),
          fechaModificacion: new Date(),
          fechaValor: startOfDay(String(updated_at)),
        };
      });
  }

  public castToCambioMoneda(
    rates: TCotizaVeRatesResponseRate[],
  ): CambioMoneda[] {
    return rates.map((rate) => ({
      valorMoneda: Number(rate.bid),
      fechaFin: endOfDay(String(rate.updated_at)),
      fechaInicio: startOfDay(String(rate.updated_at)),
    }));
  }

  public castToCambioCostosOperativos(
    rates: TCotizaVeRatesResponseRate[],
  ): CambioCostoOperativo[] {
    if (!rates) return [];

    const ratesFiltered = rates.filter(
      (rate) =>
        rate?.type?.includes(cotizaVeRatesResponseTypeEnumObject.reference) ||
        rate?.market?.includes(cotizaVeRatesResponseMarketEnumObject.binance),
    );

    return ratesFiltered.map((rate) => ({
      valorAplicable: Number(rate.bid),
      fechaFin: endOfDay(String(rate.updated_at)),
      fechaInicio: startOfDay(String(rate.updated_at)),
    }));
  }
}
