"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ReportActions from "@/components/report/ReportActions";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { qualityReportActionsCopy } from "@/data/quality-tools/report-actions";
import { useAutosaveDraft } from "@/hooks/useAutosaveDraft";
import { assertNoTurkish } from "@/utils/i18n-assert";
import { UnitInput } from "@/components/units/UnitInput";
import { UnitDisplay } from "@/components/units/UnitDisplay";

type MaterialId = "steel" | "aluminum";
type ChecklistId = "tslotSpacing" | "boltPattern" | "liftingPoints" | "dowelHoles";

type BasePlateForm = {
  spanL: number;
  widthB: number;
  equivalentLoad: number;
  allowableDeflection: number;
  material: MaterialId;
};

type NoteRow = {
  id: string;
  area: string;
  detail: string;
  owner: string;
};

type ChecklistState = Record<ChecklistId, boolean>;

type BasePlateSnapshot = {
  form: BasePlateForm;
  noteRows: NoteRow[];
  checklist: ChecklistState;
};

type BasePlateCopy = {
  badge: string;
  beta: string;
  title: string;
  description: string;
  sections: {
    inputs: string;
    results: string;
    compatibility: string;
    notes: string;
    references: string;
    disclaimerTitle: string;
  };
  fields: {
    spanLmm: string;
    widthBmm: string;
    equivalentLoadN: string;
    allowableDeflectionMm: string;
    material: string;
  };
  materialLabels: Record<MaterialId, string>;
  placeholders: {
    area: string;
    detail: string;
    owner: string;
  };
  results: {
    estimatedThickness: string;
    roundedThickness: string;
    estimatedWeight: string;
    roundedWeight: string;
    deflectionAtRounded: string;
    formula: string;
    invalid: string;
  };
  checklistLabels: Record<ChecklistId, string>;
  checklistProgress: string;
  addNoteRow: string;
  remove: string;
  references: string[];
  disclaimer: string;
};

type MaterialPreset = {
  eNPerMm2: number;
  densityKgM3: number;
};

const DRAFT_KEY = "torqyx:fixture:base-plate:draft";
const STANDARD_THICKNESSES = [20, 25, 30, 40, 50];
const CHECKLIST_IDS: ChecklistId[] = ["tslotSpacing", "boltPattern", "liftingPoints", "dowelHoles"];

const MATERIALS: Record<MaterialId, MaterialPreset> = {
  steel: { eNPerMm2: 210_000, densityKgM3: 7_850 },
  aluminum: { eNPerMm2: 70_000, densityKgM3: 2_700 },
};

const INITIAL_FORM: BasePlateForm = {
  spanL: 450,
  widthB: 300,
  equivalentLoad: 3000,
  allowableDeflection: 0.1,
  material: "steel",
};

const basePlateCopy: Record<"tr" | "en", BasePlateCopy> = {
  tr: {
    badge: "Taban Plaka",
    beta: "Beta",
    title: "Taban Plaka Boyutlandırma Kartı",
    description:
      "Basit rijitlik yaklaşımıyla kalınlık tahmini, standart kalınlığa yuvarlama ve tabla uyumluluğu kontrolü.",
    sections: {
      inputs: "Girdiler",
      results: "Sonuçlar",
      compatibility: "Makine Tablası Uyumluluğu",
      notes: "Notlar Tablosu",
      references: "Referanslar",
      disclaimerTitle: "Sorumluluk Notu",
    },
    fields: {
      spanLmm: "Plaka açıklığı L [mm]",
      widthBmm: "Plaka genişliği b [mm]",
      equivalentLoadN: "Eşdeğer yük F [N]",
      allowableDeflectionMm: "İzin verilebilir sehim ? [mm]",
      material: "Malzeme (E ve yoğunluk)",
    },
    materialLabels: {
      steel: "Çelik (E = 210 GPa)",
      aluminum: "Alüminyum (E = 70 GPa)",
    },
    placeholders: {
      area: "Bölge / delik haritası",
      detail: "Detay (insert, burç, talaş cebi vb.)",
      owner: "Sorumlu",
    },
    results: {
      estimatedThickness: "Hesaplanan t (teorik)",
      roundedThickness: "Önerilen standart kalınlık",
      estimatedWeight: "Hesaplanan kalınlıkta tahmini ağırlık",
      roundedWeight: "Önerilen kalınlıkta tahmini ağırlık",
      deflectionAtRounded: "Önerilen kalınlıkta tahmini sehim",
      formula: "Formül",
      invalid: "Sonuç için L, b, F ve ? değerlerini pozitif girin.",
    },
    checklistLabels: {
      tslotSpacing: "T-slot aralığı ve yönü çizimde belirtildi",
      boltPattern: "Bağlama cıvata paterni tabloya uyumlu",
      liftingPoints: "Kaldırma noktaları/halka detayları tanımlı",
      dowelHoles: "Konumlama pim/dowel delikleri net ölçülendirilmiş",
    },
    checklistProgress: "Tamamlanan madde",
    addNoteRow: "Not satırı ekle",
    remove: "Sil",
    references: [
      "Yaklaşım: ? = F*L^3 / (4*E*b*t^3), t için çözülür.",
      "E birimi N/mm² (Çelik 210000, Alüminyum 70000).",
      "Standart kalınlık seçimi üretim ve tedarik kolaylığı sağlar.",
      "Nihai tasarımda FEA ve makina tabla verisiyle doğrulama yapın.",
    ],
    disclaimer: "Tipik rehberdir, standartlar ve sorumlu mühendis doğrulaması gerekir.",
  },
  en: {
    badge: "Base Plate",
    beta: "Beta",
    title: "Base Plate Sizing Card",
    description:
      "Estimate thickness with a simple stiffness model, round to standard thickness, and check machine-table compatibility.",
    sections: {
      inputs: "Inputs",
      results: "Results",
      compatibility: "Machine Table Compatibility",
      notes: "Notes Table",
      references: "References",
      disclaimerTitle: "Disclaimer",
    },
    fields: {
      spanLmm: "Plate span L [mm]",
      widthBmm: "Plate width b [mm]",
      equivalentLoadN: "Equivalent load F [N]",
      allowableDeflectionMm: "Allowable deflection ? [mm]",
      material: "Material (E and density)",
    },
    materialLabels: {
      steel: "Steel (E = 210 GPa)",
      aluminum: "Aluminum (E = 70 GPa)",
    },
    placeholders: {
      area: "Area / hole map",
      detail: "Detail (inserts, bushings, chip pockets, etc.)",
      owner: "Owner",
    },
    results: {
      estimatedThickness: "Calculated t (theoretical)",
      roundedThickness: "Recommended standard thickness",
      estimatedWeight: "Estimated weight at calculated thickness",
      roundedWeight: "Estimated weight at recommended thickness",
      deflectionAtRounded: "Estimated deflection at recommended thickness",
      formula: "Formula",
      invalid: "Enter positive L, b, F, and ? values for results.",
    },
    checklistLabels: {
      tslotSpacing: "T-slot spacing and orientation are defined",
      boltPattern: "Bolt pattern fits machine table layout",
      liftingPoints: "Lifting points/rings are defined",
      dowelHoles: "Dowel/location holes are dimensioned clearly",
    },
    checklistProgress: "Completed items",
    addNoteRow: "Add Note Row",
    remove: "Remove",
    references: [
      "Model: ? = F*L^3 / (4*E*b*t^3), solved for t.",
      "Use E in N/mm² (Steel 210000, Aluminum 70000).",
      "Standard thickness selection improves sourcing and manufacturing consistency.",
      "Validate final design with FEA and machine-table constraints.",
    ],
    disclaimer: "Typical guidance, verify with standards and responsible engineer.",
  },
};

const createId = () => Math.random().toString(36).slice(2, 10);

function createInitialChecklist(): ChecklistState {
  return {
    tslotSpacing: false,
    boltPattern: false,
    liftingPoints: false,
    dowelHoles: false,
  };
}

function createNoteRow(): NoteRow {
  return {
    id: createId(),
    area: "",
    detail: "",
    owner: "",
  };
}

function createInitialNotes(): NoteRow[] {
  return [createNoteRow()];
}

function normalizeForm(source: unknown): BasePlateForm {
  if (!source || typeof source !== "object") return INITIAL_FORM;
  const row = source as Partial<BasePlateForm>;
  const material: MaterialId = row.material === "aluminum" ? "aluminum" : "steel";

  return {
    spanL: typeof row.spanL === "number" ? row.spanL : INITIAL_FORM.spanL,
    widthB: typeof row.widthB === "number" ? row.widthB : INITIAL_FORM.widthB,
    equivalentLoad: typeof row.equivalentLoad === "number" ? row.equivalentLoad : INITIAL_FORM.equivalentLoad,
    allowableDeflection: typeof row.allowableDeflection === "number" ? row.allowableDeflection : INITIAL_FORM.allowableDeflection,
    material,
  };
}

function normalizeNotes(source: unknown): NoteRow[] {
  if (!Array.isArray(source) || source.length === 0) return createInitialNotes();
  const normalized = source
    .map((item): NoteRow | null => {
      if (!item || typeof item !== "object") return null;
      const row = item as Partial<NoteRow>;
      return {
        id: typeof row.id === "string" && row.id.trim() ? row.id : createId(),
        area: typeof row.area === "string" ? row.area : "",
        detail: typeof row.detail === "string" ? row.detail : "",
        owner: typeof row.owner === "string" ? row.owner : "",
      };
    })
    .filter((row): row is NoteRow => row !== null);

  return normalized.length > 0 ? normalized : createInitialNotes();
}

function normalizeChecklist(source: unknown): ChecklistState {
  const initial = createInitialChecklist();
  if (!source || typeof source !== "object") return initial;
  const candidate = source as Partial<ChecklistState>;
  const next = { ...initial };
  CHECKLIST_IDS.forEach((id) => {
    next[id] = Boolean(candidate[id]);
  });
  return next;
}

function pickStandardThickness(value: number): number {
  const found = STANDARD_THICKNESSES.find((item) => item >= value);
  if (found) return found;
  return Math.ceil(value / 10) * 10;
}

export default function BasePlatePage() {
  const { locale } = useLocale();
  const copy = basePlateCopy[locale];
  const actionsCopy = qualityReportActionsCopy[locale];
  assertNoTurkish(locale, copy, "fixture-tools/base-plate");

  const [form, setForm] = useState<BasePlateForm>(INITIAL_FORM);
  const [noteRows, setNoteRows] = useState<NoteRow[]>(() => createInitialNotes());
  const [checklist, setChecklist] = useState<ChecklistState>(() => createInitialChecklist());
  const reportRootRef = useRef<HTMLElement | null>(null);

  const restoreDraft = useCallback((draft: BasePlateSnapshot) => {
    setForm(normalizeForm(draft?.form));
    setNoteRows(normalizeNotes(draft?.noteRows));
    setChecklist(normalizeChecklist(draft?.checklist));
  }, []);

  const { clearDraft } = useAutosaveDraft<BasePlateSnapshot>({
    storageKey: DRAFT_KEY,
    value: { form, noteRows, checklist },
    onRestore: restoreDraft,
  });

  function handleFormChange<K extends keyof BasePlateForm>(key: K, value: BasePlateForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNoteChange<K extends keyof NoteRow>(id: string, key: K, value: NoteRow[K]) {
    setNoteRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  }

  function addNoteRow() {
    setNoteRows((prev) => [...prev, createNoteRow()]);
  }

  function removeNoteRow(id: string) {
    setNoteRows((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  }

  function toggleChecklist(id: ChecklistId) {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setNoteRows(createInitialNotes());
    setChecklist(createInitialChecklist());
    clearDraft();
  }

  function handleDemoFill() {
    setForm({
      spanL: 620,
      widthB: 380,
      equivalentLoad: 5200,
      allowableDeflection: 0.08,
      material: "steel",
    });

    setNoteRows([
      {
        id: createId(),
        area: locale === "tr" ? "Hole map - üst yüzey" : "Hole map - top face",
        detail:
          locale === "tr"
            ? "2x dowel H7, 8x M12 bağlama deliği, talaş cepleri sağ alt bölgede."
            : "2x H7 dowel holes, 8x M12 clamp holes, chip pockets on lower-right region.",
        owner: locale === "tr" ? "Tasarım" : "Design",
      },
      {
        id: createId(),
        area: locale === "tr" ? "Burç/insert" : "Bushings/inserts",
        detail:
          locale === "tr"
            ? "Sık sık-tak bölgelere sertleştirilmiş çelik insert uygulanacak."
            : "Use hardened steel inserts in frequently serviced zones.",
        owner: locale === "tr" ? "Üretim" : "Manufacturing",
      },
    ]);

    setChecklist({
      tslotSpacing: true,
      boltPattern: true,
      liftingPoints: true,
      dowelHoles: false,
    });
  }

  function handleLoadData(snapshot: BasePlateSnapshot) {
    setForm(normalizeForm(snapshot?.form));
    setNoteRows(normalizeNotes(snapshot?.noteRows));
    setChecklist(normalizeChecklist(snapshot?.checklist));
  }

  const calculated = useMemo(() => {
    const span = form.spanL > 0 ? form.spanL : null;
    const width = form.widthB > 0 ? form.widthB : null;
    const load = form.equivalentLoad > 0 ? form.equivalentLoad : null;
    const deflection = form.allowableDeflection > 0 ? form.allowableDeflection : null;
    if (!span || !width || !load || !deflection) return null;

    const material = MATERIALS[form.material];
    const numerator = load * span ** 3;
    const denominator = 4 * material.eNPerMm2 * width * deflection;
    const thickness = Math.cbrt(numerator / denominator);
    const roundedThickness = pickStandardThickness(thickness);

    const thicknessVolumeM3 = (span * width * thickness) / 1_000_000_000;
    const roundedVolumeM3 = (span * width * roundedThickness) / 1_000_000_000;

    const estimatedWeight = thicknessVolumeM3 * material.densityKgM3;
    const roundedWeight = roundedVolumeM3 * material.densityKgM3;

    const deflectionAtRounded =
      numerator / (4 * material.eNPerMm2 * width * roundedThickness ** 3);

    return {
      thickness,
      roundedThickness,
      estimatedWeight,
      roundedWeight,
      deflectionAtRounded,
      eValue: material.eNPerMm2,
    };
  }, [form]);

  const completedChecklist = CHECKLIST_IDS.filter((id) => checklist[id]).length;

  return (
    <PageShell>
      <ReportActions
        toolKey="fixture-base-plate"
        currentData={{ form, noteRows, checklist }}
        onLoadData={handleLoadData}
        onDemoFill={handleDemoFill}
        onReset={handleReset}
        reportRootRef={reportRootRef}
        copy={actionsCopy}
      />

      <section id="report-root" ref={reportRootRef} className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {copy.badge}
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-medium text-emerald-700">
              {copy.beta}
            </span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">{copy.title}</h1>
          <p className="mt-2 text-xs text-slate-600">{copy.description}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.sections.inputs}</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <label className="space-y-1">
              <span className="block text-[11px] font-medium text-slate-700">{copy.fields.spanLmm}</span>
              <UnitInput value={form.spanL} onChange={(value) => handleFormChange("spanL", value)} unit="mm" />
            </label>
            <label className="space-y-1">
              <span className="block text-[11px] font-medium text-slate-700">{copy.fields.widthBmm}</span>
              <UnitInput value={form.widthB} onChange={(value) => handleFormChange("widthB", value)} unit="mm" />
            </label>
            <label className="space-y-1">
              <span className="block text-[11px] font-medium text-slate-700">{copy.fields.equivalentLoadN}</span>
              <UnitInput value={form.equivalentLoad} onChange={(value) => handleFormChange("equivalentLoad", value)} unit="N" />
            </label>
            <label className="space-y-1">
              <span className="block text-[11px] font-medium text-slate-700">{copy.fields.allowableDeflectionMm}</span>
              <UnitInput value={form.allowableDeflection} onChange={(value) => handleFormChange("allowableDeflection", value)} unit="mm" />
            </label>
            <SelectField
              label={copy.fields.material}
              value={form.material}
              onChange={(value) => handleFormChange("material", value as MaterialId)}
              options={([
                "steel",
                "aluminum",
              ] as MaterialId[]).map((id) => ({ value: id, label: copy.materialLabels[id] }))}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.sections.results}</h2>
          {calculated ? (
            <div className="space-y-3">
              <ResultRow label={copy.results.estimatedThickness} value={<UnitDisplay value={calculated.thickness} unit="mm" />} />
              <ResultRow label={copy.results.roundedThickness} value={<UnitDisplay value={calculated.roundedThickness} unit="mm" />} />
              <ResultRow label={copy.results.estimatedWeight} value={<UnitDisplay value={calculated.estimatedWeight} unit="kg" />} />
              <ResultRow label={copy.results.roundedWeight} value={<UnitDisplay value={calculated.roundedWeight} unit="kg" />} />
              <ResultRow label={copy.results.deflectionAtRounded} value={<UnitDisplay value={calculated.deflectionAtRounded} unit="mm" />} />
              <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-700">
                <p className="font-semibold text-slate-900">{copy.results.formula}</p>
                <p className="mt-1">? = F*L^3 / (4*E*b*t^3)</p>
                <p className="mt-1">{`E = ${calculated.eValue.toFixed(0)} N/mm²`}</p>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-600">{copy.results.invalid}</p>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.sections.compatibility}</h2>
            <div className="space-y-2">
              {CHECKLIST_IDS.map((id) => (
                <label key={id} className="flex items-start gap-2 rounded-lg border border-slate-200 px-3 py-2">
                  <input type="checkbox" checked={checklist[id]} onChange={() => toggleChecklist(id)} className="mt-0.5 h-4 w-4"  aria-label="Checkbox"/>
                  <span className="text-[11px] text-slate-700">{copy.checklistLabels[id]}</span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-600">{copy.checklistProgress}: {completedChecklist}/{CHECKLIST_IDS.length}</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900">{copy.sections.notes}</h2>
              <button type="button" onClick={addNoteRow} className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800">{copy.addNoteRow}</button>
            </div>
            <div className="space-y-2">
              {noteRows.map((row) => (
                <div key={row.id} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[200px_minmax(0,1fr)_160px_80px]">
                  <input type="text" value={row.area} onChange={(event) => handleNoteChange(row.id, "area", event.target.value)} placeholder={copy.placeholders.area} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"  aria-label={copy.placeholders.area}/>
                  <input type="text" value={row.detail} onChange={(event) => handleNoteChange(row.id, "detail", event.target.value)} placeholder={copy.placeholders.detail} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"  aria-label={copy.placeholders.detail}/>
                  <input type="text" value={row.owner} onChange={(event) => handleNoteChange(row.id, "owner", event.target.value)} placeholder={copy.placeholders.owner} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"  aria-label={copy.placeholders.owner}/>
                  <button type="button" onClick={() => removeNoteRow(row.id)} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100">{copy.remove}</button>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.sections.references}</h2>
          <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
            {copy.references.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900">
            <p className="font-semibold">{copy.sections.disclaimerTitle}</p>
            <p className="mt-1">{copy.disclaimer}</p>
          </div>
        </section>
      </section>
    </PageShell>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
       aria-label="Select field">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-[11px] text-slate-600">{label}</span>
      <span className="font-mono text-[11px] font-semibold text-slate-900">{value}</span>
    </div>
  );
}
