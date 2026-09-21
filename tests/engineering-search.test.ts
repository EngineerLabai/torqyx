import { beforeAll, describe, expect, it } from "vitest";
import { filterSearchResults } from "@/components/search/useSearchIndex";
import { buildSearchIndexData } from "@/lib/search/buildIndex";
import type { SearchIndexItem } from "@/utils/search-index";

let trItems: SearchIndexItem[];
let enItems: SearchIndexItem[];

beforeAll(async () => {
  [trItems, enItems] = await Promise.all([
    buildSearchIndexData("tr").then((index) => index.items),
    buildSearchIndexData("en").then((index) => index.items),
  ]);
});

const resultIds = (items: SearchIndexItem[], query: string) =>
  filterSearchResults(items, query, 30).map((item) => item.id);

describe("engineering search index", () => {
  it("finds tools from Turkish and English aliases on the Turkish experience", () => {
    expect(resultIds(trItems, "mil")).toContain("tool:shaft-torsion");
    expect(resultIds(trItems, "shaft")).toContain("tool:shaft-torsion");
    expect(resultIds(trItems, "pressure drop")).toContain("tool:pipe-pressure-loss");
    expect(resultIds(trItems, "rulman")).toContain("tool:bearing-life");
  });

  it("finds exact reference entities and partial engineering terms", () => {
    expect(resultIds(trItems, "M10")).toContain("reference:threads:M10");
    expect(resultIds(enItems, "H7/g6")).toContain("reference:fits:H7/g6");
    expect(resultIds(enItems, "42CrMo4")).toContain("reference:materials:42CrMo4");
    expect(resultIds(enItems, "torsion")).toContain("tool:shaft-torsion");
  });

  it("returns no result for an unknown query and emits no duplicate entities", () => {
    expect(resultIds(trItems, "unobtainium-999")).toEqual([]);
    expect(new Set(trItems.map((item) => item.id)).size).toBe(trItems.length);
    expect(new Set(enItems.map((item) => item.id)).size).toBe(enItems.length);
  });

  it("keeps result links inside the active locale", () => {
    expect(trItems.every((item) => item.href.startsWith("/tr/"))).toBe(true);
    expect(enItems.every((item) => item.href.startsWith("/en/"))).toBe(true);
  });
});
