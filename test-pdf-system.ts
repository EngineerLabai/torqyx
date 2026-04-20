import { createBoltCalculatorReport } from "@/lib/pdf/reportConverters";
import { ReportHelpers } from "@/lib/pdf/reportConverters";

// Test verisi
const testInput = {
  d: 10, // Nominal diameter
  P: 1.5, // Pitch
  grade: "8.8",
  friction: "dry",
  preloadPercent: 70,
};

const testResult = {
  stressArea: 58.0, // Stress area
  yieldStrength: 640, // MPa
  ultimateStrength: 800, // MPa
  preloadForce: 15000,
  torque: 80,
  safetyFactor: 1.5,
};

// Test converter
const reportData = createBoltCalculatorReport(
  testInput,
  testResult,
  "bolt-calculator",
  "Bolt Calculator",
  "SI"
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