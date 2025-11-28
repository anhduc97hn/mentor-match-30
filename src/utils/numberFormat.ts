import numeral from "numeral";

export function fCurrency(number: number): string {
  return numeral(number).format(Number.isInteger(number) ? "$0,0" : "$0,0.00");
}

export function fPercent(number: number): string {
  return numeral(number / 100).format("0.0%");
}

export function fNumber(number: number): string {
  return numeral(number).format();
}

export function fShortenNumber(number: number): string {
  return numeral(number).format("0.00a").replace(".00", "");
}

export function fData(number: number): string {
  return numeral(number).format("0.0");
}

export function fSize(number: number): string {
  return numeral(number).format("0.0 b");
}