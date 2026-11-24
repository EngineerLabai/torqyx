import { describe, expect, it } from "vitest";
import {
  PARALLEL_KEY_DEFINITIONS,
  PARALLEL_KEY_TABLE_DATA,
  calculateKeyCapacity,
  generateParallelKeyTable,
} from "@/data/parallel-key-table";
import { localePath, resolveInternalPath } from "@/utils/locale-path";
import * as fs from "fs";
import * as path from "path";

describe("DIN 6885-1 Parallel Key Reference Table", () => {
  it("covers all 26 standard shaft diameter ranges from 6 mm to 500 mm", () => {
    expect(PARALLEL_KEY_DEFINITIONS.length).toBe(26);
    expect(PARALLEL_KEY_DEFINITIONS[0].dMin).toBe(6);
    expect(PARALLEL_KEY_DEFINITIONS[0].dMax).toBe(8);
    expect(PARALLEL_KEY_DEFINITIONS[PARALLEL_KEY_DEFINITIONS.length - 1].dMax).toBe(500);

    // Verify contiguous shaft diameter spans
    for (let i = 0; i < PARALLEL_KEY_DEFINITIONS.length - 1; i++) {
      expect(PARALLEL_KEY_DEFINITIONS[i].dMax).toBe(PARALLEL_KEY_DEFINITIONS[i + 1].dMin);
    }
  });

  it("satisfies standard geometric and tolerance rules for all 26 steps", () => {
    for (const def of PARALLEL_KEY_DEFINITIONS) {
      expect(def.b).toBeGreaterThan(0);
      expect(def.h).toBeGreaterThan(0);
      expect(def.t1).toBeGreaterThan(0);
      expect(def.t2).toBeGreaterThan(0);

      // Crucial DIN 6885-1 geometric rule: t1 + t2 > h (radial clearance so top doesn't wedge)
      expect(def.t1 + def.t2).toBeGreaterThan(def.h);

      // Nominal diameter must lie within the range
      expect(def.dNominal).toBeGreaterThanOrEqual(def.dMin);
      expect(def.dNominal).toBeLessThanOrEqual(def.dMax);

      // Available standard lengths
      expect(def.standardLengths.length).toBeGreaterThanOrEqual(5);
      expect(def.standardLengths).toContain(def.defaultLength);

      // Standard tolerances specified
      expect(def.tolShaftKeywayP9).toBeDefined();
      expect(def.tolHubKeywayJS9).toBeDefined();
      expect(def.tolDepth).toBeDefined();
    }
  });

  it("computes every table entry deterministically with zero manual numbers", () => {
    const tableData = generateParallelKeyTable();
    expect(tableData.length).toBe(26);
    expect(tableData.length).toBe(PARALLEL_KEY_TABLE_DATA.length);

    for (const row of tableData) {
      const independentCapA = calculateKeyCapacity({
        shaftDiameter: row.dNominal,
        keyWidth: row.b,
        keyHeight: row.h,
        t2: row.t2,
        length: row.defaultLength,
        shape: "A",
        pemSteel: 100,
        pemCastIron: 60,
      });

      const independentCapB = calculateKeyCapacity({
        shaftDiameter: row.dNominal,
        keyWidth: row.b,
        keyHeight: row.h,
        t2: row.t2,
        length: row.defaultLength,
        shape: "B",
        pemSteel: 100,
        pemCastIron: 60,
      });

      // Effective length check
      expect(row.leffA).toBe(row.defaultLength - row.b);
      expect(row.leffB).toBe(row.defaultLength);
      expect(independentCapA.leff).toBe(row.leffA);
      expect(independentCapB.leff).toBe(row.leffB);

      // Torque values must match exactly
      expect(row.torqueSteelDefaultNm).toBe(independentCapA.torqueSteelNm);
      expect(row.torqueCastIronDefaultNm).toBe(independentCapA.torqueCastIronNm);

      // Material proportion check: pem 100 vs 60 -> ratio is exactly 100/60
      expect(row.torqueSteelDefaultNm).toBeCloseTo(row.torqueCastIronDefaultNm * (100 / 60), 1);

      // Verify prefilled calculator URLs
      expect(row.calculatorUrlTr).toContain(
        `/tr/tools/shaft-torsion?diameter=${row.dNominal}&torque=${Math.round(row.torqueSteelDefaultNm)}`,
      );
      expect(row.calculatorUrlEn).toContain(
        `/en/tools/shaft-torsion?diameter=${row.dNominal}&torque=${Math.round(row.torqueSteelDefaultNm)}`,
      );
    }
  });

  it("verifies physical calculation example: shaft 40 mm, key 12x8x56 Form A", () => {
    const cap = calculateKeyCapacity({
      shaftDiameter: 40,
      keyWidth: 12,
      keyHeight: 8,
      t2: 3.3,
      length: 56,
      shape: "A",
      pemSteel: 100,
      pemCastIron: 60,
    });

    expect(cap.leff).toBe(44);
    // T = (100 * 3.3 * 44 * 40) / 2000 = 290.4 N*m
    expect(cap.torqueSteelNm).toBe(290.4);
    // T_ci = (60 * 3.3 * 44 * 40) / 2000 = 174.24 N*m
    expect(cap.torqueCastIronNm).toBe(174.24);
    // Shear capacity: (148 * 12 * 44 * 40) / 2000 = 1562.88 N*m
    expect(cap.shearCapacityNm).toBe(1562.88);
    expect(cap.limitingFactorSteel).toBe("surface_pressure");
  });

  it("resolves localized routes correctly for TR and EN", () => {
    const internal = "/reference/kama-olculeri-ve-tolerans-tablosu";

    expect(localePath("tr", internal)).toBe("/tr/referans/kama-olculeri-ve-tolerans-tablosu");
    expect(localePath("en", internal)).toBe("/en/reference/parallel-key-size-and-tolerance-table");

    expect(resolveInternalPath("/referans/kama-olculeri-ve-tolerans-tablosu")).toBe(internal);
    expect(resolveInternalPath("/reference/parallel-key-size-and-tolerance-table")).toBe(internal);
  });

  it("provides 500+ words technical explanation with worked example and 5 pitfalls in TR and EN", () => {
    const contentFilePath = path.join(process.cwd(), "components/reference/KeyTableContent.tsx");
    const fileContent = fs.readFileSync(contentFilePath, "utf8");

    // Extract TR and EN blocks
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

    // Verify worked example values
    expect(fileContent).toContain("290.4");
    expect(fileContent).toContain("1562.88");
    expect(fileContent).toContain("44");

    // Verify 5 pitfalls in TR and EN
    expect(fileContent).toContain("1. Hata");
    expect(fileContent).toContain("2. Hata");
    expect(fileContent).toContain("3. Hata");
    expect(fileContent).toContain("4. Hata");
    expect(fileContent).toContain("5. Hata");

    expect(fileContent).toContain("1. Pitfall");
    expect(fileContent).toContain("2. Pitfall");
    expect(fileContent).toContain("3. Pitfall");
    expect(fileContent).toContain("4. Pitfall");
    expect(fileContent).toContain("5. Pitfall");

    // Verify internal links to tools, guides, and blog
    expect(fileContent).toContain("/guides/kama-tasarimi-101");
    expect(fileContent).toContain("/tools/shaft-torsion");
    expect(fileContent).toContain("/tools/torque-power");
    expect(fileContent).toContain("/blog/mil-gobek-baglantisi-kamali-flansli-gecme-cakma");
  });

  it("avoids Turkish leakage in EN KeyTableClient JSX and prevents SEO title truncation", () => {
    const clientPath = path.join(process.cwd(), "components/reference/KeyTableClient.tsx");
    const clientSrc = fs.readFileSync(clientPath, "utf8");
    const jsxPart = clientSrc.slice(clientSrc.indexOf("export default function KeyTableClient"));

    expect(jsxPart).toContain("/tools/shaft-torsion?diameter=");
    expect(jsxPart).not.toContain("(anma:");
    expect(jsxPart).not.toContain("pah:");
    expect(jsxPart).not.toContain("Çelik pem");
    expect(jsxPart).not.toContain("Döküm pem");
    expect(jsxPart).not.toContain("Aramayı temizle");
    expect(jsxPart).not.toContain(">Hesapla<");

    const pagePath = path.join(process.cwd(), "app/reference/kama-olculeri-ve-tolerans-tablosu/page.tsx");
    const pageSrc = fs.readFileSync(pagePath, "utf8");
    expect(pageSrc).toContain('"Paralel Kama ve Tolerans Tablosu (DIN 6885-1)"');
    expect(pageSrc).toContain('"Parallel Key Size & Tolerance Table (DIN 6885-1)"');
  });
});
