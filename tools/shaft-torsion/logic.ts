import type { ShaftTorsionInput, ShaftTorsionResult } from "./types";

export const DEFAULT_INPUT: ShaftTorsionInput = {
  torque: "250",
  diameter: "30",
  length: "800",
  shearModulus: "80",
  allowableShear: "0",
};

const toNumber = (value: string) => Number.parseFloat(value.replace(",", "."));

export const calculateShaftTorsion = (input: ShaftTorsionInput): ShaftTorsionResult => {
  const torque = toNumber(input.torque);
  const diameter = toNumber(input.diameter);
  const length = toNumber(input.length);
  const shearModulus = toNumber(input.shearModulus);
  const allowable = toNumber(input.allowableShear);

  if (
    !Number.isFinite(torque) ||
    !Number.isFinite(diameter) ||
    !Number.isFinite(length) ||
    !Number.isFinite(shearModulus) ||
    torque <= 0 ||
    diameter <= 0 ||
    length <= 0 ||
    shearModulus <= 0
  ) {
    return {
      tau: null,
      polarMoment: null,
      thetaRad: null,
      thetaDeg: null,
      safety: null,
      error: "Pozitif ve sonlu değerler girin.",
    };
  }

  const torqueNmm = torque * 1000;
  const tau = (16 * torqueNmm) / (Math.PI * Math.pow(diameter, 3));
  const polarMoment = (Math.PI * Math.pow(diameter, 4)) / 32;
  const shearModulusMpa = shearModulus * 1000;
  const thetaRad = (torqueNmm * length) / (polarMoment * shearModulusMpa);
  const thetaDeg = (thetaRad * 180) / Math.PI;
  const safety = Number.isFinite(allowable) && allowable > 0 ? allowable / tau : null;

  if (
    !Number.isFinite(tau) ||
    !Number.isFinite(polarMoment) ||
    !Number.isFinite(thetaRad) ||
    !Number.isFinite(thetaDeg) ||
    (safety !== null && !Number.isFinite(safety))
  ) {
    return {
      tau: null,
      polarMoment: null,
      thetaRad: null,
      thetaDeg: null,
      safety: null,
      error: "Girdiler hesaplama aralığının dışında.",
    };
  }

  return { tau, polarMoment, thetaRad, thetaDeg, safety };
};
