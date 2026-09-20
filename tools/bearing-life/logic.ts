import type { BearingLifeInput, BearingLifeResult } from "./types";

export const DEFAULT_INPUT: BearingLifeInput = {
  C: "25",
  P: "10",
  bearingType: "ball",
  rpm: "1500",
  a1: "1",
};

const toNumber = (value: string) => Number.parseFloat(value.replace(",", "."));

export const calculateBearingLife = (input: BearingLifeInput): BearingLifeResult => {
  const C = toNumber(input.C);
  const P = toNumber(input.P);
  const rpm = toNumber(input.rpm);
  const a1 = toNumber(input.a1);

  if (
    !Number.isFinite(C) ||
    !Number.isFinite(P) ||
    !Number.isFinite(rpm) ||
    !Number.isFinite(a1) ||
    C <= 0 ||
    P <= 0 ||
    rpm <= 0 ||
    a1 <= 0
  ) {
    return {
      L10: null,
      L10h: null,
      Lna: null,
      Lnah: null,
      exponent: null,
      error: "Pozitif C, P, devir ve a1 değeri gir.",
    };
  }

  const exponent = input.bearingType === "roller" ? 10 / 3 : 3;
  const L10 = Math.pow(C / P, exponent);
  const L10h = (L10 * 1_000_000) / (60 * rpm);
  const Lna = a1 * L10;
  const Lnah = a1 * L10h;

  return { L10, L10h, Lna, Lnah, exponent };
};
