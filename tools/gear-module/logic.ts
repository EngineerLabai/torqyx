export const STANDARD_MODULES = [0.5, 0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20] as const;

export type GearModuleResult = {
  mRaw: number;
  pitchDiameter: number;
  circularPitch: number;
  suggestedM: number;
  suggestedDiameter: number;
  diffPercent: number;
  approximateUndercutRisk: boolean;
  approximateMinimumTeeth: number;
};

const toNumber = (value: string | number) => {
  const parsed = typeof value === "number" ? value : Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
};

export function calculateGearModule({
  diameter,
  teeth,
}: {
  diameter: string | number;
  teeth: string | number;
}): GearModuleResult | null {
  const d = toNumber(diameter);
  const z = toNumber(teeth);
  if (d === null || z === null || d <= 0 || z <= 0 || !Number.isInteger(z)) return null;

  const mRaw = d / z;
  const circularPitch = Math.PI * mRaw;
  const suggestedM = STANDARD_MODULES.reduce((best, candidate) =>
    Math.abs(candidate - mRaw) < Math.abs(best - mRaw) ? candidate : best,
  );
  const suggestedDiameter = suggestedM * z;
  const diffPercent = ((suggestedM - mRaw) / mRaw) * 100;
  const approximateMinimumTeeth = 17;

  return {
    mRaw,
    pitchDiameter: d,
    circularPitch,
    suggestedM,
    suggestedDiameter,
    diffPercent,
    approximateUndercutRisk: z < approximateMinimumTeeth,
    approximateMinimumTeeth,
  };
}
