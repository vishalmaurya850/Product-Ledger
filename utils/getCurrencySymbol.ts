import { currencyOptions } from "./constant";

export function getCurrencySymbol(code: string): string {
  const currency = currencyOptions.find((option) => option.code === code);
  return currency ? currency.symbol : "";
}
