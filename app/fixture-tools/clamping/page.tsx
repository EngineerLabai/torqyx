"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ReportActions from "@/components/report/ReportActions";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { qualityReportActionsCopy } from "@/data/quality-tools/report-actions";
import { useAutosaveDraft } from "@/hooks/useAutosaveDraft";
import { assertNoTurkish } from "@/utils/i18n-assert";

type ChecklistId =
  | "forcePath"
  | "stopperPin"
  | "deformation"
  | "accessibility"
  | "torqueControl"
  | "safetyDirection";

type ClampingForm = {
  weightKg: string;
  safetyFactor: string;
  frictionMu: string;
  clampCount: string;
  lateralForceN: string;
  machiningDirectionNotes: string;
};

type ClampingPointRow = {
  id: string;
  location: string;
  contactArea: string;
  reactionPoint: string;
  risk: string;
  torqueMethod: string;
};

type SequenceRow = {
  id: string;
  order: string;
  step: string;
  notes: string;
};

type NoteRow = {
  id: string;
  topic: string;
  note: string;
};

type ChecklistState = Record<ChecklistId, boolean>;

type ClampingSnapshot = {
  form: ClampingForm;
  points: ClampingPointRow[];
  sequence: SequenceRow[];
  noteRows: NoteRow[];
  checklist: ChecklistState;
};

type ClampingCopy = {
  badge: string;
  beta: string;
  title: string;
  description: string;
  sections: {
    inputs: string;
    results: string;
    points: string;
    sequence: string;
    checklist: string;
    notes: string;
    references: string;
    disclaimerTitle: string;
  };
  fields: {
    weightKg: string;
    safetyFactor: string;
    frictionMu: string;
    clampCount: string;
    lateralForceN: string;
    machiningDirectionNotes: string;
  };
  placeholders: {
    machiningDirectionNotes: string;
    location: string;
    contactArea: string;
    reactionPoint: string;
    risk: string;
    torqueMethod: string;
    sequenceOrder: string;
    sequenceStep: string;
    sequenceNotes: string;
    noteTopic: string;
    noteBody: string;
  };
  table: {
    location: string;
    contactArea: string;
    reactionPoint: string;
    risk: string;
    torqueMethod: string;
    order: string;
    step: string;
    notes: string;
    topic: string;
    action: string;
  };
  resultLabels: {
    effectiveLateral: string;
    requiredClampTotal: string;
    requiredClampPer: string;
    formula: string;
    directionNote: string;
    warningTitle: string;
    noWarnings: string;
    lowFriction: string;
    highForce: string;
    useStopper: string;
    missingInputs: string;
  };
  checklistLabels: Record<ChecklistId, string>;
  checklistProgress: string;
  addPointRow: string;
  addSequenceRow: string;
  addNoteRow: string;
  remove: string;
  references: string[];
  disclaimer: string;
};

const DRAFT_KEY = "aielab:fixture:clamping:draft";

const INITIAL_FORM: ClampingForm = {
  weightKg: "25",
  safetyFactor: "1.6",
  frictionMu: "0.20",
  clampCount: "2",
  lateralForceN: "",
  machiningDirectionNotes: "",
};

const CHECKLIST_IDS: ChecklistId[] = [
  "forcePath",
  "stopperPin",
  "deformation",
  "accessibility",
  "torqueControl",
  "safetyDirection",
];

const clampingCopy: Record<"tr" | "en", ClampingCopy> = {
  tr: {
    badge: "Sıkıştırma",
    beta: "Beta",
    title: "Sıkıştırma Planlama Kartı",
    description:
      "Sürtünme tabanlı sıkıştırma kuvveti hesabı, reaksiyon planı ve operasyon sırası için yazdırılabilir mühendislik kartı.",
    sections: {
      inputs: "Girdiler",
      results: "Sonuçlar",
      points: "Clamping Points Tablosu",
      sequence: "Sıkma Sırası",
      checklist: "Kontrol Listesi",
      notes: "Notlar Tablosu",
      references: "Referanslar",
      disclaimerTitle: "Sorumluluk Notu",
    },
    fields: {
      weightKg: "Parça ağırlığı [kg]",
      safetyFactor: "Emniyet katsayısı (SF)",
      frictionMu: "Sürtünme katsayısı (μ)",
      clampCount: "Kıskaç sayısı",
      lateralForceN: "Harici yanal kuvvet F_lat [N] (opsiyonel)",
      machiningDirectionNotes: "İşleme yönü / kesme yönü notu",
    },
    placeholders: {
      machiningDirectionNotes: "Örn: Kesme kuvveti +X yönünde, ters yönde mekanik stopper mevcut.",
      location: "Kıskaç konumu",
      contactArea: "Temas alanı",
      reactionPoint: "Reaksiyon noktası",
      risk: "Risk",
      torqueMethod: "Tork yöntemi",
      sequenceOrder: "Sıra",
      sequenceStep: "Adım",
      sequenceNotes: "Not",
      noteTopic: "Konu",
      noteBody: "Not detayı",
    },
    table: {
      location: "Kıskaç konumu",
      contactArea: "Temas alanı",
      reactionPoint: "Reaksiyon noktası",
      risk: "Risk",
      torqueMethod: "Tork yöntemi",
      order: "Sıra",
      step: "Adım",
      notes: "Not",
      topic: "Konu",
      action: "İşlem",
    },
    resultLabels: {
      effectiveLateral: "Hesapta kullanılan yanal kuvvet",
      requiredClampTotal: "Toplam gereken sıkma kuvveti",
      requiredClampPer: "Kıskaç başına gereken kuvvet",
      formula: "Kullanılan formül",
      directionNote: "İşleme yönü notu",
      warningTitle: "Uyarılar",
      noWarnings: "Kritik uyarı yok. Kuvvet yolu ve deformasyon doğrulamasını yine kontrol edin.",
      lowFriction: "μ < 0.15: Sürtünme düşük, mekanik stopper/pim önerilir.",
      highForce: "Yüksek kıskaç kuvveti: Temas alanını artırın veya ilave reaksiyon noktası ekleyin.",
      useStopper: "Yanal yük için ayrı stopper/pin kullanımı önerildi.",
      missingInputs: "Sonuç için pozitif ağırlık, SF, μ ve kıskaç sayısı girin.",
    },
    checklistLabels: {
      forcePath: "Kıskaç kuvvet yolu (kıskaç -> parça -> dayama) net",
      stopperPin: "Yanal yük için stopper/pim tanımlı",
      deformation: "İnce kesit deformasyon riski değerlendirildi",
      accessibility: "Operatör erişimi ve sıkma ergonomisi uygun",
      torqueControl: "Tork yöntemi (Nm / turn-count) tanımlı",
      safetyDirection: "İşleme yönüne ters güvenli kilitleme mevcut",
    },
    checklistProgress: "Tamamlanan madde",
    addPointRow: "Kıskaç noktası ekle",
    addSequenceRow: "Sıra adımı ekle",
    addNoteRow: "Not satırı ekle",
    remove: "Sil",
    references: [
      "Temel sürtünme denklemi: Freq = (F_lat x SF) / μ.",
      "Düşük μ durumlarında mekanik dayama, sürtünmeye göre daha güvenlidir.",
      "Kuvvet yolunu kısa ve rijit tutmak tekrarlanabilirliği artırır.",
      "İnce duvar bölgelerinde yayılı baskı pabuçları kullanın.",
    ],
    disclaimer: "Tipik rehberdir, standartlar ve sorumlu mühendis doğrulaması gerekir.",
  },
  en: {
    badge: "Clamping",
    beta: "Beta",
    title: "Clamping Planning Card",
    description:
      "Printable engineering card for friction-based clamp force calculation, reaction planning, and operation sequence.",
    sections: {
      inputs: "Inputs",
      results: "Results",
      points: "Clamping Points Table",
      sequence: "Clamping Sequence",
      checklist: "Checklist",
      notes: "Notes Table",
      references: "References",
      disclaimerTitle: "Disclaimer",
    },
    fields: {
      weightKg: "Part weight [kg]",
      safetyFactor: "Safety factor (SF)",
      frictionMu: "Friction coefficient (μ)",
      clampCount: "Clamp count",
      lateralForceN: "External lateral force F_lat [N] (optional)",
      machiningDirectionNotes: "Machining direction / cutting direction notes",
    },
    placeholders: {
      machiningDirectionNotes: "e.g. Cutting force acts in +X, mechanical stopper is provided in reverse direction.",
      location: "Clamp location",
      contactArea: "Contact area",
      reactionPoint: "Reaction point",
      risk: "Risk",
      torqueMethod: "Torque method",
      sequenceOrder: "Order",
      sequenceStep: "Step",
      sequenceNotes: "Notes",
      noteTopic: "Topic",
      noteBody: "Note detail",
    },
    table: {
      location: "Clamp location",
      contactArea: "Contact area",
      reactionPoint: "Reaction point",
      risk: "Risk",
      torqueMethod: "Torque method",
      order: "Order",
      step: "Step",
      notes: "Notes",
      topic: "Topic",
      action: "Action",
    },
    resultLabels: {
      effectiveLateral: "Effective lateral force used in calculation",
      requiredClampTotal: "Required total clamp force",
      requiredClampPer: "Required force per clamp",
      formula: "Applied formula",
      directionNote: "Machining direction note",
      warningTitle: "Warnings",
      noWarnings: "No critical warning. Still validate force path and deformation risk.",
      lowFriction: "μ < 0.15: Low friction, add a mechanical stopper/pin.",
      highForce: "High clamp force: increase contact area or add extra reaction support.",
      useStopper: "Separate stopper/pin is recommended for lateral load handling.",
      missingInputs: "Enter positive weight, SF, μ, and clamp count for results.",
    },
    checklistLabels: {
      forcePath: "Force path (clamp -> part -> support) is clear",
      stopperPin: "Stopper/pin is defined for lateral load",
      deformation: "Thin-wall deformation risk is evaluated",
      accessibility: "Operator access and clamping ergonomics are acceptable",
      torqueControl: "Torque method (Nm / turn-count) is defined",
      safetyDirection: "Safe lock against machining direction is present",
    },
    checklistProgress: "Completed items",
    addPointRow: "Add Clamping Point",
    addSequenceRow: "Add Sequence Step",
    addNoteRow: "Add Note Row",
    remove: "Remove",
    references: [
      "Base friction equation: Freq = (F_lat x SF) / μ.",
      "When μ is low, mechanical stops are safer than friction-only retention.",
      "Short and rigid force paths improve repeatability.",
      "Use spread contact pads on thin-wall regions.",
    ],
    disclaimer: "Typical guidance, verify with standards and responsible engineer.",
  },
};

const createId = () => Math.random().toString(36).slice(2, 10);

function createPointRow(): ClampingPointRow {
  return {
    id: createId(),
    location: "",
    contactArea: "",
    reactionPoint: "",
    risk: "",
    torqueMethod: "",
  };
}

function createSequenceRow(order = ""): SequenceRow {
  return {
    id: createId(),
    order,
    step: "",
    notes: "",
  };
}

function createNoteRow(): NoteRow {
  return {
    id: createId(),
    topic: "",
    note: "",
  };
}

function createInitialChecklist(): ChecklistState {
  return {
    forcePath: false,
    stopperPin: false,
    deformation: false,
    accessibility: false,
    torqueControl: false,
    safetyDirection: false,
  };
}

function createInitialPoints(): ClampingPointRow[] {
  return [createPointRow()];
}

function createInitialSequence(): SequenceRow[] {
  return [createSequenceRow("1")];
}

function createInitialNotes(): NoteRow[] {
  return [createNoteRow()];
}

function parsePositive(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function normalizeForm(source: unknown): ClampingForm {
  if (!source || typeof source !== "object") return INITIAL_FORM;
  const row = source as Partial<ClampingForm>;
  return {
    weightKg: typeof row.weightKg === "string" ? row.weightKg : INITIAL_FORM.weightKg,
    safetyFactor: typeof row.safetyFactor === "string" ? row.safetyFactor : INITIAL_FORM.safetyFactor,
    frictionMu: typeof row.frictionMu === "string" ? row.frictionMu : INITIAL_FORM.frictionMu,
    clampCount: typeof row.clampCount === "string" ? row.clampCount : INITIAL_FORM.clampCount,
    lateralForceN: typeof row.lateralForceN === "string" ? row.lateralForceN : INITIAL_FORM.lateralForceN,
    machiningDirectionNotes:
      typeof row.machiningDirectionNotes === "string"
        ? row.machiningDirectionNotes
        : INITIAL_FORM.machiningDirectionNotes,
  };
}

function normalizePoints(source: unknown): ClampingPointRow[] {
  if (!Array.isArray(source) || source.length === 0) return createInitialPoints();
  const normalized = source
    .map((item): ClampingPointRow | null => {
      if (!item || typeof item !== "object") return null;
      const row = item as Partial<ClampingPointRow>;
      return {
        id: typeof row.id === "string" && row.id.trim() ? row.id : createId(),
        location: typeof row.location === "string" ? row.location : "",
        contactArea: typeof row.contactArea === "string" ? row.contactArea : "",
        reactionPoint: typeof row.reactionPoint === "string" ? row.reactionPoint : "",
        risk: typeof row.risk === "string" ? row.risk : "",
        torqueMethod: typeof row.torqueMethod === "string" ? row.torqueMethod : "",
      };
    })
    .filter((row): row is ClampingPointRow => row !== null);

  return normalized.length > 0 ? normalized : createInitialPoints();
}

function normalizeSequence(source: unknown): SequenceRow[] {
  if (!Array.isArray(source) || source.length === 0) return createInitialSequence();
  const normalized = source
    .map((item): SequenceRow | null => {
      if (!item || typeof item !== "object") return null;
      const row = item as Partial<SequenceRow>;
      return {
        id: typeof row.id === "string" && row.id.trim() ? row.id : createId(),
        order: typeof row.order === "string" ? row.order : "",
        step: typeof row.step === "string" ? row.step : "",
        notes: typeof row.notes === "string" ? row.notes : "",
      };
    })
    .filter((row): row is SequenceRow => row !== null);

  return normalized.length > 0 ? normalized : createInitialSequence();
}

function normalizeNotes(source: unknown): NoteRow[] {
  if (!Array.isArray(source) || source.length === 0) return createInitialNotes();
  const normalized = source
    .map((item): NoteRow | null => {
      if (!item || typeof item !== "object") return null;
      const row = item as Partial<NoteRow>;
      return {
        id: typeof row.id === "string" && row.id.trim() ? row.id : createId(),
        topic: typeof row.topic === "string" ? row.topic : "",
        note: typeof row.note === "string" ? row.note : "",
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

export default function ClampingPage() {
  const { locale } = useLocale();
  const copy = clampingCopy[locale];
  const actionsCopy = qualityReportActionsCopy[locale];
  assertNoTurkish(locale, copy, "fixture-tools/clamping");

  const [form, setForm] = useState<ClampingForm>(INITIAL_FORM);
  const [points, setPoints] = useState<ClampingPointRow[]>(() => createInitialPoints());
  const [sequence, setSequence] = useState<SequenceRow[]>(() => createInitialSequence());
  const [noteRows, setNoteRows] = useState<NoteRow[]>(() => createInitialNotes());
  const [checklist, setChecklist] = useState<ChecklistState>(() => createInitialChecklist());
  const reportRootRef = useRef<HTMLElement | null>(null);

  const restoreDraft = useCallback((draft: ClampingSnapshot) => {
    setForm(normalizeForm(draft?.form));
    setPoints(normalizePoints(draft?.points));
    setSequence(normalizeSequence(draft?.sequence));
    setNoteRows(normalizeNotes(draft?.noteRows));
    setChecklist(normalizeChecklist(draft?.checklist));
  }, []);

  const { clearDraft } = useAutosaveDraft<ClampingSnapshot>({
    storageKey: DRAFT_KEY,
    value: { form, points, sequence, noteRows, checklist },
    onRestore: restoreDraft,
  });

  function handleFormChange<K extends keyof ClampingForm>(key: K, value: ClampingForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePointChange<K extends keyof ClampingPointRow>(
    id: string,
    key: K,
    value: ClampingPointRow[K],
  ) {
    setPoints((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  }

  function handleSequenceChange<K extends keyof SequenceRow>(id: string, key: K, value: SequenceRow[K]) {
    setSequence((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  }

  function handleNoteChange<K extends keyof NoteRow>(id: string, key: K, value: NoteRow[K]) {
    setNoteRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  }

  function toggleChecklist(id: ChecklistId) {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function addPointRow() {
    setPoints((prev) => [...prev, createPointRow()]);
  }

  function removePointRow(id: string) {
    setPoints((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  }

  function addSequenceRow() {
    setSequence((prev) => [...prev, createSequenceRow(String(prev.length + 1))]);
  }

  function removeSequenceRow(id: string) {
    setSequence((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  }

  function addNoteRow() {
    setNoteRows((prev) => [...prev, createNoteRow()]);
  }

  function removeNoteRow(id: string) {
    setNoteRows((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setPoints(createInitialPoints());
    setSequence(createInitialSequence());
    setNoteRows(createInitialNotes());
    setChecklist(createInitialChecklist());
    clearDraft();
  }

  function handleDemoFill() {
    setForm({
      weightKg: "42",
      safetyFactor: "1.8",
      frictionMu: "0.12",
      clampCount: "3",
      lateralForceN: "2600",
      machiningDirectionNotes:
        locale === "tr"
          ? "Kesme kuvveti +Y yönünde. Negatif Y tarafında sabit mekanik stopper ve yan pim bulunuyor."
          : "Cutting force acts in +Y direction. Fixed mechanical stopper and side pin exist on negative Y side.",
    });

    setPoints([
      {
        id: createId(),
        location: locale === "tr" ? "Ön sağ kulak" : "Front-right ear",
        contactArea: locale === "tr" ? "Sertleştirilmiş pabuç" : "Hardened pad",
        reactionPoint: locale === "tr" ? "Taban dayama A" : "Base support A",
        risk: locale === "tr" ? "Yerel ezilme" : "Local crushing",
        torqueMethod: locale === "tr" ? "40 Nm tork anahtarı" : "40 Nm torque wrench",
      },
      {
        id: createId(),
        location: locale === "tr" ? "Arka sol flanş" : "Rear-left flange",
        contactArea: locale === "tr" ? "Yaylı baskı pabuç" : "Spring contact pad",
        reactionPoint: locale === "tr" ? "Yan dayama B" : "Side stop B",
        risk: locale === "tr" ? "Burulma" : "Twist",
        torqueMethod: locale === "tr" ? "Turn-count + marker" : "Turn-count + marker",
      },
    ]);

    setSequence([
      {
        id: createId(),
        order: "1",
        step: locale === "tr" ? "Birincil datum dayamaya oturt" : "Seat part against primary datum",
        notes: locale === "tr" ? "Pim teması görsel doğrulansın" : "Visually confirm pin contact",
      },
      {
        id: createId(),
        order: "2",
        step: locale === "tr" ? "Ön sağ kıskaçı sık" : "Tighten front-right clamp",
        notes: locale === "tr" ? "Ön yükleme 25 Nm" : "Preload 25 Nm",
      },
      {
        id: createId(),
        order: "3",
        step: locale === "tr" ? "Arka sol kıskaçı sık" : "Tighten rear-left clamp",
        notes: locale === "tr" ? "Nihai tork 40 Nm" : "Final torque 40 Nm",
      },
    ]);

    setNoteRows([
      {
        id: createId(),
        topic: locale === "tr" ? "Stopper" : "Stopper",
        note:
          locale === "tr"
            ? "Yanal kuvvet nedeniyle sürtünmeye ek mekanik stopper zorunlu tutuldu."
            : "Mechanical stopper mandated in addition to friction due to lateral load.",
      },
    ]);

    setChecklist({
      forcePath: true,
      stopperPin: true,
      deformation: true,
      accessibility: true,
      torqueControl: false,
      safetyDirection: true,
    });
  }

  function handleLoadData(snapshot: ClampingSnapshot) {
    setForm(normalizeForm(snapshot?.form));
    setPoints(normalizePoints(snapshot?.points));
    setSequence(normalizeSequence(snapshot?.sequence));
    setNoteRows(normalizeNotes(snapshot?.noteRows));
    setChecklist(normalizeChecklist(snapshot?.checklist));
  }

  const calc = useMemo(() => {
    const weight = parsePositive(form.weightKg);
    const safety = parsePositive(form.safetyFactor);
    const mu = parsePositive(form.frictionMu);
    const clampCount = parsePositive(form.clampCount);

    if (!weight || !safety || !mu || !clampCount) {
      return null;
    }

    const weightBasedForce = weight * 9.81;
    const externalForce = parsePositive(form.lateralForceN);
    const effectiveLateral = externalForce ?? weightBasedForce;

    const requiredTotal = (effectiveLateral * safety) / mu;
    const requiredPerClamp = requiredTotal / clampCount;

    const warnings: string[] = [];
    if (mu < 0.15) warnings.push(copy.resultLabels.lowFriction);
    if (requiredPerClamp > 8000 || requiredTotal > 25000) warnings.push(copy.resultLabels.highForce);
    if (mu < 0.15 || requiredPerClamp > 8000 || requiredTotal > 25000) {
      warnings.push(copy.resultLabels.useStopper);
    }

    return {
      weightBasedForce,
      effectiveLateral,
      requiredTotal,
      requiredPerClamp,
      warnings,
    };
  }, [form, copy.resultLabels.highForce, copy.resultLabels.lowFriction, copy.resultLabels.useStopper]);

  const completedChecklist = CHECKLIST_IDS.filter((id) => checklist[id]).length;

  return (
    <PageShell>
      <ReportActions
        toolKey="fixture-clamping"
        currentData={{ form, points, sequence, noteRows, checklist }}
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
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <NumberField label={copy.fields.weightKg} value={form.weightKg} onChange={(value) => handleFormChange("weightKg", value)} />
            <NumberField label={copy.fields.safetyFactor} value={form.safetyFactor} onChange={(value) => handleFormChange("safetyFactor", value)} />
            <NumberField label={copy.fields.frictionMu} value={form.frictionMu} onChange={(value) => handleFormChange("frictionMu", value)} />
            <NumberField label={copy.fields.clampCount} value={form.clampCount} onChange={(value) => handleFormChange("clampCount", value)} />
            <NumberField label={copy.fields.lateralForceN} value={form.lateralForceN} onChange={(value) => handleFormChange("lateralForceN", value)} />
          </div>
          <label className="mt-3 block space-y-1">
            <span className="block text-[11px] font-medium text-slate-700">{copy.fields.machiningDirectionNotes}</span>
            <textarea
              rows={3}
              value={form.machiningDirectionNotes}
              onChange={(event) => handleFormChange("machiningDirectionNotes", event.target.value)}
              placeholder={copy.placeholders.machiningDirectionNotes}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            />
          </label>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.sections.results}</h2>
          {calc ? (
            <div className="space-y-3">
              <ResultRow label={copy.resultLabels.effectiveLateral} value={`${calc.effectiveLateral.toFixed(1)} N`} />
              <ResultRow label={copy.resultLabels.requiredClampTotal} value={`${(calc.requiredTotal / 1000).toFixed(2)} kN`} />
              <ResultRow label={copy.resultLabels.requiredClampPer} value={`${(calc.requiredPerClamp / 1000).toFixed(2)} kN`} />
              <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-700">
                <p className="font-semibold text-slate-900">{copy.resultLabels.formula}</p>
                <p className="mt-1">F_req = (F_lat x SF) / μ</p>
                <p className="mt-1">
                  {`F_req = (${calc.effectiveLateral.toFixed(1)} x ${Number(form.safetyFactor).toFixed(2)}) / ${Number(form.frictionMu).toFixed(2)}`}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-700">
                <p className="font-semibold text-slate-900">{copy.resultLabels.directionNote}</p>
                <p className="mt-1">{form.machiningDirectionNotes.trim() || "-"}</p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900">
                <p className="font-semibold">{copy.resultLabels.warningTitle}</p>
                {calc.warnings.length > 0 ? (
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    {calc.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1">{copy.resultLabels.noWarnings}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-600">{copy.resultLabels.missingInputs}</p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">{copy.sections.points}</h2>
            <button type="button" onClick={addPointRow} className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800">
              {copy.addPointRow}
            </button>
          </div>

          <div className="space-y-2">
            {points.map((row) => (
              <div key={row.id} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_80px]">
                <input type="text" value={row.location} onChange={(event) => handlePointChange(row.id, "location", event.target.value)} placeholder={copy.placeholders.location} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40" />
                <input type="text" value={row.contactArea} onChange={(event) => handlePointChange(row.id, "contactArea", event.target.value)} placeholder={copy.placeholders.contactArea} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40" />
                <input type="text" value={row.reactionPoint} onChange={(event) => handlePointChange(row.id, "reactionPoint", event.target.value)} placeholder={copy.placeholders.reactionPoint} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40" />
                <input type="text" value={row.risk} onChange={(event) => handlePointChange(row.id, "risk", event.target.value)} placeholder={copy.placeholders.risk} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40" />
                <input type="text" value={row.torqueMethod} onChange={(event) => handlePointChange(row.id, "torqueMethod", event.target.value)} placeholder={copy.placeholders.torqueMethod} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40" />
                <button type="button" onClick={() => removePointRow(row.id)} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100">{copy.remove}</button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900">{copy.sections.sequence}</h2>
              <button type="button" onClick={addSequenceRow} className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800">{copy.addSequenceRow}</button>
            </div>
            <div className="space-y-2">
              {sequence.map((row) => (
                <div key={row.id} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[90px_minmax(0,1fr)_minmax(0,1fr)_80px]">
                  <input type="text" value={row.order} onChange={(event) => handleSequenceChange(row.id, "order", event.target.value)} placeholder={copy.placeholders.sequenceOrder} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40" />
                  <input type="text" value={row.step} onChange={(event) => handleSequenceChange(row.id, "step", event.target.value)} placeholder={copy.placeholders.sequenceStep} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40" />
                  <input type="text" value={row.notes} onChange={(event) => handleSequenceChange(row.id, "notes", event.target.value)} placeholder={copy.placeholders.sequenceNotes} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40" />
                  <button type="button" onClick={() => removeSequenceRow(row.id)} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100">{copy.remove}</button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.sections.checklist}</h2>
            <div className="space-y-2">
              {CHECKLIST_IDS.map((id) => (
                <label key={id} className="flex items-start gap-2 rounded-lg border border-slate-200 px-3 py-2">
                  <input type="checkbox" checked={checklist[id]} onChange={() => toggleChecklist(id)} className="mt-0.5 h-4 w-4" />
                  <span className="text-[11px] text-slate-700">{copy.checklistLabels[id]}</span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-600">{copy.checklistProgress}: {completedChecklist}/{CHECKLIST_IDS.length}</p>
          </section>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">{copy.sections.notes}</h2>
            <button type="button" onClick={addNoteRow} className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800">{copy.addNoteRow}</button>
          </div>
          <div className="space-y-2">
            {noteRows.map((row) => (
              <div key={row.id} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[220px_minmax(0,1fr)_80px]">
                <input type="text" value={row.topic} onChange={(event) => handleNoteChange(row.id, "topic", event.target.value)} placeholder={copy.placeholders.noteTopic} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40" />
                <input type="text" value={row.note} onChange={(event) => handleNoteChange(row.id, "note", event.target.value)} placeholder={copy.placeholders.noteBody} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40" />
                <button type="button" onClick={() => removeNoteRow(row.id)} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100">{copy.remove}</button>
              </div>
            ))}
          </div>
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

function NumberField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
      />
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
