import { createBoltCalculatorReport } from "@/lib/pdf/reportConverters";
import { ReportHelpers } from "@/lib/pdf/reportConverters";

// Test verisi
const testInput = {
  d: 10, // Nominal diameter
  pitch: 1.5, // Pitch
  length: 50, // Length
};

const testResult = {
  stressArea: 58.0, // Stress area
  tensileStrength: 800, // MPa
  yieldStrength: 640, // MPa
  safetyFactor: 1.5,
};

// Test converter
const reportData = createBoltCalculatorReport(
  testInput,
  testResult,
  "bolt-calculator",
  "Bolt Calculator"
);

console.log("Test Report Data:", JSON.stringify(reportData, null, 2));

// Test helpers
const param = ReportHelpers.createParameter("Test Param", 100, "mm");
const formula = ReportHelpers.createFormula("Test Formula", "F = m*a", "Newton's law");
const result = ReportHelpers.createResult("Test Result", 150, "N", "pass");
const standard = ReportHelpers.createStandard("ISO 1234", "Test Standard", "https://example.com");

console.log("Test Helpers:");
console.log("Parameter:", param);
console.log("Formula:", formula);
console.log("Result:", result);
console.log("Standard:", standard);