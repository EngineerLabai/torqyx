export type BeltPulleySource = "D1" | "D2" | "equal";

export type OpenBeltInput = {
  d1: string | number;
  d2: string | number;
  center: string | number;
};

export type OpenBeltResult =
  | {
      ok: true;
      length: number;
      dBig: number;
      dSmall: number;
      bigPulleySource: BeltPulleySource;
      smallPulleySource: BeltPulleySource;
      ratio: number;
      betaSmallDeg: number;
      betaBigDeg: number;
    }
  | {
      ok: false;
      reason: "invalid-input" | "invalid-geometry" | "overlapping-pulleys";
    };

const toFiniteNumber = (value: string | number) => {
  const parsed = typeof value === "number" ? value : Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Open-belt approximation for pulley pitch diameters and shaft centre distance.
 * Angles are returned for the physical small and large pulleys, independent of
 * whether the user entered the larger diameter as D1 or D2.
 */
export function calculateOpenBelt(input: OpenBeltInput): OpenBeltResult {
  const d1 = toFiniteNumber(input.d1);
  const d2 = toFiniteNumber(input.d2);
  const center = toFiniteNumber(input.center);

  if (d1 === null || d2 === null || center === null || d1 <= 0 || d2 <= 0 || center <= 0) {
    return { ok: false, reason: "invalid-input" };
  }

  const dBig = Math.max(d1, d2);
  const dSmall = Math.min(d1, d2);
  const ratio = (dBig - dSmall) / (2 * center);

  if (ratio >= 1) {
    return { ok: false, reason: "invalid-geometry" };
  }

  // A valid tangent can still describe two pitch circles that physically
  // overlap. Reject that layout separately so the message is actionable.
  if (center <= (dBig + dSmall) / 2) {
    return { ok: false, reason: "overlapping-pulleys" };
  }

  const length =
    2 * center +
    (Math.PI / 2) * (dBig + dSmall) +
    Math.pow(dBig - dSmall, 2) / (4 * center);
  const offsetAngle = Math.asin(ratio);
  const betaSmallDeg = ((Math.PI - 2 * offsetAngle) * 180) / Math.PI;
  const betaBigDeg = ((Math.PI + 2 * offsetAngle) * 180) / Math.PI;
  const equal = d1 === d2;

  return {
    ok: true,
    length,
    dBig,
    dSmall,
    ratio,
    betaSmallDeg,
    betaBigDeg,
    bigPulleySource: equal ? "equal" : d1 > d2 ? "D1" : "D2",
    smallPulleySource: equal ? "equal" : d1 < d2 ? "D1" : "D2",
  };
}
