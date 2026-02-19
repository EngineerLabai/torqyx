"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ReportActions from "@/components/report/ReportActions";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { qualityReportActionsCopy } from "@/data/quality-tools/report-actions";
import { useAutosaveDraft } from "@/hooks/useAutosaveDraft";
import { assertNoTurkish } from "@/utils/i18n-assert";

type DatumId = "bottom" | "left" | "front" | "right" | "top" | "back";
type PinRole = "fixed" | "floating";
type HoleType = "round" | "slot";
type MaterialPair = "steel-steel" | "alu-steel" | "alu-alu";
type ChecklistId =
  | "accessibility"
  | "chipEvacuation"
  | "chamfers"
  | "antiRotation"
  | "repeatability"
  | "inspection";

type LocatingForm = {
  lengthMm: string;
  widthMm: string;
  heightMm: string;
  massKg: string;
  primaryDatum: DatumId;
  secondaryDatum: DatumId;
  tertiaryDatum: DatumId;
  thermalEnabled: boolean;
  deltaT: string;
  pinDiameter: string;
  materialPair: MaterialPair;
};

type PinPlanRow = {
  id: string;
  feature: string;
  pinRole: PinRole;
  holeType: HoleType;
  notes: string;
};

type NoteRow = {
  id: string;
  topic: string;
  owner: string;
  note: string;
};

type ChecklistState = Record<ChecklistId, boolean>;

type LocatingSnapshot = {
  form: LocatingForm;
  pinPlanRows: PinPlanRow[];
  noteRows: NoteRow[];
  checklist: ChecklistState;
};

type LocatingCopy = {
  badge: string;
  beta: string;
  title: string;
  description: string;
  sections: {
    inputs: string;
    results: string;
    pinPlan: string;
    checklist: string;
    notes: string;
    references: string;
    disclaimerTitle: string;
  };
  fields: {
    lengthMm: string;
    widthMm: string;
    heightMm: string;
    massKg: string;
    primaryDatum: string;
    secondaryDatum: string;
    tertiaryDatum: string;
    thermalEnabled: string;
    deltaT: string;
    pinDiameter: string;
    materialPair: string;
  };
  placeholders: {
    pinFeature: string;
    pinNotes: string;
    noteTopic: string;
    noteOwner: string;
    noteBody: string;
  };
  datumOptions: Record<DatumId, string>;
  pinRoleOptions: Record<PinRole, string>;
  holeTypeOptions: Record<HoleType, string>;
  materialPairOptions: Record<MaterialPair, string>;
  table: {
    feature: string;
    pinRole: string;
    holeType: string;
    notes: string;
    topic: string;
    owner: string;
    note: string;
    actions: string;
  };
  resultLabels: {
    edgeDistance: string;
    pinStrategy: string;
    fitGuidance: string;
    thermalNote: string;
    noThermalNote: string;
    massInfo: string;
    slotHint: string;
    missingInputs: string;
  };
  checklistLabels: Record<ChecklistId, string>;
  checklistProgress: string;
  addPinRow: string;
  addNoteRow: string;
  remove: string;
  references: string[];
  disclaimer: string;
};

const DRAFT_KEY = "aielab:fixture:locating:draft";

const DATUM_IDS: DatumId[] = ["bottom", "left", "front", "right", "top", "back"];
const PIN_DIAMETERS = ["6", "8", "10", "12", "16"];
const CHECKLIST_IDS: ChecklistId[] = [
  "accessibility",
  "chipEvacuation",
  "chamfers",
  "antiRotation",
  "repeatability",
  "inspection",
];

const MATERIAL_PAIR_COEFFICIENTS: Record<MaterialPair, { part: number; fixture: number }> = {
  "steel-steel": { part: 11e-6, fixture: 11e-6 },
  "alu-steel": { part: 23e-6, fixture: 11e-6 },
  "alu-alu": { part: 23e-6, fixture: 23e-6 },
};

const INITIAL_FORM: LocatingForm = {
  lengthMm: "240",
  widthMm: "160",
  heightMm: "70",
  massKg: "4.2",
  primaryDatum: "bottom",
  secondaryDatum: "left",
  tertiaryDatum: "front",
  thermalEnabled: true,
  deltaT: "25",
  pinDiameter: "10",
  materialPair: "alu-steel",
};

const locatingCopy: Record<"tr" | "en", LocatingCopy> = {
  tr: {
    badge: "Referanslama",
    beta: "Beta",
    title: "3-2-1 Referanslama ve Pim Yerleşimi Kartı",
    description:
      "3-2-1 prensibi, sabit/kayan pim stratejisi ve referans doğrulaması için yazdırılabilir mühendislik kartı.",
    sections: {
      inputs: "Girdiler",
      results: "Sonuçlar",
      pinPlan: "Pin Plan Tablosu",
      checklist: "Kontrol Listesi",
      notes: "Notlar Tablosu",
      references: "Referanslar",
      disclaimerTitle: "Sorumluluk Notu",
    },
    fields: {
      lengthMm: "Parça boyu L [mm]",
      widthMm: "Parça eni W [mm]",
      heightMm: "Parça yüksekliği H [mm]",
      massKg: "Parça kütlesi [kg]",
      primaryDatum: "Birincil datum (3 nokta)",
      secondaryDatum: "İkincil datum (2 nokta)",
      tertiaryDatum: "Üçüncül datum (1 nokta)",
      thermalEnabled: "Termal genleşme payı uygula",
      deltaT: "Sıcaklık farkı ΔT [°C]",
      pinDiameter: "Pim çapı seçimi [mm]",
      materialPair: "Malzeme çifti (not için)",
    },
    placeholders: {
      pinFeature: "Örn: Yan referans delik A",
      pinNotes: "Örn: Uzun delik + talaş kaçış cebi",
      noteTopic: "Konu",
      noteOwner: "Sorumlu",
      noteBody: "Mühendislik notu",
    },
    datumOptions: {
      bottom: "Alt yüzey",
      left: "Sol yüzey",
      front: "Ön yüzey",
      right: "Sağ yüzey",
      top: "Üst yüzey",
      back: "Arka yüzey",
    },
    pinRoleOptions: {
      fixed: "Sabit",
      floating: "Kayan",
    },
    holeTypeOptions: {
      round: "Yuvarlak",
      slot: "Uzun delik",
    },
    materialPairOptions: {
      "steel-steel": "Çelik parça - Çelik fikstür",
      "alu-steel": "Alüminyum parça - Çelik fikstür",
      "alu-alu": "Alüminyum parça - Alüminyum fikstür",
    },
    table: {
      feature: "Özellik",
      pinRole: "Sabit/Kayan",
      holeType: "Delik tipi",
      notes: "Not",
      topic: "Konu",
      owner: "Sorumlu",
      note: "Not detayı",
      actions: "İşlem",
    },
    resultLabels: {
      edgeDistance: "Pim için önerilen minimum kenar mesafesi",
      pinStrategy: "1 sabit + 1 kayan pim stratejisi",
      fitGuidance: "H7/h6 geçme önerisi",
      thermalNote: "Termal genleşme notu",
      noThermalNote: "Termal pay kapalı. Sıcaklık değişimi varsa kayan pimi uzun eksene hizalayın.",
      massInfo: "Kütle notu",
      slotHint: "Kayan pim uzun delik ilave boşluk önerisi",
      missingInputs: "Sonuç için pozitif L/W/H ve pim çapı girin.",
    },
    checklistLabels: {
      accessibility: "Operatör erişimi ve sök-tak yönü yeterli",
      chipEvacuation: "Talaş/çapak tahliyesi için cepler açık",
      chamfers: "Pim girişlerinde yeterli pah/chamfer mevcut",
      antiRotation: "Parça dönmesini engelleyen dayama/stopper var",
      repeatability: "Tekrarlanabilirlik için datum yüzeyleri temiz ve rijit",
      inspection: "Kritik referansların ölçüm/denetim erişimi sağlandı",
    },
    checklistProgress: "Tamamlanan madde",
    addPinRow: "Pin satırı ekle",
    addNoteRow: "Not satırı ekle",
    remove: "Sil",
    references: [
      "ISO 286: Delik/mil geçmeleri (H7/h6 uygulaması).",
      "3-2-1 prensibi: 6 serbestlik derecesi kısıtlama yaklaşımı.",
      "Üretim çiziminde sabit pim datum ilişkisini net ölçülendirin.",
      "Termal genleşme riski olan parçalarda kayan pim + uzun delik tercih edin.",
    ],
    disclaimer: "Tipik rehberdir, standartlar ve sorumlu mühendis doğrulaması gerekir.",
  },
  en: {
    badge: "Locating",
    beta: "Beta",
    title: "3-2-1 Locating and Pin Layout Card",
    description:
      "Printable engineering card for 3-2-1 referencing, fixed/floating pin strategy, and datum validation.",
    sections: {
      inputs: "Inputs",
      results: "Results",
      pinPlan: "Pin Plan Table",
      checklist: "Checklist",
      notes: "Notes Table",
      references: "References",
      disclaimerTitle: "Disclaimer",
    },
    fields: {
      lengthMm: "Part envelope L [mm]",
      widthMm: "Part envelope W [mm]",
      heightMm: "Part envelope H [mm]",
      massKg: "Part mass [kg]",
      primaryDatum: "Primary datum (3 points)",
      secondaryDatum: "Secondary datum (2 points)",
      tertiaryDatum: "Tertiary datum (1 point)",
      thermalEnabled: "Apply thermal expansion allowance",
      deltaT: "Temperature delta ΔT [°C]",
      pinDiameter: "Pin diameter selection [mm]",
      materialPair: "Material pair (for notes)",
    },
    placeholders: {
      pinFeature: "e.g. Side reference hole A",
      pinNotes: "e.g. Slot with chip relief pocket",
      noteTopic: "Topic",
      noteOwner: "Owner",
      noteBody: "Engineering note",
    },
    datumOptions: {
      bottom: "Bottom face",
      left: "Left face",
      front: "Front face",
      right: "Right face",
      top: "Top face",
      back: "Back face",
    },
    pinRoleOptions: {
      fixed: "Fixed",
      floating: "Floating",
    },
    holeTypeOptions: {
      round: "Round",
      slot: "Slot",
    },
    materialPairOptions: {
      "steel-steel": "Steel part - Steel fixture",
      "alu-steel": "Aluminum part - Steel fixture",
      "alu-alu": "Aluminum part - Aluminum fixture",
    },
    table: {
      feature: "Feature",
      pinRole: "Fixed/Floating",
      holeType: "Hole type",
      notes: "Notes",
      topic: "Topic",
      owner: "Owner",
      note: "Note detail",
      actions: "Action",
    },
    resultLabels: {
      edgeDistance: "Recommended minimum edge distance for pins",
      pinStrategy: "1 fixed + 1 floating pin strategy",
      fitGuidance: "H7/h6 fit guidance",
      thermalNote: "Thermal expansion note",
      noThermalNote:
        "Thermal allowance is disabled. Align floating pin to longest axis when temperature varies.",
      massInfo: "Mass note",
      slotHint: "Floating pin slot extra clearance suggestion",
      missingInputs: "Enter positive L/W/H and pin diameter to calculate outputs.",
    },
    checklistLabels: {
      accessibility: "Operator accessibility and loading direction are clear",
      chipEvacuation: "Chip evacuation and debris pockets are available",
      chamfers: "Chamfers/lead-ins exist at pin entry points",
      antiRotation: "Anti-rotation stop or side support is defined",
      repeatability: "Datum surfaces are clean and rigid for repeatability",
      inspection: "Inspection access is available for critical datums",
    },
    checklistProgress: "Completed items",
    addPinRow: "Add Pin Row",
    addNoteRow: "Add Note Row",
    remove: "Remove",
    references: [
      "ISO 286: Hole/shaft fit guidance (H7/h6 usage).",
      "3-2-1 principle: practical way to constrain 6 degrees of freedom.",
      "Dimension the fixed pin-datum relation explicitly in manufacturing drawings.",
      "Use floating pin + slot where thermal growth can create binding.",
    ],
    disclaimer: "Typical guidance, verify with standards and responsible engineer.",
  },
};

const createId = () => Math.random().toString(36).slice(2, 10);

function createPinPlanRow(): PinPlanRow {
  return {
    id: createId(),
    feature: "",
    pinRole: "fixed",
    holeType: "round",
    notes: "",
  };
}

function createNoteRow(): NoteRow {
  return {
    id: createId(),
    topic: "",
    owner: "",
    note: "",
  };
}

function createInitialChecklist(): ChecklistState {
  return {
    accessibility: false,
    chipEvacuation: false,
    chamfers: false,
    antiRotation: false,
    repeatability: false,
    inspection: false,
  };
}

function createInitialPinPlanRows(): PinPlanRow[] {
  return [
    {
      id: createId(),
      feature: "",
      pinRole: "fixed",
      holeType: "round",
      notes: "",
    },
    {
      id: createId(),
      feature: "",
      pinRole: "floating",
      holeType: "slot",
      notes: "",
    },
  ];
}

function createInitialNoteRows(): NoteRow[] {
  return [createNoteRow()];
}

function parsePositive(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function normalizeForm(source: unknown): LocatingForm {
  if (!source || typeof source !== "object") {
    return INITIAL_FORM;
  }

  const candidate = source as Partial<LocatingForm>;

  const isDatumId = (value: unknown): value is DatumId =>
    typeof value === "string" && DATUM_IDS.includes(value as DatumId);
  const isMaterialPair = (value: unknown): value is MaterialPair =>
    value === "steel-steel" || value === "alu-steel" || value === "alu-alu";

  return {
    lengthMm: typeof candidate.lengthMm === "string" ? candidate.lengthMm : INITIAL_FORM.lengthMm,
    widthMm: typeof candidate.widthMm === "string" ? candidate.widthMm : INITIAL_FORM.widthMm,
    heightMm: typeof candidate.heightMm === "string" ? candidate.heightMm : INITIAL_FORM.heightMm,
    massKg: typeof candidate.massKg === "string" ? candidate.massKg : INITIAL_FORM.massKg,
    primaryDatum: isDatumId(candidate.primaryDatum) ? candidate.primaryDatum : INITIAL_FORM.primaryDatum,
    secondaryDatum: isDatumId(candidate.secondaryDatum)
      ? candidate.secondaryDatum
      : INITIAL_FORM.secondaryDatum,
    tertiaryDatum: isDatumId(candidate.tertiaryDatum) ? candidate.tertiaryDatum : INITIAL_FORM.tertiaryDatum,
    thermalEnabled:
      typeof candidate.thermalEnabled === "boolean" ? candidate.thermalEnabled : INITIAL_FORM.thermalEnabled,
    deltaT: typeof candidate.deltaT === "string" ? candidate.deltaT : INITIAL_FORM.deltaT,
    pinDiameter: typeof candidate.pinDiameter === "string" ? candidate.pinDiameter : INITIAL_FORM.pinDiameter,
    materialPair: isMaterialPair(candidate.materialPair) ? candidate.materialPair : INITIAL_FORM.materialPair,
  };
}

function normalizePinPlanRows(source: unknown): PinPlanRow[] {
  if (!Array.isArray(source) || source.length === 0) {
    return createInitialPinPlanRows();
  }

  const normalized = source
    .map((item): PinPlanRow | null => {
      if (!item || typeof item !== "object") return null;
      const row = item as Partial<PinPlanRow>;
      const pinRole: PinRole = row.pinRole === "floating" ? "floating" : "fixed";
      const holeType: HoleType = row.holeType === "slot" ? "slot" : "round";

      return {
        id: typeof row.id === "string" && row.id.trim().length > 0 ? row.id : createId(),
        feature: typeof row.feature === "string" ? row.feature : "",
        pinRole,
        holeType,
        notes: typeof row.notes === "string" ? row.notes : "",
      };
    })
    .filter((row): row is PinPlanRow => row !== null);

  return normalized.length > 0 ? normalized : createInitialPinPlanRows();
}

function normalizeNoteRows(source: unknown): NoteRow[] {
  if (!Array.isArray(source) || source.length === 0) {
    return createInitialNoteRows();
  }

  const normalized = source
    .map((item): NoteRow | null => {
      if (!item || typeof item !== "object") return null;
      const row = item as Partial<NoteRow>;
      return {
        id: typeof row.id === "string" && row.id.trim().length > 0 ? row.id : createId(),
        topic: typeof row.topic === "string" ? row.topic : "",
        owner: typeof row.owner === "string" ? row.owner : "",
        note: typeof row.note === "string" ? row.note : "",
      };
    })
    .filter((row): row is NoteRow => row !== null);

  return normalized.length > 0 ? normalized : createInitialNoteRows();
}

function normalizeChecklist(source: unknown): ChecklistState {
  const initial = createInitialChecklist();
  if (!source || typeof source !== "object") {
    return initial;
  }

  const candidate = source as Partial<ChecklistState>;
  const next = { ...initial };
  CHECKLIST_IDS.forEach((id) => {
    next[id] = Boolean(candidate[id]);
  });
  return next;
}

export default function LocatingCardClient() {
  const { locale } = useLocale();
  const copy = locatingCopy[locale];
  const actionsCopy = qualityReportActionsCopy[locale];
  assertNoTurkish(locale, copy, "fixture-tools/locating");

  const [form, setForm] = useState<LocatingForm>(INITIAL_FORM);
  const [pinPlanRows, setPinPlanRows] = useState<PinPlanRow[]>(() => createInitialPinPlanRows());
  const [noteRows, setNoteRows] = useState<NoteRow[]>(() => createInitialNoteRows());
  const [checklist, setChecklist] = useState<ChecklistState>(() => createInitialChecklist());
  const reportRootRef = useRef<HTMLElement | null>(null);

  const restoreDraft = useCallback((draft: LocatingSnapshot) => {
    setForm(normalizeForm(draft?.form));
    setPinPlanRows(normalizePinPlanRows(draft?.pinPlanRows));
    setNoteRows(normalizeNoteRows(draft?.noteRows));
    setChecklist(normalizeChecklist(draft?.checklist));
  }, []);

  const { clearDraft } = useAutosaveDraft<LocatingSnapshot>({
    storageKey: DRAFT_KEY,
    value: { form, pinPlanRows, noteRows, checklist },
    onRestore: restoreDraft,
  });

  function handleFormChange<K extends keyof LocatingForm>(key: K, value: LocatingForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePinPlanChange<K extends keyof PinPlanRow>(id: string, key: K, value: PinPlanRow[K]) {
    setPinPlanRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  }

  function handleNoteChange<K extends keyof NoteRow>(id: string, key: K, value: NoteRow[K]) {
    setNoteRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  }

  function toggleChecklist(id: ChecklistId) {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function addPinPlanRow() {
    setPinPlanRows((prev) => [...prev, createPinPlanRow()]);
  }

  function removePinPlanRow(id: string) {
    setPinPlanRows((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  }

  function addNoteRow() {
    setNoteRows((prev) => [...prev, createNoteRow()]);
  }

  function removeNoteRow(id: string) {
    setNoteRows((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setPinPlanRows(createInitialPinPlanRows());
    setNoteRows(createInitialNoteRows());
    setChecklist(createInitialChecklist());
    clearDraft();
  }

  function handleDemoFill() {
    setForm({
      lengthMm: "320",
      widthMm: "210",
      heightMm: "85",
      massKg: "6.4",
      primaryDatum: "bottom",
      secondaryDatum: "left",
      tertiaryDatum: "front",
      thermalEnabled: true,
      deltaT: "35",
      pinDiameter: "12",
      materialPair: "alu-steel",
    });

    setPinPlanRows([
      {
        id: createId(),
        feature: locale === "tr" ? "Datum A deliği" : "Datum A hole",
        pinRole: "fixed",
        holeType: "round",
        notes:
          locale === "tr"
            ? "H7 raybalı delik, pim h6. Ana konum referansı."
            : "Reamed H7 hole, h6 pin. Main location reference.",
      },
      {
        id: createId(),
        feature: locale === "tr" ? "Datum B deliği" : "Datum B hole",
        pinRole: "floating",
        holeType: "slot",
        notes:
          locale === "tr"
            ? "Uzun eksende slot, termal genleşme için kayan pim."
            : "Slot on long axis, floating pin for thermal growth.",
      },
    ]);

    setNoteRows([
      {
        id: createId(),
        topic: locale === "tr" ? "Çapak kontrolü" : "Burr control",
        owner: locale === "tr" ? "Proses" : "Process",
        note:
          locale === "tr"
            ? "Pim girişlerinde 0.5x45° pah ve talaş tahliye cebi eklenecek."
            : "Add 0.5x45° chamfer at pin entries and chip relief pocket.",
      },
      {
        id: createId(),
        topic: locale === "tr" ? "Ölçüm" : "Inspection",
        owner: locale === "tr" ? "Kalite" : "Quality",
        note:
          locale === "tr"
            ? "Datum A-B arası CMM ile ilk parça onayı yapılacak."
            : "Validate A-B datum relation with CMM at first article approval.",
      },
    ]);

    setChecklist({
      accessibility: true,
      chipEvacuation: true,
      chamfers: true,
      antiRotation: true,
      repeatability: true,
      inspection: false,
    });
  }

  function handleLoadData(snapshot: LocatingSnapshot) {
    setForm(normalizeForm(snapshot?.form));
    setPinPlanRows(normalizePinPlanRows(snapshot?.pinPlanRows));
    setNoteRows(normalizeNoteRows(snapshot?.noteRows));
    setChecklist(normalizeChecklist(snapshot?.checklist));
  }

  const computed = useMemo(() => {
    const length = parsePositive(form.lengthMm);
    const width = parsePositive(form.widthMm);
    const height = parsePositive(form.heightMm);
    const mass = parsePositive(form.massKg);
    const pinDiameter = parsePositive(form.pinDiameter);

    const dimensions = [length, width, height].filter((value): value is number => value !== null);
    const maxDimension = dimensions.length > 0 ? Math.max(...dimensions) : null;

    const edgeMin = pinDiameter ? pinDiameter * 1.5 : null;
    const edgePreferred = pinDiameter ? pinDiameter * 2.0 : null;

    const temperatureDelta = form.thermalEnabled ? parsePositive(form.deltaT) : null;
    const coeff = MATERIAL_PAIR_COEFFICIENTS[form.materialPair];

    const thermalGrowthPart =
      maxDimension && temperatureDelta ? maxDimension * coeff.part * temperatureDelta : null;
    const differentialGrowth =
      maxDimension && temperatureDelta
        ? maxDimension * Math.abs(coeff.part - coeff.fixture) * temperatureDelta
        : null;

    const slotExtra = differentialGrowth !== null ? differentialGrowth + 0.1 : null;

    return {
      length,
      width,
      height,
      mass,
      edgeMin,
      edgePreferred,
      thermalGrowthPart,
      differentialGrowth,
      slotExtra,
    };
  }, [form]);

  const completedChecklist = CHECKLIST_IDS.filter((id) => checklist[id]).length;

  return (
    <PageShell>
      <ReportActions
        toolKey="fixture-locating"
        currentData={{ form, pinPlanRows, noteRows, checklist }}
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
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Field label={copy.fields.lengthMm} value={form.lengthMm} onChange={(value) => handleFormChange("lengthMm", value)} />
            <Field label={copy.fields.widthMm} value={form.widthMm} onChange={(value) => handleFormChange("widthMm", value)} />
            <Field label={copy.fields.heightMm} value={form.heightMm} onChange={(value) => handleFormChange("heightMm", value)} />
            <Field label={copy.fields.massKg} value={form.massKg} onChange={(value) => handleFormChange("massKg", value)} />

            <SelectField
              label={copy.fields.primaryDatum}
              value={form.primaryDatum}
              onChange={(value) => handleFormChange("primaryDatum", value as DatumId)}
              options={DATUM_IDS.map((id) => ({ value: id, label: copy.datumOptions[id] }))}
            />
            <SelectField
              label={copy.fields.secondaryDatum}
              value={form.secondaryDatum}
              onChange={(value) => handleFormChange("secondaryDatum", value as DatumId)}
              options={DATUM_IDS.map((id) => ({ value: id, label: copy.datumOptions[id] }))}
            />
            <SelectField
              label={copy.fields.tertiaryDatum}
              value={form.tertiaryDatum}
              onChange={(value) => handleFormChange("tertiaryDatum", value as DatumId)}
              options={DATUM_IDS.map((id) => ({ value: id, label: copy.datumOptions[id] }))}
            />
            <SelectField
              label={copy.fields.pinDiameter}
              value={form.pinDiameter}
              onChange={(value) => handleFormChange("pinDiameter", value)}
              options={PIN_DIAMETERS.map((diameter) => ({ value: diameter, label: `Ø${diameter}` }))}
            />

            <SelectField
              label={copy.fields.materialPair}
              value={form.materialPair}
              onChange={(value) => handleFormChange("materialPair", value as MaterialPair)}
              options={(["steel-steel", "alu-steel", "alu-alu"] as MaterialPair[]).map((pair) => ({
                value: pair,
                label: copy.materialPairOptions[pair],
              }))}
            />

            <label className="space-y-1">
              <span className="block text-[11px] font-medium text-slate-700">{copy.fields.thermalEnabled}</span>
              <div className="flex items-center rounded-lg border border-slate-300 px-2 py-2">
                <input
                  type="checkbox"
                  checked={form.thermalEnabled}
                  onChange={(event) => handleFormChange("thermalEnabled", event.target.checked)}
                  className="h-4 w-4"
                />
              </div>
            </label>

            <Field
              label={copy.fields.deltaT}
              value={form.deltaT}
              onChange={(value) => handleFormChange("deltaT", value)}
              disabled={!form.thermalEnabled}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.sections.results}</h2>

          {computed.length && computed.width && computed.height && computed.edgeMin && computed.edgePreferred ? (
            <div className="space-y-3">
              <ResultRow
                label={copy.resultLabels.edgeDistance}
                value={`${computed.edgeMin.toFixed(1)} - ${computed.edgePreferred.toFixed(1)} mm (1.5-2.0 x Ø${form.pinDiameter})`}
              />
              <ResultRow
                label={copy.resultLabels.pinStrategy}
                value={`${copy.pinRoleOptions.fixed} + ${copy.pinRoleOptions.floating}: ${copy.holeTypeOptions.round} + ${copy.holeTypeOptions.slot}`}
              />
              <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-700">
                <p className="font-semibold text-slate-900">{copy.resultLabels.fitGuidance}</p>
                <p className="mt-1">
                  {locale === "tr"
                    ? "Sabit pimde raybalı delik H7 + pim h6 önerilir. Kayan pim tarafında slot/uzun delik ile montaj ve termal tolerans payı bırakın."
                    : "Use reamed H7 hole with h6 pin for fixed location. On floating side, use slot/elongated hole for assembly and thermal tolerance."}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-700">
                <p className="font-semibold text-slate-900">{copy.resultLabels.thermalNote}</p>
                {form.thermalEnabled ? (
                  <div className="mt-1 space-y-1">
                    <p>
                      {locale === "tr" ? "Parça uzun eksende tahmini genleşme" : "Estimated part thermal growth on long axis"}: {" "}
                      {computed.thermalGrowthPart !== null ? `${computed.thermalGrowthPart.toFixed(3)} mm` : "-"}
                    </p>
                    <p>
                      {locale === "tr" ? "Parça-fikstür diferansiyel genleşme" : "Part-fixture differential growth"}: {" "}
                      {computed.differentialGrowth !== null ? `${computed.differentialGrowth.toFixed(3)} mm` : "-"}
                    </p>
                    <p>
                      {copy.resultLabels.slotHint}: {" "}
                      {computed.slotExtra !== null ? `${computed.slotExtra.toFixed(3)} mm` : "-"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1">{copy.resultLabels.noThermalNote}</p>
                )}
              </div>

              <ResultRow
                label={copy.resultLabels.massInfo}
                value={
                  computed.mass !== null
                    ? locale === "tr"
                      ? `${computed.mass.toFixed(2)} kg - düşük ezilme riski için yeterli temas alanı kontrol edin.`
                      : `${computed.mass.toFixed(2)} kg - verify contact area to avoid local crushing.`
                    : "-"
                }
              />
            </div>
          ) : (
            <p className="text-[11px] text-slate-600">{copy.resultLabels.missingInputs}</p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">{copy.sections.pinPlan}</h2>
            <button
              type="button"
              onClick={addPinPlanRow}
              className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
            >
              {copy.addPinRow}
            </button>
          </div>

          <div className="space-y-2">
            {pinPlanRows.map((row) => (
              <div
                key={row.id}
                className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[minmax(0,1.2fr)_150px_140px_minmax(0,1fr)_80px]"
              >
                <input
                  type="text"
                  value={row.feature}
                  onChange={(event) => handlePinPlanChange(row.id, "feature", event.target.value)}
                  placeholder={copy.placeholders.pinFeature}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                />
                <select
                  value={row.pinRole}
                  onChange={(event) => handlePinPlanChange(row.id, "pinRole", event.target.value as PinRole)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                >
                  {(["fixed", "floating"] as PinRole[]).map((role) => (
                    <option key={role} value={role}>
                      {copy.pinRoleOptions[role]}
                    </option>
                  ))}
                </select>
                <select
                  value={row.holeType}
                  onChange={(event) => handlePinPlanChange(row.id, "holeType", event.target.value as HoleType)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                >
                  {(["round", "slot"] as HoleType[]).map((type) => (
                    <option key={type} value={type}>
                      {copy.holeTypeOptions[type]}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={row.notes}
                  onChange={(event) => handlePinPlanChange(row.id, "notes", event.target.value)}
                  placeholder={copy.placeholders.pinNotes}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                />
                <button
                  type="button"
                  onClick={() => removePinPlanRow(row.id)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                >
                  {copy.remove}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-left text-[11px]">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">{copy.table.feature}</th>
                  <th className="px-3 py-2 font-semibold">{copy.table.pinRole}</th>
                  <th className="px-3 py-2 font-semibold">{copy.table.holeType}</th>
                  <th className="px-3 py-2 font-semibold">{copy.table.notes}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
                {pinPlanRows.map((row) => (
                  <tr key={`${row.id}-summary`}>
                    <td className="px-3 py-2">{row.feature || "-"}</td>
                    <td className="px-3 py-2">{copy.pinRoleOptions[row.pinRole]}</td>
                    <td className="px-3 py-2">{copy.holeTypeOptions[row.holeType]}</td>
                    <td className="px-3 py-2 text-slate-700">{row.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.sections.checklist}</h2>
            <div className="space-y-2">
              {CHECKLIST_IDS.map((id) => (
                <label key={id} className="flex items-start gap-2 rounded-lg border border-slate-200 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={checklist[id]}
                    onChange={() => toggleChecklist(id)}
                    className="mt-0.5 h-4 w-4"
                  />
                  <span className="text-[11px] text-slate-700">{copy.checklistLabels[id]}</span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-600">
              {copy.checklistProgress}: {completedChecklist}/{CHECKLIST_IDS.length}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900">{copy.sections.notes}</h2>
              <button
                type="button"
                onClick={addNoteRow}
                className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
              >
                {copy.addNoteRow}
              </button>
            </div>

            <div className="space-y-2">
              {noteRows.map((row) => (
                <div
                  key={row.id}
                  className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[160px_150px_minmax(0,1fr)_80px]"
                >
                  <input
                    type="text"
                    value={row.topic}
                    onChange={(event) => handleNoteChange(row.id, "topic", event.target.value)}
                    placeholder={copy.placeholders.noteTopic}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                  />
                  <input
                    type="text"
                    value={row.owner}
                    onChange={(event) => handleNoteChange(row.id, "owner", event.target.value)}
                    placeholder={copy.placeholders.noteOwner}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                  />
                  <input
                    type="text"
                    value={row.note}
                    onChange={(event) => handleNoteChange(row.id, "note", event.target.value)}
                    placeholder={copy.placeholders.noteBody}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                  />
                  <button
                    type="button"
                    onClick={() => removeNoteRow(row.id)}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {copy.remove}
                  </button>
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

function Field({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <input
        type="number"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40 disabled:bg-slate-100"
      />
    </label>
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
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-[11px] text-slate-600">{label}</span>
      <span className="font-mono text-[11px] font-semibold text-slate-900">{value}</span>
    </div>
  );
}
