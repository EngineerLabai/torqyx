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

  it("handles locale thousands grouping when locale is provided", () => {
    // TR: '.' is thousands, ',' is decimal
    const trRes = calculateChart({ stiffness: "1.500", maxDisplacement: "20", steps: "5", locale: "tr" });
    expect(trRes.error).toBeUndefined();
    expect(trRes.maxForce).toBe(30);

    // EN: ',' is thousands, '.' is decimal
    const enRes = calculateChart({ stiffness: "1,500", maxDisplacement: "20", steps: "5", locale: "en" });
    expect(enRes.error).toBeUndefined();
    expect(enRes.maxForce).toBe(30);

    // Cross-locale grouping is rejected (English grouping 1,500.50 in Turkish locale)
    const trMismatch = calculateChart({ stiffness: "1,500.50", maxDisplacement: "20", steps: "5", locale: "tr" });
    expect(trMismatch.error).toBeTruthy();
  });
});
