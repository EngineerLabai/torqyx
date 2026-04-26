import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPath = path.join(__dirname, "messages", "en.json");
const trPath = path.join(__dirname, "messages", "tr.json");

const enData = JSON.parse(fs.readFileSync(enPath, "utf-8"));
const trData = JSON.parse(fs.readFileSync(trPath, "utf-8"));

// 1. tr.json içindeki eksikler
if (trData.pages && trData.pages.sanityCheck && trData.pages.sanityCheck.tabs) {
  if (!trData.pages.sanityCheck.tabs.goalSeek) {
    trData.pages.sanityCheck.tabs.goalSeek = "Hedef Arama";
  }
}

// 2. en.json içindeki eksikler
if (enData.pages && enData.pages.keywayDesign) {
  if (!enData.pages.keywayDesign.inputs.yieldKey) {
    enData.pages.keywayDesign.inputs.yieldKey = "Key Yield Strength Re [MPa]";
    enData.pages.keywayDesign.inputs.yieldHub = "Hub Yield Strength Re [MPa]";
  }
  if (!enData.pages.keywayDesign.results.safetyShear) {
    enData.pages.keywayDesign.results.safetyShear = "Shear Safety Factor S_tau";
    enData.pages.keywayDesign.results.safetyCrush = "Crushing Safety Factor S_c";
    enData.pages.keywayDesign.results.diagramTitle = "Connection Diagram and Analysis";
    enData.pages.keywayDesign.results.diagramEmpty = "Diagram will be generated when inputs are provided.";
    enData.pages.keywayDesign.results.reportTitle = "Detailed DIN 6885 Report";
    enData.pages.keywayDesign.results.reportDesc = "Generate a PDF report with calculation steps, safety limits, and diagrams.";
    enData.pages.keywayDesign.results.downloadPdf = "Download PDF Report";
  }
}

if (!enData.workspace) {
  enData.workspace = {
    variables: {
      title: "Workspace Variables",
      import: "Import Value",
      export: "Save to Workspace",
      empty: "No variables in the workspace yet.",
      savedFrom: "from {tool} tool",
      successSaved: "Added to workspace.",
      successImported: "Variable imported successfully.",
      clearAll: "Clear All"
    },
    material: {
      active: "Active Material",
      clear: "Clear Material",
      applyToForm: "Apply to Form"
    }
  };
}

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), "utf-8");
fs.writeFileSync(trPath, JSON.stringify(trData, null, 2), "utf-8");

console.log("✅ Tüm eksik i18n çeviri anahtarları başarıyla onarıldı!");