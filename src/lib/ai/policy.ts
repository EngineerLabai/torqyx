import "server-only";

import type { Locale } from "@/utils/locale";
import type { ToolSummaryRequest, ToolSummaryResponse } from "@/src/lib/ai/types";
import { toolSummaryResponseSchema } from "@/src/lib/ai/types";

const STANDARD_REFUSAL_BY_LOCALE: Record<Locale, string> = {
  tr:
    "Kesin standart numarası veya madde doğrulaması sağlayamam. Lütfen güncel resmi standart kaynağını (ör. ISO/DIN/EN/ASME resmi yayını) kontrol edin.",
  en:
    "I cannot provide exact standard numbers or clause validation. Please verify against the latest official standard source (e.g., official ISO/DIN/EN/ASME publication).",
};

const SAFETY_REFUSAL_BY_LOCALE: Record<Locale, string> = {
  tr:
    "Bu çıktı bir güvenli tasarım onayı değildir. Nihai güvenlik ve uygunluk değerlendirmesi yetkin mühendislik doğrulaması gerektirir.",
  en:
    "This output is not a safe-design approval. Final safety and compliance decisions require qualified engineering verification.",
};

const DISCLAIMER_BY_LOCALE: Record<Locale, string> = {
  tr:
    "Bu özet yalnızca bilgilendirme amaçlıdır; hesap doğruluğu, güvenlik, uygunluk, sertifikasyon veya mevzuat uyumu garantisi vermez. Nihai karar için resmi standartlar, üretici verileri ve yetkin mühendis onayı gereklidir.",
  en:
    "This summary is for informational purposes only and does not guarantee calculation accuracy, safety, compliance, certification, or regulatory conformity. Final decisions require official standards, manufacturer data, and qualified engineering approval.",
};

const SYSTEM_PROMPT_BY_LOCALE: Record<Locale, string> = {
  tr: [
    "Rol: Sen yalnızca `tool_summary` modu için çalışan bir mühendislik özetleyicisisin.",
    "Görev: Verilen deterministik giriş/çıkışları ÖZETLE. Asla yeni hesaplama yapma, sayı türetme, optimizasyon önerisiyle yeni sonuç üretme.",
    "Kesin kurallar:",
    "1) Uydurma standart, standart numarası, madde veya referans üretme.",
    "2) Kullanıcı kesin standart numarası/madde isterse nazikçe reddet ve resmi kaynağa yönlendir.",
    "3) Asla \"tasarım güvenlidir\", \"onaylandı\", \"sertifikalı\", \"uygundur\" gibi kesin güvenlik/uygunluk iddiası verme.",
    "4) Her yanıtta mutlaka açık bir disclaimer yaz.",
    "5) Sonuç alanlarını kısa, net ve teknik olarak temkinli yaz.",
    "Çıktı formatı: Yalnızca geçerli JSON döndür.",
    "JSON şeması (alan adlarını birebir koru):",
    "{",
    "  \"summaryMd\": \"string\",",
    "  \"assumptions\": [\"string\"],",
    "  \"warnings\": [\"string\"],",
    "  \"nextSteps\": [\"string\"],",
    "  \"disclaimerMd\": \"string\"",
    "}",
    "Ek kural: `warnings` içinde gerektiğinde standart doğrulama ve güvenlik onayı verilmediğine dair uyarı yer almalı.",
  ].join("\n"),
  en: [
    "Role: You are an engineering summarizer that only operates in `tool_summary` mode.",
    "Task: SUMMARIZE the provided deterministic inputs/outputs. Never calculate new values, derive hidden numbers, or generate optimization-based computed results.",
    "Hard rules:",
    "1) Do not invent standards, standard numbers, clauses, or references.",
    "2) If asked for exact standard numbers/clauses, politely refuse and direct to official sources.",
    "3) Never claim \"safe design\", \"approved\", \"certified\", or compliance guarantees.",
    "4) Always include a clear disclaimer.",
    "5) Keep fields concise, practical, and technically cautious.",
    "Output format: Return valid JSON only.",
    "JSON schema (keep exact field names):",
    "{",
    "  \"summaryMd\": \"string\",",
    "  \"assumptions\": [\"string\"],",
    "  \"warnings\": [\"string\"],",
    "  \"nextSteps\": [\"string\"],",
    "  \"disclaimerMd\": \"string\"",
    "}",
    "Additional rule: `warnings` should include standards verification / no safety approval reminder when relevant.",
  ].join("\n"),
};

const STANDARD_PATTERN = /\b(?:ISO|DIN|EN|ASME|ASTM|IEC)\s*[-:]?\s*\d+[A-Za-z0-9-]*\b/im;
const SAFETY_APPROVAL_PATTERN =
  /\b(safe design|design is safe|approved|certified|fully compliant|güvenli tasarım|tasarım güvenlidir|onaylı|sertifikalı|tam uyumlu)\b/im;

const trimList = (values: string[], fallback: string) => {
  const cleaned = values
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 12);
  if (cleaned.length > 0) return cleaned;
  return [fallback];
};

const stripPotentiallyUnsafeClaims = (text: string) =>
  text
    .replace(new RegExp(STANDARD_PATTERN.source, "gim"), "")
    .replace(new RegExp(SAFETY_APPROVAL_PATTERN.source, "gim"), "")
    .replace(/\s{2,}/g, " ")
    .trim();

export const getToolSummarySystemPrompt = (locale: Locale) => SYSTEM_PROMPT_BY_LOCALE[locale];

export const getToolSummaryDisclaimer = (locale: Locale) => DISCLAIMER_BY_LOCALE[locale];

export const buildToolSummaryUserPrompt = (payload: ToolSummaryRequest) => {
  const compactPayload = {
    mode: "tool_summary",
    locale: payload.locale,
    toolId: payload.toolId,
    toolName: payload.toolName,
    inputs: payload.inputs,
    outputs: payload.outputs,
    units: payload.units ?? {},
    notes: payload.notes ?? [],
  };

  return [
    "Summarize the deterministic tool result payload below.",
    "Do not compute new values. Use only provided data.",
    "Return JSON only.",
    JSON.stringify(compactPayload),
  ].join("\n\n");
};

export const normalizeToolSummaryResponse = (
  locale: Locale,
  response: unknown,
): ToolSummaryResponse => {
  const parsed = toolSummaryResponseSchema.safeParse(response);
  if (!parsed.success) {
    throw new Error("invalid_ai_response_shape");
  }

  const cleanedSummary = stripPotentiallyUnsafeClaims(parsed.data.summaryMd);
  const cleanedAssumptions = parsed.data.assumptions
    .map((item) => stripPotentiallyUnsafeClaims(item))
    .filter((item) => item.length > 0);
  const cleanedNextSteps = parsed.data.nextSteps
    .map((item) => stripPotentiallyUnsafeClaims(item))
    .filter((item) => item.length > 0);
  const warnings = [...parsed.data.warnings];

  if (STANDARD_PATTERN.test(JSON.stringify(parsed.data))) {
    warnings.unshift(STANDARD_REFUSAL_BY_LOCALE[locale]);
  }

  if (SAFETY_APPROVAL_PATTERN.test(JSON.stringify(parsed.data))) {
    warnings.unshift(SAFETY_REFUSAL_BY_LOCALE[locale]);
  }

  return {
    summaryMd: cleanedSummary.length > 0 ? cleanedSummary : parsed.data.summaryMd.trim(),
    assumptions: trimList(
      cleanedAssumptions,
      locale === "tr" ? "Girdilerin doğru ve güncel olduğu varsayıldı." : "Inputs are assumed to be accurate and current.",
    ),
    warnings: trimList(
      warnings,
      locale === "tr"
        ? "Bu özet güvenlik/uygunluk onayı vermez; resmi kaynaklarla doğrulama gerekir."
        : "This summary is not a safety/compliance approval; verify with official sources.",
    ),
    nextSteps: trimList(
      cleanedNextSteps,
      locale === "tr"
        ? "Resmi standart ve üretici verileri ile sonucu doğrulayın."
        : "Validate the result against official standards and manufacturer data.",
    ),
    disclaimerMd: getToolSummaryDisclaimer(locale),
  };
};

export const buildFallbackToolSummaryResponse = (
  locale: Locale,
  toolName: string,
): ToolSummaryResponse => {
  if (locale === "tr") {
    return {
      summaryMd: "AI şu an kullanılamıyor.",
      assumptions: [
        "Sadece gönderilen deterministik araç çıktıları esas alınmalıdır.",
        `Araç bağlamı: ${toolName}`,
      ],
      warnings: [
        "AI sağlayıcısı geçici olarak yanıt veremedi veya kota sınırına ulaşıldı.",
        STANDARD_REFUSAL_BY_LOCALE.tr,
        SAFETY_REFUSAL_BY_LOCALE.tr,
      ],
      nextSteps: [
        "Kısa süre sonra tekrar deneyin.",
        "Resmi standart, üretici dokümanı ve proje şartlarıyla manuel doğrulama yapın.",
      ],
      disclaimerMd: DISCLAIMER_BY_LOCALE.tr,
    };
  }

  return {
    summaryMd: "AI temporarily unavailable.",
    assumptions: [
      "Only provided deterministic tool outputs should be considered.",
      `Tool context: ${toolName}`,
    ],
    warnings: [
      "The AI provider is temporarily unavailable or quota has been reached.",
      STANDARD_REFUSAL_BY_LOCALE.en,
      SAFETY_REFUSAL_BY_LOCALE.en,
    ],
    nextSteps: [
      "Retry in a few moments.",
      "Cross-check manually with official standards, manufacturer documents, and project requirements.",
    ],
    disclaimerMd: DISCLAIMER_BY_LOCALE.en,
  };
};
