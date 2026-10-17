import type { FilletWeldInput, FilletWeldResult } from "./types";
import { parseEngineeringNumber } from "@/utils/number-parser";

export const DEFAULT_INPUT: FilletWeldInput = {
  load: "15000",
  length: "120",
  allowable: "140",
  fillet: "0",
};

const toNumber = (value: string, locale?: "tr" | "en"): number =>
  parseEngineeringNumber(value, { locale }) ?? Number.NaN;

export const calculateFilletWeld = (input: FilletWeldInput): FilletWeldResult => {
  const load = toNumber(input.load, input.locale);
  const length = toNumber(input.length, input.locale);
  const allowable = toNumber(input.allowable, input.locale);
  const fillet = toNumber(input.fillet, input.locale);

  if (!Number.isFinite(load) || !Number.isFinite(length) || !Number.isFinite(allowable) || load <= 0 || length <= 0 || allowable <= 0) {
    return {
      requiredA: null,
      throat: null,
      stress: null,
      isSafe: null,
      error: "Pozitif yük, uzunluk ve izin verilen gerilme gir.",
    };
  }

  const requiredA = load / (0.707 * length * allowable);
  const throat = requiredA * 0.707;
  const stress = Number.isFinite(fillet) && fillet > 0 ? load / (0.707 * fillet * length) : null;
  const isSafe = stress !== null ? stress <= allowable : null;

  return { requiredA, throat, stress, isSafe };
};
