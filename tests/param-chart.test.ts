import { describe, expect, it } from "vitest";
import { calculateChart, DEFAULT_INPUT } from "@/tools/param-chart/logic";

describe("param chart spring force calculator", () => {
  it("calculates spring force according to Hooke's Law (F = k * x)", () => {
    // stiffness = 500 N/m, maxDisplacement = 20 mm = 0.02 m, steps = 6
    const result = calculateChart(DEFAULT_INPUT);

    expect(result.error).toBeUndefined();

    // F_max = 500 N/m * 0.02 m = 10 N
    expect(result.maxForce).toBeCloseTo(10, 4);

    // stepSize = 20 / (6 - 1) = 4 mm
    expect(result.stepSize).toBeCloseTo(4, 4);

    // points array should have 6 points
    expect(result.points.length).toBe(6);
    expect(result.points[0]).toEqual({ x: 0, y: 0 });
    expect(result.points[5].x).toBeCloseTo(20, 4);
    expect(result.points[5].y).toBeCloseTo(10, 4);
  });

  it("supports comma decimal inputs", () => {
    const result = calculateChart({
      stiffness: "500,5",
      maxDisplacement: "20,5",
      steps: "6",
    });

    expect(result.error).toBeUndefined();
    expect(result.maxForce).toBeGreaterThan(0);
    expect(result.stepSize).toBeGreaterThan(0);
  });

  it.each([
    { stiffness: "0", maxDisplacement: "20", steps: "6" },
    { stiffness: "-100", maxDisplacement: "20", steps: "6" },
    { stiffness: "500", maxDisplacement: "0", steps: "6" },
    { stiffness: "500", maxDisplacement: "-5", steps: "6" },
    { stiffness: "500", maxDisplacement: "20", steps: "1" },
    { stiffness: "text", maxDisplacement: "20", steps: "6" },
  ])("rejects invalid input %#", (input) => {
    const result = calculateChart(input);
    expect(result.error).toBeTruthy();
    expect(result.maxForce).toBeNull();
    expect(result.points).toEqual([]);
  });
});
