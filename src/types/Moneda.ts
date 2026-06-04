import { getEnumObjectFromArray } from "@/utils/enum";

const monedas = ["EUR", "USD", "USDC"] as const;

export type TMoneda = (typeof monedaEnumObject)[keyof typeof monedaEnumObject];

export const monedaEnumObject = getEnumObjectFromArray(monedas);
