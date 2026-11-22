import { describe, expect, it } from "vitest";
import {
  BOLT_PROPERTY_CLASSES,
  BOLT_THREAD_DEFINITIONS,
  BOLT_TORQUE_TABLE_DATA,
  DEFAULT_PRELOAD_PERCENT,
  generateBoltTorqueTable,
} from "@/data/bolt-torque-table";
import { calculateBolt } from "@/tools/bolt-calculator/logic";
import { localePath, resolveInternalPath } from "@/utils/locale-path";
import * as fs from "fs";
import * as path from "path";

describe("Bolt Tightening Torque Table (M3 - M36)", () => {
  it("covers all standard metric diameters from M3 to M36", () => {
    const sizes = BOLT_THREAD_DEFINITIONS.map((def) => def.size);
    const expectedSizes = [
      "M3",
      "M4",
      "M5",
      "M6",
      "M8",
      "M10",
      "M12",
      "M14",
      "M16",
      "M18",
      "M20",
      "M22",
      "M24",
      "M27",
      "M30",
      "M36",
    ];

    expect(sizes).toEqual(expectedSizes);
  });

  it("defines both coarse and fine pitches for every diameter", () => {
    for (const def of BOLT_THREAD_DEFINITIONS) {
      expect(def.coarsePitch).toBeGreaterThan(0);
      expect(def.finePitches.length).toBeGreaterThanOrEqual(1);
      for (const finePitch of def.finePitches) {
        expect(finePitch).toBeLessThan(def.coarsePitch);
      }
    }
  });

  it("includes property classes 8.8, 10.9, and 12.9", () => {
    expect(BOLT_PROPERTY_CLASSES).toEqual(["8.8", "10.9", "12.9"]);
  });

  it("computes every single table entry directly from calculateBolt (zero manual numbers)", () => {
    const tableData = generateBoltTorqueTable();
    expect(tableData.length).toBeGreaterThan(50);
    expect(tableData.length).toBe(BOLT_TORQUE_TABLE_DATA.length);

    for (const row of tableData) {
      const independentDry = calculateBolt({
        presetId: "custom",
        d: String(row.d),
        P: String(row.pitch),
        grade: row.grade,
        preloadPercent: DEFAULT_PRELOAD_PERCENT,
        friction: "dry",
      });

      const independentOiled = calculateBolt({
        presetId: "custom",
        d: String(row.d),
        P: String(row.pitch),
        grade: row.grade,
        preloadPercent: DEFAULT_PRELOAD_PERCENT,
        friction: "oiled",
      });

      expect(independentDry.error).toBeUndefined();
      expect(independentOiled.error).toBeUndefined();

      // Tensile stress area As must match calculateBolt exactly
      expect(row.As).toBe(independentDry.As);

      // Preload Fv must match calculateBolt exactly
      expect(row.Fv).toBe(independentDry.Fv);

      // Yield strength must match calculateBolt exactly
      expect(row.yieldStrength).toBe(independentDry.yieldStrength);

      // Dry tightening torque must match calculateBolt exactly
      expect(row.torqueDry).toBe(independentDry.torque);

      // Oiled tightening torque must match calculateBolt exactly
      expect(row.torqueOiled).toBe(independentOiled.torque);

      // Verify dry torque is strictly 25% higher than oiled torque (K=0.25 vs K=0.20)
      expect(row.torqueDry).toBeCloseTo(row.torqueOiled * 1.25, 4);

      // Verify prefilled calculator URLs
      expect(row.calculatorUrlTr).toContain(`/tr/tools/bolt-calculator?presetId=custom&d=${row.d}&P=${row.pitch}&grade=${row.grade}`);
      expect(row.calculatorUrlEn).toContain(`/en/tools/bolt-calculator?presetId=custom&d=${row.d}&P=${row.pitch}&grade=${row.grade}`);
    }
  });

  it("verifies physical mechanics: higher grade yields higher preload and torque for identical size", () => {
    const m12Coarse88 = BOLT_TORQUE_TABLE_DATA.find((r) => r.size === "M12" && r.pitchType === "coarse" && r.grade === "8.8")!;
    const m12Coarse109 = BOLT_TORQUE_TABLE_DATA.find((r) => r.size === "M12" && r.pitchType === "coarse" && r.grade === "10.9")!;
    const m12Coarse129 = BOLT_TORQUE_TABLE_DATA.find((r) => r.size === "M12" && r.pitchType === "coarse" && r.grade === "12.9")!;

    expect(m12Coarse88).toBeDefined();
    expect(m12Coarse109).toBeDefined();
    expect(m12Coarse129).toBeDefined();

    expect(m12Coarse109.Fv).toBeGreaterThan(m12Coarse88.Fv);
    expect(m12Coarse129.Fv).toBeGreaterThan(m12Coarse109.Fv);

    expect(m12Coarse109.torqueDry).toBeGreaterThan(m12Coarse88.torqueDry);
    expect(m12Coarse129.torqueDry).toBeGreaterThan(m12Coarse109.torqueDry);

    expect(m12Coarse109.torqueOiled).toBeGreaterThan(m12Coarse88.torqueOiled);
    expect(m12Coarse129.torqueOiled).toBeGreaterThan(m12Coarse109.torqueOiled);
  });

  it("verifies fine pitch stress area As is greater than coarse pitch for same nominal diameter", () => {
    const m16Coarse = BOLT_TORQUE_TABLE_DATA.find((r) => r.size === "M16" && r.pitchType === "coarse" && r.grade === "8.8")!;
    const m16Fine = BOLT_TORQUE_TABLE_DATA.find((r) => r.size === "M16" && r.pitchType === "fine" && r.grade === "8.8")!;

    expect(m16Fine.As).toBeGreaterThan(m16Coarse.As);
    expect(m16Fine.Fv).toBeGreaterThan(m16Coarse.Fv);
  });

  it("resolves localized routes correctly for TR and EN", () => {
    const internal = "/reference/civata-sikma-torku-tablosu";

    expect(localePath("tr", internal)).toBe("/tr/referans/civata-sikma-torku-tablosu");
    expect(localePath("en", internal)).toBe("/en/reference/bolt-tightening-torque-table");

    expect(resolveInternalPath("/referans/civata-sikma-torku-tablosu")).toBe(internal);
    expect(resolveInternalPath("/reference/bolt-tightening-torque-table")).toBe(internal);
  });

  it("provides 500+ words technical explanation with worked example and pitfalls in TR and EN", () => {
    const contentFilePath = path.join(process.cwd(), "components/reference/BoltTorqueContent.tsx");
    const fileContent = fs.readFileSync(contentFilePath, "utf8");

    // Extract TR and EN blocks roughly
    const trIndex = fileContent.indexOf('if (locale === "tr")');
    const enIndex = fileContent.indexOf("// English version");

    const trBlock = fileContent.slice(trIndex, enIndex);
    const enBlock = fileContent.slice(enIndex);

    // Strip HTML/JSX tags
    const trText = trBlock.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
    const enText = enBlock.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

    const trWords = trText.split(" ").filter((w) => w.length > 1).length;
    const enWords = enText.split(" ").filter((w) => w.length > 1).length;

    expect(trWords).toBeGreaterThanOrEqual(500);
    expect(enWords).toBeGreaterThanOrEqual(500);

    // Verify worked example
    expect(fileContent).toContain("84.27");
    expect(fileContent).toContain("37.75");
    expect(fileContent).toContain("113.26");
    expect(fileContent).toContain("90.61");

    // Verify pitfalls
    expect(fileContent).toContain("Pitfall");
    expect(fileContent).toContain("Hata");

    // Verify internal links to tools, blogs, and guides
    expect(fileContent).toContain("/tools/bolt-calculator");
    expect(fileContent).toContain("/blog/civata-on-yuku-vdi-2230");
    expect(fileContent).toContain("/blog/tork-katsayisi-k-faktoru-nedir");
    expect(fileContent).toContain("/blog/iso-898-1-civata-standartlari");
    expect(fileContent).toContain("/blog/civata-mukavemet-siniflari-8-8-10-9-12-9");
    expect(fileContent).toContain("/guides/civata-basi-sekilleri-ve-turleri");
  });
});
