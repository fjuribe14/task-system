import type { TMoneda } from "@/types/Moneda";
import { getEnumObjectFromArray } from "@/utils/enum";

export type DolarAPIRatesResponse = {
  moneda: TMoneda;
  fuente: TFuente;
  nombre: string;
  compra: number | null;
  venta: number | null;
  promedio: number;
  fechaActualizacion: Date;
};

export const dolarApiEndpointEnum = [
  "/cotizaciones",
  "/dolares",
  "/euros",
] as const;

export const fuenteEnum = ["oficial", "paralelo"] as const;

export type TDolarApiEndpoint = (typeof dolarApiEndpointEnum)[number];

export const dolarApiEndpointEnumObject =
  getEnumObjectFromArray(dolarApiEndpointEnum);

export type TFuente = (typeof fuenteEnum)[number];

export const fuenteEnumObject = getEnumObjectFromArray(fuenteEnum);
