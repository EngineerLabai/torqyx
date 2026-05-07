"use client";

import { useUnit, useUnitConversion } from "@/hooks/useUnit";
import { formatValueWithUnit, type UnitSystem } from "@/utils/units";

interface UnitDisplayProps {
  value: number;
  unit: string;
  system?: UnitSystem;
  className?: string;
  showOriginal?: boolean; // Show both SI and converted value
  precision?: number;
}

// Display component for showing values with unit conversion
export function UnitDisplay({
  value,
  unit,
  system,
  className = "",
  showOriginal = false,
  precision,
}: UnitDisplayProps) {
  const unitResult = useUnit(value, unit, { system, precision });

  if (showOriginal && unitResult.originalUnit !== unitResult.unit) {
    return (
      <span className={className}>
        <span className="font-medium">{unitResult.display}</span>
        <span className="text-muted-foreground ml-1">
          ({unitResult.originalValue.toFixed(precision || 2)} {unitResult.originalUnit})
        </span>
      </span>
    );
  }

  return (
    <span className={className}>
      {unitResult.display}
    </span>
  );
}

// Specialized display for results
export function UnitResult({
  label,
  value,
  unit,
  system,
  className = "",
}: {
  label: string;
  value: number;
  unit: string;
  system?: UnitSystem;
  className?: string;
}) {
  const unitResult = useUnit(value, unit, { system });

  return (
    <div className={`flex justify-between items-center py-2 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-sm">
        {unitResult.display}
      </span>
    </div>
  );
}

// Display for formulas with unit conversion
export function UnitFormula({
  formula,
  variables,
  system,
  className = "",
}: {
  formula: string;
  variables: Record<string, { value: number; unit: string }>;
  system?: UnitSystem;
  className?: string;
}) {
  const { system: currentSystem } = useUnitConversion();
  const targetSystem = system || currentSystem;
  let displayFormula = formula;

  Object.entries(variables).forEach(([key, { value, unit }]) => {
    const unitResult = formatValueWithUnit(value, unit, targetSystem);
    displayFormula = displayFormula.replace(
      new RegExp(`\\b${key}\\b`, 'g'),
      unitResult.display
    );
  });

  return (
    <div className={`font-mono text-sm bg-muted p-3 rounded ${className}`}>
      {displayFormula}
    </div>
  );
}
