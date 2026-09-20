import { describe, expect, it } from "vitest";
import {
  calculateCompressorCc,
  parseCompressorNumber,
  type CompressorCcErrorCode,
  type CompressorCcInput,
} from "@/tools/compressor-cc/logic";

const VALID_INPUT: CompressorCcInput = {
  bore: "60",
  stroke: "45",
  cylinders: "2",
  rpm: "1400",
  volumetricEff: "80",
  acting: "single",
};

const expectError = (input: CompressorCcInput, error: CompressorCcErrorCode) => {
  expect(calculateCompressorCc(input)).toEqual({ ok: false, error });
};

describe("compressor displacement calculation", () => {
  it("calculates the production default as geometric displacement, not FAD", () => {
    const calculation = calculateCompressorCc(VALID_INPUT);

    expect(calculation.ok).toBe(true);
    if (!calculation.ok) return;

    expect(calculation.result.geometricDisplacementCcPerRev).toBeCloseTo(254.469, 3);
    expect(calculation.result.geometricDisplacementLPerRev).toBeCloseTo(0.254469, 6);
    expect(calculation.result.geometricFlowLMin).toBeCloseTo(356.2566, 4);
    expect(calculation.result.efficiencyAdjustedFlowLMin).toBeCloseTo(285.0053, 4);
    expect(calculation.result).toMatchObject({
      actingFactor: 1,
      model: "ideal-geometric-displacement",
      isFad: false,
      rodAreaDeducted: false,
    });
  });

  it("uses the documented ideal factor of two for double-acting mode", () => {
    const single = calculateCompressorCc(VALID_INPUT);
    const double = calculateCompressorCc({ ...VALID_INPUT, acting: "double" });

    expect(single.ok).toBe(true);
    expect(double.ok).toBe(true);
    if (!single.ok || !double.ok) return;

    expect(double.result.actingFactor).toBe(2);
    expect(double.result.geometricDisplacementCcPerRev).toBeCloseTo(
      single.result.geometricDisplacementCcPerRev * 2,
      10,
    );
    expect(double.result.efficiencyAdjustedFlowLMin).toBeCloseTo(
      single.result.efficiencyAdjustedFlowLMin * 2,
      10,
    );
  });

  it("accepts decimal commas without accepting partial or grouped numbers", () => {
    const comma = calculateCompressorCc({
      ...VALID_INPUT,
      bore: "60,5",
      stroke: "45,25",
      volumetricEff: "82,5",
    });
    const point = calculateCompressorCc({
      ...VALID_INPUT,
      bore: "60.5",
      stroke: "45.25",
      volumetricEff: "82.5",
    });

    expect(comma).toEqual(point);
    expect(parseCompressorNumber(" 1,25e2 ")).toBe(125);
    expect(parseCompressorNumber("1,2,3")).toBeNull();
    expect(parseCompressorNumber("12 mm")).toBeNull();
  });

  it.each(["", "abc", "Infinity", "1e309", "1.2,3"])(
    "rejects invalid numeric input %j",
    (bore) => {
      expectError({ ...VALID_INPUT, bore }, "invalid-number");
    },
  );

  it.each([
    { key: "bore", value: "0" },
    { key: "stroke", value: "-1" },
    { key: "rpm", value: "0" },
  ] as const)("rejects non-positive $key", ({ key, value }) => {
    expectError({ ...VALID_INPUT, [key]: value }, "non-positive");
  });

  it.each(["0", "1.5", "-2", "9007199254740992"])(
    "requires a positive safe integer cylinder count: %s",
    (cylinders) => {
      expectError({ ...VALID_INPUT, cylinders }, "invalid-cylinder-count");
    },
  );

  it("accepts 120% efficiency but rejects zero and values above 120%", () => {
    expect(calculateCompressorCc({ ...VALID_INPUT, volumetricEff: "120" }).ok).toBe(true);
    expectError({ ...VALID_INPUT, volumetricEff: "0" }, "invalid-efficiency");
    expectError({ ...VALID_INPUT, volumetricEff: "120.0001" }, "invalid-efficiency");
  });

  it("rejects invalid acting modes at runtime", () => {
    expectError(
      { ...VALID_INPUT, acting: "triple" } as unknown as CompressorCcInput,
      "invalid-acting",
    );
  });

  it("rejects finite inputs whose calculated result overflows", () => {
    expectError({ ...VALID_INPUT, bore: "1e308" }, "result-out-of-range");
  });
});
