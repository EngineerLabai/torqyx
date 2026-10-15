import { describe, expect, it } from "vitest";
import { calculateShaftTorsion, DEFAULT_INPUT } from "@/tools/shaft-torsion/logic";

describe("shaft torsion calculator", () => {
  it("calculates shear stress, polar moment, and twist angle correctly", () => {
    // T = 250 Nm, d = 30 mm, L = 800 mm, G = 80 GPa, allowableShear = 100 MPa
    const result = calculateShaftTorsion({
      ...DEFAULT_INPUT,
      allowableShear: "100",
    });

    expect(result.error).toBeUndefined();

    // Polar moment J = pi * d^4 / 32
    // J = pi * 30^4 / 32 ≈ 79521.564 mm^4
    expect(result.polarMoment).toBeCloseTo(79521.564, 2);

    // Shear stress tau = 16 * T / (pi * d^3)
    // T = 250000 Nmm, tau = 16 * 250000 / (pi * 27000) ≈ 47.157 MPa
    expect(result.tau).toBeCloseTo(47.157, 2);

    // Angle of twist theta = T * L / (J * G)
    // thetaRad = (250000 * 800) / (79521.564 * 80000) ≈ 0.031435 rad
    expect(result.thetaRad).toBeCloseTo(0.031435, 5);
    // thetaDeg = 0.031435 * 180 / pi ≈ 1.801 deg
    expect(result.thetaDeg).toBeCloseTo(1.801, 2);

    // Safety factor = allowable / tau = 100 / 47.157 ≈ 2.12
    expect(result.safety).toBeCloseTo(2.12, 2);
  });

  it("handles optional allowable stress correctly", () => {
    const result = calculateShaftTorsion({
      ...DEFAULT_INPUT,
      allowableShear: "0",
    });
    expect(result.error).toBeUndefined();
    expect(result.safety).toBeNull();
  });

  it.each([
    { torque: "0", diameter: "30", length: "800", shearModulus: "80", allowableShear: "0" },
    { torque: "-50", diameter: "30", length: "800", shearModulus: "80", allowableShear: "0" },
    { torque: "250", diameter: "0", length: "800", shearModulus: "80", allowableShear: "0" },
    { torque: "250", diameter: "-10", length: "800", shearModulus: "80", allowableShear: "0" },
    { torque: "250", diameter: "30", length: "0", shearModulus: "80", allowableShear: "0" },
    { torque: "250", diameter: "30", length: "800", shearModulus: "0", allowableShear: "0" },
    { torque: "abc", diameter: "30", length: "800", shearModulus: "80", allowableShear: "0" },
  ])("rejects invalid input %#", (input) => {
    const result = calculateShaftTorsion(input);
    expect(result.error).toBeTruthy();
    expect(result.tau).toBeNull();
    expect(result.thetaDeg).toBeNull();
  });

  it("supports comma decimal separators", () => {
    const result = calculateShaftTorsion({
      torque: "250,5",
      diameter: "30,2",
      length: "800,5",
      shearModulus: "79,5",
      allowableShear: "95,5",
    });
    expect(result.error).toBeUndefined();
    expect(result.tau).toBeGreaterThan(0);
    expect(result.thetaDeg).toBeGreaterThan(0);
    expect(result.safety).toBeGreaterThan(0);
  });
});
