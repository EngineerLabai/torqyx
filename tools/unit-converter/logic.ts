import type { UnitCategory, UnitInput, UnitResult } from "./types";

type UnitDefinition = {
  id: string;
  label: string;
  toBase: number;
};

type CategoryDefinition = {
  label: string;
  baseUnit: string;
  units: UnitDefinition[];
};

export const CATEGORY_MAP: Record<UnitCategory, CategoryDefinition> = {
  length: {
    label: "Uzunluk",
    baseUnit: "m",
    units: [
      { id: "mm", label: "mm", toBase: 0.001 },
      { id: "cm", label: "cm", toBase: 0.01 },
      { id: "m", label: "m", toBase: 1 },
      { id: "km", label: "km", toBase: 1000 },
      { id: "in", label: "in", toBase: 0.0254 },
      { id: "ft", label: "ft", toBase: 0.3048 },
    ],
  },
  force: {
    label: "Kuvvet",
    baseUnit: "N",
    units: [
      { id: "N", label: "N", toBase: 1 },
      { id: "kN", label: "kN", toBase: 1000 },
      { id: "lbf", label: "lbf", toBase: 4.4482216 },
    ],
  },
  pressure: {
    label: "Basinc",
    baseUnit: "Pa",
    units: [
      { id: "Pa", label: "Pa", toBase: 1 },
      { id: "kPa", label: "kPa", toBase: 1000 },
      { id: "MPa", label: "MPa", toBase: 1000000 },
      { id: "bar", label: "bar", toBase: 100000 },
      { id: "psi", label: "psi", toBase: 6894.757 },
    ],
  },
  energy: {
    label: "Enerji",
    baseUnit: "J",
    units: [
      { id: "J", label: "J", toBase: 1 },
      { id: "kJ", label: "kJ", toBase: 1000 },
      { id: "MJ", label: "MJ", toBase: 1000000 },
      { id: "Wh", label: "Wh", toBase: 3600 },
      { id: "kWh", label: "kWh", toBase: 3600000 },
      { id: "cal", label: "cal", toBase: 4.184 },
    ],
  },
};

export const DEFAULT_INPUT: UnitInput = {
  category: "length",
  value: "100",
  fromUnit: "mm",
  toUnit: "m",
};

const findUnit = (category: UnitCategory, unitId: string) =>
  CATEGORY_MAP[category].units.find((unit) => unit.id === unitId) ?? null;

export function calculateUnit(input: UnitInput): UnitResult {
  const category = CATEGORY_MAP[input.category];
  const from = findUnit(input.category, input.fromUnit);
  const to = findUnit(input.category, input.toUnit);
  const numericValue = Number(input.value);

  if (!from || !to) {
    return {
      output: null,
      baseValue: null,
      steps: [],
      formula: "V_out = V_in * factor_from / factor_to",
      baseUnitLabel: category.baseUnit,
      fromLabel: from?.label ?? "-",
      toLabel: to?.label ?? "-",
      error: "Secili birimler bulunamadi.",
    };
  }

  if (!Number.isFinite(numericValue)) {
    return {
      output: null,
      baseValue: null,
      steps: [],
      formula: "V_out = V_in * factor_from / factor_to",
      baseUnitLabel: category.baseUnit,
      fromLabel: from.label,
      toLabel: to.label,
      error: "Lutfen gecerli bir deger girin.",
    };
  }

  const baseValue = numericValue * from.toBase;
  const output = baseValue / to.toBase;

  const formula = `V_out = V_in * ${from.toBase} / ${to.toBase}`;
  const steps = [
    `Giris: ${numericValue} ${from.label}`,
    `Temel birime cevir: ${numericValue} * ${from.toBase} = ${baseValue} ${category.baseUnit}`,
    `Cikis birimine cevir: ${baseValue} / ${to.toBase} = ${output} ${to.label}`,
  ];

  return {
    output,
    baseValue,
    steps,
    formula,
    baseUnitLabel: category.baseUnit,
    fromLabel: from.label,
    toLabel: to.label,
  };
}
