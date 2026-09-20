import { describe, expect, it } from "vitest";
import {
  powerFromTorqueAndSpeed,
  speedFromPowerAndTorque,
  torqueFromPowerAndSpeed,
  torquePowerTool,
} from "@/tools/registry";

describe("torque, power, and speed conversions", () => {
  it("uses the 9550 engineering conversions consistently", () => {
    const torque = torqueFromPowerAndSpeed(5.5, 1500);
    expect(torque).toBeCloseTo(35.0167, 4);
    expect(powerFromTorqueAndSpeed(torque ?? 0, 1500)).toBeCloseTo(5.5, 10);
    expect(speedFromPowerAndTorque(5.5, torque ?? 0)).toBeCloseTo(1500, 10);
  });

  it("labels efficiency as an input-to-output power loss", () => {
    const result = torquePowerTool.calculate({ powerKw: 5.5, rpm: 1500, mechEff: 95 });
    expect(result.error).toBeUndefined();
    expect(result.inputPowerKw).toBe(5.5);
    expect(result.outputPowerKw).toBeCloseTo(5.225, 10);
    expect(result.torqueNm).toBeCloseTo(35.0167, 4);
    expect(result.torqueNmEff).toBeCloseTo(33.2658, 4);
    expect(result.efficiency).toBe(0.95);
  });

  it.each([
    [0, 1500],
    [5.5, 0],
    [-1, 1500],
    [Number.NaN, 1500],
  ])("does not create infinite torque for invalid input %#", (power, rpm) => {
    expect(torqueFromPowerAndSpeed(power, rpm)).toBeNull();
  });

  it("does not divide by zero for power or speed inversions", () => {
    expect(powerFromTorqueAndSpeed(0, 1500)).toBeNull();
    expect(speedFromPowerAndTorque(5.5, 0)).toBeNull();
    expect(torquePowerTool.calculate({ powerKw: 5.5, rpm: 0, mechEff: 95 }).torqueNm).toBeNull();
  });

  it("rejects efficiency outside 0-100 percent", () => {
    expect(torquePowerTool.calculate({ powerKw: 5.5, rpm: 1500, mechEff: 101 }).error).toBeTruthy();
    expect(torquePowerTool.calculate({ powerKw: 5.5, rpm: 1500, mechEff: -1 }).error).toBeTruthy();
  });
});
