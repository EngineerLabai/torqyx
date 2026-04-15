"use client";

import { useMemo } from "react";
import { useCurrentUnitSystem } from "@/contexts/UnitSystemContext";
import {
  formatValueWithUnit,
  getUnitDefinition,
  convertValue,
  type UnitCategory,
  type UnitSystem,
} from "@/utils/units";

interface UseUnitOptions {
  system?: UnitSystem;
  category?: UnitCategory;
  precision?: number;
}

interface UseUnitResult {
  value: number;
  unit: string;
  display: string;
  originalValue: number;
  originalUnit: string;
  system: UnitSystem;
}

// Hook for unit conversion and display
export function useUnit(
  value: number,
  unit: string,
  options: UseUnitOptions = {}
): UseUnitResult {
  const currentSystem = useCurrentUnitSystem();
  const system = options.system || currentSystem;

  return useMemo(() => {
    const unitDef = getUnitDefinition(unit);

    if (!unitDef) {
      // Unknown unit, return as-is
      return {
        value,
        unit,
        display: `${value} ${unit}`,
        originalValue: value,
        originalUnit: unit,
        system,
      };
    }

    const formatted = formatValueWithUnit(value, unit, system, options.category);

    return {
      ...formatted,
      originalValue: value,
      originalUnit: unit,
      system,
    };
  }, [value, unit, system, options.category]);
}

// Hook for converting between units
export function useUnitConversion() {
  const system = useCurrentUnitSystem();

  return {
    convert: (value: number, fromUnit: string, toUnit: string) =>
      convertValue(value, fromUnit, toUnit),

    toSI: (value: number, unit: string) => {
      const unitDef = getUnitDefinition(unit);
      if (!unitDef) return value;
      return unit === unitDef.si ? value : unitDef.fromImperial(value);
    },

    fromSI: (value: number, unit: string) => {
      const unitDef = getUnitDefinition(unit);
      if (!unitDef) return value;
      return unit === unitDef.si ? value : unitDef.toImperial(value);
    },

    system,
  };
}

// Hook for getting unit preferences
export function useUnitPreferences() {
  const system = useCurrentUnitSystem();

  return {
    system,
    isSI: system === 'SI',
    isImperial: system === 'Imperial',
    isMixed: system === 'Mixed',
  };
}