import type { TCotizaVeRatesResponse } from "@/types/CotizaVe";
import type { DolarAPIRatesResponse } from "@/types/DolarApi";

export const testCotizaVEData: TCotizaVeRatesResponse = {
  country: "VE",
  currency: "VES",
  base: "USD",
  rates: [
    {
      market: "reference",
      type: "reference",
      mid: 560.3753,
      updated_at: new Date(),
    },
    {
      market: "eur_reference",
      type: "reference",
      mid: 650.50606325,
      updated_at: new Date(),
    },
    {
      market: "parallel",
      type: "parallel",
      mid: 744.18825,
      updated_at: new Date(),
    },
    {
      market: "binance",
      type: "p2p",
      ask: 747.5,
      bid: 749,
      mid: 748.25,
      updated_at: new Date(),
    },
    // {
    //   market: "bingx",
    //   type: "p2p",
    //   ask: 749.9,
    //   bid: 737.5,
    //   mid: 743.7,
    //   updated_at: new Date("2026-06-05T00:13:28Z"),
    // },
    // {
    //   market: "bitget",
    //   type: "p2p",
    //   ask: 747.99,
    //   bid: 742.5,
    //   mid: 745.245,
    //   updated_at: new Date("2026-06-05T00:14:30Z"),
    // },
    // {
    //   market: "bybit",
    //   type: "p2p",
    //   ask: 745.899,
    //   bid: 745,
    //   mid: 745.4495,
    //   updated_at: new Date("2026-06-05T00:13:48Z"),
    // },
    // {
    //   market: "mexc",
    //   type: "p2p",
    //   ask: 754,
    //   bid: 490000,
    //   mid: 245377,
    //   updated_at: new Date("2026-06-05T00:14:35Z"),
    // },
    // {
    //   market: "okx",
    //   type: "p2p",
    //   ask: 747.998,
    //   bid: 737.836,
    //   mid: 742.917,
    //   updated_at: new Date("2026-06-05T00:14:04Z"),
    // },
    // {
    //   market: "saldo",
    //   type: "p2p",
    //   ask: 742.6487,
    //   bid: 724.3628,
    //   mid: 733.50575,
    //   updated_at: new Date("2026-06-05T00:14:07Z"),
    // },
  ],
  //   index: {
  //     value: 689.1865,
  //     version: "v1",
  //     as_of: "2026-06-05T00:14:38.038419705Z",
  //     weights: {
  //       bcv: 0.3,
  //       p2p: 0.5,
  //       paralelo: 0.2,
  //     },
  //     components: {
  //       bcv: 560.3753,
  //       p2p: 744.4725000000001,
  //       paralelo: 744.18825,
  //     },
  //     p2p_median: 744.4725000000001,
  //     p2p_count: 6,
  //     flags: {
  //       outliers_excluded: ["mexc"],
  //     },
  //     methodology_url: "https://cotizave.com/docs/cotizave-index",
  //   },
  fetched_at: new Date(),
};

export const dolarApiTestResponseDataDolares: DolarAPIRatesResponse[] = [
  {
    moneda: "USD",
    fuente: "oficial",
    nombre: "Dólar",
    compra: null,
    venta: null,
    promedio: 560.3753,
    fechaActualizacion: new Date(),
  },
  {
    moneda: "USD",
    fuente: "paralelo",
    nombre: "Paralelo",
    compra: null,
    venta: null,
    promedio: 744.18825,
    fechaActualizacion: new Date(),
  },
];

export const dolarApiTestResponseDataEuros: DolarAPIRatesResponse[] = [
  {
    moneda: "EUR",
    fuente: "oficial",
    nombre: "Euro",
    compra: null,
    venta: null,
    promedio: 650.50606325,
    fechaActualizacion: new Date(),
  },
  {
    moneda: "EUR",
    fuente: "paralelo",
    nombre: "Paralelo",
    compra: null,
    venta: null,
    promedio: 864.252848,
    fechaActualizacion: new Date(),
  },
];
