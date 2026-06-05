import { endOfDay, startOfDay } from "date-fns";
import { env } from "@/config/env";
import {
  dolarApiTestResponseDataDolares,
  dolarApiTestResponseDataEuros,
} from "@/data";
import type { CambioCostoOperativo } from "@/entities/CambioCostoOperativo";
import type { CambioMoneda } from "@/entities/CambioMoneda";
import type { TipoCambio } from "@/entities/TipoCambio";
import {
  type DolarAPIRatesResponse,
  dolarApiEndpointEnumObject,
  fuenteEnumObject,
} from "@/types/DolarApi";
import { monedaEnumObject } from "@/types/Moneda";

export class DolarApiService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = String(env.dolarApiUrl);

    if (!this.apiUrl) {
      throw new Error("La variable de entorno DOLAR_API_URL no está definida.");
    }
  }

  public isRatesValid(rates: DolarAPIRatesResponse[]): boolean {
    return Boolean(rates && rates?.length > 0);
  }

  async findAllRates(): Promise<DolarAPIRatesResponse[]> {
    if (env.nodeEnv === "development") {
      return [
        ...dolarApiTestResponseDataDolares,
        ...dolarApiTestResponseDataEuros,
      ];
    }

    const responseDolares = await fetch(
      `${this.apiUrl}${dolarApiEndpointEnumObject["/dolares"]}`,
      { headers: { Accept: "application/json" } },
    );

    const dolares = (await responseDolares.json()) as DolarAPIRatesResponse[];

    const responseEuros = await fetch(
      `${this.apiUrl}${dolarApiEndpointEnumObject["/euros"]}`,
      { headers: { Accept: "application/json" } },
    );

    const euros = (await responseEuros.json()) as DolarAPIRatesResponse[];

    if (!this.isRatesValid(dolares)) {
      throw new Error("No se pudieron obtener las tasas de cambio de dolares.");
    }

    if (!this.isRatesValid(euros)) {
      throw new Error("No se pudieron obtener las tasas de cambio de euros.");
    }

    return [...dolares, ...euros];
  }

  private calculateAverage(rates: DolarAPIRatesResponse[]): string {
    const filteredRates = rates
      .filter(
        (rate) =>
          (rate.moneda === monedaEnumObject.EUR &&
            rate.fuente === fuenteEnumObject.oficial) ||
          (rate.moneda === monedaEnumObject.USD &&
            rate.fuente === fuenteEnumObject.paralelo),
      )
      .map(({ promedio }) => promedio);

    const average_price = (
      filteredRates
        .filter((value) => value !== null)
        .reduce((acc, value) => acc + value, 0) / filteredRates.length
    ).toFixed(2);

    return average_price;
  }

  private calculateOficialDolarPrice(rates: DolarAPIRatesResponse[]): number {
    if (!rates) throw new Error("No se pudieron obtener las tasas de cambio.");

    const oficialDolarPrice = rates.find(
      (rate) =>
        rate.moneda === monedaEnumObject.USD &&
        rate.fuente === fuenteEnumObject.oficial,
    );

    if (!oficialDolarPrice?.promedio) {
      throw new Error("No se pudo obtener la tasa de cambio oficial.");
    }

    return Number(oficialDolarPrice.promedio);
  }

  public castToTipoCambio(rates: DolarAPIRatesResponse[]): TipoCambio[] {
    if (!rates) return [];

    return rates
      .filter((rate) => rate?.fuente?.includes(fuenteEnumObject.oficial))
      .map((rate) => {
        return {
          moneda: rate.moneda,
          valor: rate.promedio,
          fechaValor: startOfDay(String(rate.fechaActualizacion)),
        };
      });
  }

  public castToCambioMoneda(rates: DolarAPIRatesResponse[]): CambioMoneda {
    if (!rates) {
      throw new Error("No se pudieron obtener las tasas de cambio de dolares.");
    }

    const { fechaActualizacion } = rates[0];

    return {
      fechaFin: endOfDay(String(fechaActualizacion)),
      fechaInicio: startOfDay(String(fechaActualizacion)),
      valorMoneda: this.calculateOficialDolarPrice(rates),
    };
  }

  public castToCambioCostosOperativos(
    rates: DolarAPIRatesResponse[],
  ): CambioCostoOperativo {
    if (!rates) {
      throw new Error("No se pudieron obtener las tasas de cambio de dolares.");
    }

    const valorAplicable = Number(this.calculateAverage(rates));

    const { fechaActualizacion } = rates[0];

    return {
      valorAplicable,
      fechaFin: endOfDay(String(fechaActualizacion)),
      fechaInicio: startOfDay(String(fechaActualizacion)),
    };
  }
}
