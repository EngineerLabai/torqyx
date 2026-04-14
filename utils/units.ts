// Unit conversion utilities for aiengineerslab
// All internal calculations use SI units, conversions are for display only

export type UnitSystem = 'SI' | 'Imperial' | 'Mixed';

export type UnitCategory =
  | 'length'
  | 'force'
  | 'moment'
  | 'pressure'
  | 'power'
  | 'mass'
  | 'temperature'
  | 'angle';

export interface UnitDefinition {
  si: string;           // SI unit symbol
  imperial: string;     // Imperial unit symbol
  category: UnitCategory;
  toImperial: (siValue: number) => number;  // SI to Imperial
  fromImperial: (imperialValue: number) => number; // Imperial to SI
  precision?: number;   // Display precision
}

// Length conversions
const LENGTH_UNITS: Record<string, UnitDefinition> = {
  mm: {
    si: 'mm',
    imperial: 'in',
    category: 'length',
    toImperial: (mm) => mm / 25.4,
    fromImperial: (inch) => inch * 25.4,
    precision: 2,
  },
  m: {
    si: 'm',
    imperial: 'ft',
    category: 'length',
    toImperial: (m) => m * 3.28084,
    fromImperial: (ft) => ft / 3.28084,
    precision: 3,
  },
  cm: {
    si: 'cm',
    imperial: 'in',
    category: 'length',
    toImperial: (cm) => cm / 2.54,
    fromImperial: (inch) => inch * 2.54,
    precision: 2,
  },
};

// Force conversions
const FORCE_UNITS: Record<string, UnitDefinition> = {
  N: {
    si: 'N',
    imperial: 'lbf',
    category: 'force',
    toImperial: (N) => N * 0.224809,
    fromImperial: (lbf) => lbf / 0.224809,
    precision: 1,
  },
  kN: {
    si: 'kN',
    imperial: 'kipf',
    category: 'force',
    toImperial: (kN) => kN * 0.224809,
    fromImperial: (kipf) => kipf / 0.224809,
    precision: 2,
  },
};

// Moment/Torque conversions
const MOMENT_UNITS: Record<string, UnitDefinition> = {
  'N·m': {
    si: 'N·m',
    imperial: 'lbf·ft',
    category: 'moment',
    toImperial: (Nm) => Nm * 0.737562,
    fromImperial: (lbfft) => lbfft / 0.737562,
    precision: 2,
  },
  'N·mm': {
    si: 'N·mm',
    imperial: 'lbf·in',
    category: 'moment',
    toImperial: (Nmm) => Nmm * 0.00885075,
    fromImperial: (lbfin) => lbfin / 0.00885075,
    precision: 1,
  },
};

// Pressure/Stress conversions
const PRESSURE_UNITS: Record<string, UnitDefinition> = {
  MPa: {
    si: 'MPa',
    imperial: 'psi',
    category: 'pressure',
    toImperial: (MPa) => MPa * 145.038,
    fromImperial: (psi) => psi / 145.038,
    precision: 1,
  },
  GPa: {
    si: 'GPa',
    imperial: 'ksi',
    category: 'pressure',
    toImperial: (GPa) => GPa * 145.038,
    fromImperial: (ksi) => ksi / 145.038,
    precision: 2,
  },
  Pa: {
    si: 'Pa',
    imperial: 'psi',
    category: 'pressure',
    toImperial: (Pa) => Pa / 6894.76,
    fromImperial: (psi) => psi * 6894.76,
    precision: 0,
  },
};

// Power conversions
const POWER_UNITS: Record<string, UnitDefinition> = {
  kW: {
    si: 'kW',
    imperial: 'hp',
    category: 'power',
    toImperial: (kW) => kW * 1.34102,
    fromImperial: (hp) => hp / 1.34102,
    precision: 2,
  },
  W: {
    si: 'W',
    imperial: 'hp',
    category: 'power',
    toImperial: (W) => W * 0.00134102,
    fromImperial: (hp) => hp / 0.00134102,
    precision: 3,
  },
};

// Mass conversions
const MASS_UNITS: Record<string, UnitDefinition> = {
  kg: {
    si: 'kg',
    imperial: 'lb',
    category: 'mass',
    toImperial: (kg) => kg * 2.20462,
    fromImperial: (lb) => lb / 2.20462,
    precision: 2,
  },
  g: {
    si: 'g',
    imperial: 'oz',
    category: 'mass',
    toImperial: (g) => g * 0.035274,
    fromImperial: (oz) => oz / 0.035274,
    precision: 1,
  },
};

// Temperature conversions (special case)
const TEMPERATURE_UNITS: Record<string, UnitDefinition> = {
  '°C': {
    si: '°C',
    imperial: '°F',
    category: 'temperature',
    toImperial: (celsius) => (celsius * 9/5) + 32,
    fromImperial: (fahrenheit) => (fahrenheit - 32) * 5/9,
    precision: 1,
  },
};

// Angle conversions
const ANGLE_UNITS: Record<string, UnitDefinition> = {
  rad: {
    si: 'rad',
    imperial: 'deg',
    category: 'angle',
    toImperial: (rad) => rad * (180 / Math.PI),
    fromImperial: (deg) => deg * (Math.PI / 180),
    precision: 3,
  },
  deg: {
    si: 'deg',
    imperial: 'deg',
    category: 'angle',
    toImperial: (deg) => deg, // Same unit
    fromImperial: (deg) => deg,
    precision: 1,
  },
};

// All units registry
export const UNITS_REGISTRY: Record<string, UnitDefinition> = {
  ...LENGTH_UNITS,
  ...FORCE_UNITS,
  ...MOMENT_UNITS,
  ...PRESSURE_UNITS,
  ...POWER_UNITS,
  ...MASS_UNITS,
  ...TEMPERATURE_UNITS,
  ...ANGLE_UNITS,
};

// Get unit definition by symbol
export function getUnitDefinition(unitSymbol: string): UnitDefinition | null {
  return UNITS_REGISTRY[unitSymbol] || null;
}

// Convert value between SI and Imperial
export function convertValue(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  const fromDef = getUnitDefinition(fromUnit);
  const toDef = getUnitDefinition(toUnit);

  if (!fromDef || !toDef || fromDef.category !== toDef.category) {
    throw new Error(`Cannot convert between ${fromUnit} and ${toUnit}`);
  }

  // If same unit, return as-is
  if (fromUnit === toUnit) {
    return value;
  }

  // Convert to SI first, then to target
  let siValue: number;

  if (fromUnit === fromDef.si) {
    siValue = value;
  } else if (fromUnit === fromDef.imperial) {
    siValue = fromDef.fromImperial(value);
  } else {
    throw new Error(`Unsupported conversion from ${fromUnit}`);
  }

  if (toUnit === toDef.si) {
    return siValue;
  } else if (toUnit === toDef.imperial) {
    return toDef.toImperial(siValue);
  } else {
    throw new Error(`Unsupported conversion to ${toUnit}`);
  }
}

// Format value with unit for display
export function formatValueWithUnit(
  value: number,
  unit: string,
  system: UnitSystem,
  category?: UnitCategory
): { value: number; unit: string; display: string } {
  const unitDef = getUnitDefinition(unit);

  if (!unitDef) {
    return { value, unit, display: `${value} ${unit}` };
  }

  let displayUnit = unit;
  let displayValue = value;

  if (system === 'Imperial') {
    displayUnit = unitDef.imperial;
    displayValue = unitDef.toImperial(value);
  } else if (system === 'Mixed') {
    // Mixed mode: show both units if different
    if (unitDef.si !== unitDef.imperial) {
      const imperialValue = unitDef.toImperial(value);
      const precision = unitDef.precision || 2;
      return {
        value,
        unit,
        display: `${value.toFixed(precision)} ${unitDef.si} (${imperialValue.toFixed(precision)} ${unitDef.imperial})`
      };
    }
  }

  const precision = unitDef.precision || 2;
  return {
    value: displayValue,
    unit: displayUnit,
    display: `${displayValue.toFixed(precision)} ${displayUnit}`
  };
}

// Get preferred unit for category and system
export function getPreferredUnit(category: UnitCategory, system: UnitSystem): string {
  const categoryUnits = Object.values(UNITS_REGISTRY).filter(u => u.category === category);

  if (categoryUnits.length === 0) {
    throw new Error(`No units found for category: ${category}`);
  }

  if (system === 'SI') {
    return categoryUnits[0].si;
  } else {
    return categoryUnits[0].imperial;
  }
}