export type ToleranceUnit = "mm" | "in";
export type StackDirection = 1 | -1;

export type ToleranceDimension = {
  id: string;
  label: string;
  nominal: number;
  upperDeviation: number;
  lowerDeviation: number;
  direction: StackDirection;
};

export type EffectiveToleranceDimension = ToleranceDimension & {
  effectiveUpperDeviation: number;
  effectiveLowerDeviation: number;
  toleranceHalfRange: number;
  toleranceCenter: number;
};

export type ToleranceSensitivity = {
  id: string;
  label: string;
  halfRange: number;
  varianceContribution: number;
  contributionPercent: number;
};

export type ToleranceStackResult = {
  effectiveDimensions: EffectiveToleranceDimension[];
  nominalResult: number;
  worstCaseMin: number;
  worstCaseMax: number;
  worstCaseTolerance: number;
  rssNominal: number;
  rssMin: number;
  rssMax: number;
  rssHalfRange: number;
  sensitivity: ToleranceSensitivity[];
};

export class ToleranceInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ToleranceInputError";
  }
}

const isFiniteNumber = (value: number) => Number.isFinite(value);

export const validateToleranceDimensions = (dimensions: ToleranceDimension[]) => {
  if (dimensions.length === 0) {
    throw new ToleranceInputError("At least one dimension is required.");
  }

  const ids = new Set<string>();
  dimensions.forEach((dimension, index) => {
    if (!dimension.id || ids.has(dimension.id)) {
      throw new ToleranceInputError(`Dimension ${index + 1} has a duplicate or missing id.`);
    }
    ids.add(dimension.id);

    if (!dimension.label.trim()) {
      throw new ToleranceInputError(`Dimension ${index + 1} needs a label.`);
    }

    if (![dimension.nominal, dimension.upperDeviation, dimension.lowerDeviation].every(isFiniteNumber)) {
      throw new ToleranceInputError(`Dimension ${index + 1} contains a non-finite value.`);
    }

    if (dimension.upperDeviation < dimension.lowerDeviation) {
      throw new ToleranceInputError(`Dimension ${index + 1} has upper deviation below lower deviation.`);
    }

    if (dimension.direction !== 1 && dimension.direction !== -1) {
      throw new ToleranceInputError(`Dimension ${index + 1} has an invalid direction.`);
    }
  });
};

export const calculateToleranceStack = (dimensions: ToleranceDimension[]): ToleranceStackResult => {
  validateToleranceDimensions(dimensions);

  const effectiveDimensions = dimensions.map((dimension) => {
    const effectiveLowerDeviation =
      dimension.direction === 1 ? dimension.lowerDeviation : -dimension.upperDeviation;
    const effectiveUpperDeviation =
      dimension.direction === 1 ? dimension.upperDeviation : -dimension.lowerDeviation;
    const toleranceHalfRange = (effectiveUpperDeviation - effectiveLowerDeviation) / 2;
    const toleranceCenter = (effectiveUpperDeviation + effectiveLowerDeviation) / 2;

    return {
      ...dimension,
      effectiveLowerDeviation,
      effectiveUpperDeviation,
      toleranceHalfRange,
      toleranceCenter,
    };
  });

  const nominalResult = effectiveDimensions.reduce(
    (sum, dimension) => sum + dimension.direction * dimension.nominal,
    0,
  );
  const lowerDeviation = effectiveDimensions.reduce(
    (sum, dimension) => sum + dimension.effectiveLowerDeviation,
    0,
  );
  const upperDeviation = effectiveDimensions.reduce(
    (sum, dimension) => sum + dimension.effectiveUpperDeviation,
    0,
  );
  const worstCaseMin = nominalResult + lowerDeviation;
  const worstCaseMax = nominalResult + upperDeviation;
  const rssCenter = effectiveDimensions.reduce((sum, dimension) => sum + dimension.toleranceCenter, 0);
  const rssHalfRange = Math.sqrt(
    effectiveDimensions.reduce((sum, dimension) => sum + dimension.toleranceHalfRange ** 2, 0),
  );
  const rssNominal = nominalResult + rssCenter;
  const variance = effectiveDimensions.reduce(
    (sum, dimension) => sum + dimension.toleranceHalfRange ** 2,
    0,
  );
  const sensitivity = effectiveDimensions.map((dimension) => {
    const varianceContribution = dimension.toleranceHalfRange ** 2;
    return {
      id: dimension.id,
      label: dimension.label,
      halfRange: dimension.toleranceHalfRange,
      varianceContribution,
      contributionPercent: variance > 0 ? (varianceContribution / variance) * 100 : 0,
    };
  });

  return {
    effectiveDimensions,
    nominalResult,
    worstCaseMin,
    worstCaseMax,
    worstCaseTolerance: worstCaseMax - worstCaseMin,
    rssNominal,
    rssMin: rssNominal - rssHalfRange,
    rssMax: rssNominal + rssHalfRange,
    rssHalfRange,
    sensitivity,
  };
};

export const convertLength = (value: number, from: ToleranceUnit, to: ToleranceUnit) => {
  if (from === to) return value;
  return from === "mm" ? value / 25.4 : value * 25.4;
};

export const formatToleranceEquation = (dimensions: ToleranceDimension[], resultSymbol = "X") => {
  const terms = dimensions.map((dimension, index) => {
    const sign = dimension.direction === -1 ? "−" : index === 0 ? "" : "+";
    return `${sign}${index === 0 || dimension.direction === -1 ? " " : " "}${dimension.label}`;
  });
  return `${resultSymbol} = ${terms.join(" ")}`.replace(/=\s+/, "= ");
};
