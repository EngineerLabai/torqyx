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

const TOOL_EXPLAIN_PROMPTS_BY_ID: Record<string, { tr: string; en: string }> = {
  bolt: {
    tr:
      "Bu açıklamada ISO 898-1 ve DIN 931 bağlamında mavi somun/civata tasarımına odaklan. Tipik olarak 8.8 ve 10.9 sınıf civatalarda gerilme dayanımı, çekme mukavemeti ve öngerilmenin etkisi önemlidir. Yaygın hatalar: yetersiz ön gerilme, sürtünme tahmini, kayma ve yorulma hesabını göz ardı etmek.",
    en:
      "Focus on bolt and fastener design in the context of ISO 898-1 and DIN 931. Typical strength classes are 8.8 and 10.9, where tensile strength, preload, and shear interaction matter. Common mistakes include underestimating preload, friction effects, and fatigue margins.",
  },
  gear: {
    tr:
      "Bu açıklamada dişli hesabı için ISO 6336 / DIN 3990 standartlarına yakın pratik bir yorum yap. Kritik eşik değerler diş kök gerilmesi, pitting yükü ve yükleme faktörleridir. Yaygın hatalar: aşırı markalama, yanlış diş modülü seçimi ve yağ filmi kalınlığını hafife alma.",
    en:
      "Explain gear calculation with practical ISO 6336 / DIN 3990 awareness. Key thresholds are root stress, pitting load, and load factors. Common issues are excessive contact stress, wrong module selection, and underestimating lubricant film thickness.",
  },
  bearing: {
    tr:
      "Bu açıklama rulman tasarımında ISO 281 / DIN 620 çerçevesinde olmalıdır. Dinamik yük kapasitesi, C/P oranı ve L10 ömrü kritik eşiklerdir. Yaygın hatalar: yanlış yük dağılımı, yeterli yağlama olmaması ve montaj hizalamasını göz ardı etmek.",
    en:
      "Keep the bearing explanation within ISO 281 / DIN 620 practice. Dynamic load rating, C/P ratio, and L10 life are key thresholds. Common design errors include incorrect load distribution, insufficient lubrication, and misalignment.",
  },
  weld: {
    tr:
      "Bu açıklamada kaynak tasarımı için AWS D1.1 ve EN 1993-1-8 bağlamındaki pratik uygulamalar odaklanmalıdır. Kaynak kalitesi, filet boyutu, yanal ve çekme gerilmeleri kritik eşiklerdir. Yaygın hatalar: yetersiz kaynak boyutu, residual stress göz ardı, metallurgical properties farkında olmama.",
    en:
      "Address weld design within AWS D1.1 and EN 1993-1-8 practical context. Joint strength, fillet size, and stress concentration are critical. Common errors are undersized welds, ignoring residual stress, and poor heat-affected zone awareness.",
  },
  stress: {
    tr:
      "Gerilim analizi için ASME ve EN 13445 standartlarına göre kontrol yapılmalıdır. Von Mises eşdeğer gerilim, güvenlik faktörü ve yorulma ömrü hesabı kritik öğelerdir. Yaygın hatalar: stress concentration faktörü göz ardı, zayıf bölge (notch) etkisini görmeme, malzeme özellikleri yanlış kullanma.",
    en:
      "Stress analysis should follow ASME and EN 13445 standards. Von Mises equivalent stress, safety factors, and fatigue life are essential. Common mistakes include ignoring stress concentration factors, missing notch effects, and misapplying material properties.",
  },
  belt: {
    tr:
      "Bant tasarımında DIN 2217 ve ISO 1813 standartlarına yakın tutulmalıdır. Bant gerilmesi, yumrulu güç transferi ve aşınma kriteri önemlidir. Yaygın hatalar: inisiyal gerilmesi yetersiz, rulmanlı gerilime karşı koruma eksik, irtibat açısı yanlış hesaplanması.",
    en:
      "Belt drive design should align with DIN 2217 and ISO 1813 standards. Belt tension, power transmission capacity, and wear limits matter. Common issues include insufficient tension, inadequate idler support, and wrong wrap angle calculations.",
  },
  hydraulic: {
    tr:
      "Hidrolik sistem tasarımında ISO 4413 ve IEC 60617 standartlarına uygun olmak gerekir. Sistem basıncı, hız kayıpları, ısıl harita ve sızıntı kontrolü kritiktir. Yaygın hatalar: yüksek basınçta malzeme seçim hatası, hız sınırları aşkın, filtrasyon olmaksız çalıştırma.",
    en:
      "Hydraulic system design should follow ISO 4413 and IEC 60617 standards. Operating pressure, efficiency, heat generation, and leakage control are key. Common errors include poor material selection for high pressure, exceeding flow limits, and inadequate filtration.",
  },
  torque: {
    tr:
      "Tork ve güç hesapları ISO 1940 (balans) ve DIN 740 (şaft tasarımı) ışığında değerlendirilmelidir. Torsiyonel gerilim, bölüm modülü ve rezonans analizi önemlidir. Yaygın hatalar: şaft çapı yetersiz, burulma gerilmesi göz ardı, kritik hız hesabını yapmama.",
    en:
      "Torque and power calculations should align with ISO 1940 (balancing) and DIN 740 (shaft design). Torsional stress, section modulus, and critical speed matter. Common mistakes include undersized shafts, ignoring torsional fatigue, and missing resonance analysis.",
  },
  material: {
    tr:
      "Malzeme seçimi ISO 6892 ve EN 10025 standardlarına uygun şekilde yapılmalıdır. Çekme dayanımı, sertlik, tokluğu ve termal genleşme dikkate alınmalıdır. Yaygın hatalar: sıcaklık etkisini göz ardı, korozyon ortamında yanlış malzeme, kırılma tokluğu görmeme.",
    en:
      "Material selection should follow ISO 6892 and EN 10025 standards. Tensile strength, hardness, toughness, and thermal expansion are important. Common errors include neglecting temperature effects, wrong material in corrosive environments, and poor fracture toughness.",
  },
};

const getExplainContextPrompt = (toolId: string, locale: "tr" | "en") => {
  const normalized = toolId.toLowerCase();
  const promptKeys = Object.keys(TOOL_EXPLAIN_PROMPTS_BY_ID);

  for (const key of promptKeys) {
    if (normalized.includes(key)) {
      return TOOL_EXPLAIN_PROMPTS_BY_ID[key as keyof typeof TOOL_EXPLAIN_PROMPTS_BY_ID][locale];
    }
  }

  return locale === "tr"
    ? "Genel mekanik tasarım bağlamında, ilgili ISO/DIN standartlarına ismî olarak değinmeden pratik eşik değerleri, yaygın tasarım risklerini ve endüstri aralıklarını aktar."
    : "Provide a practical mechanical engineering explanation with ISO/DIN context. Describe typical threshold values, common design risks, and industry ranges without inventing exact clause numbers.";
};

export const buildExplainResultSystemPrompt = (locale: Locale, toolId: string) => {
  const common = locale === "tr"
    ? [
        "Rol: Sen ISO/DIN standartlarına göre mühendislik hesaplamalarını açıklayan deneyimli bir mühendis öğretmenisin.",
        "Dil: Akademik değil, sahaya yakın, net ve pratik bir dil kullan.",
        "Görev: Verilen deterministik girdileri, çıktıları ve hesap izini kullanarak bu sonucun hangi değerlerden etkilendiğini, marjını, olası değişiklik etkilerini ve gerçek mühendislik pratiğindeki anlamını açıkla.",
        "Kurallar:",
        "1) Yeni hesaplama yapma veya verilmemiş değerleri türetme.",
        "2) Tam standart numarası ya da madde vermekten kaçın; resmi kaynağa yönlendir.",
        "3) 'tasarım güvenlidir' veya 'onaylı' gibi kesin güvenlik beyanları verme.",
        "4) Sonucu kısa başlıklar ve net bölümler halinde açıkla.",
        "Çıktı: Markdown formatında, en azından şu başlıkları içerebilir: Overview, Critical factors, Safety margin, Sensitivity, Practical takeaway.",
      ].join("\n")
    : [
        "Role: You are an experienced engineering instructor who explains calculations with ISO/DIN awareness.",
        "Tone: Practical, not academic. Use clear hands-on language.",
        "Task: Use the provided deterministic inputs, outputs, and audit trail to explain which values drive the result, how large the margin is, what happens if parameters change, and what the result means in real engineering practice.",
        "Rules:",
        "1) Do not compute new values or derive unprovided numbers.",
        "2) Avoid inventing exact standard clause numbers; refer to official sources when needed.",
        "3) Do not claim that the design is approved or certified.",
        "4) Organize the answer into clear markdown sections.",
        "Output: Provide Markdown with at least these sections: Overview, Critical factors, Safety margin, Sensitivity, Practical takeaway.",
      ].join("\n");

  const contextPrompt = getExplainContextPrompt(toolId, locale);
  return `${common}\n\n${contextPrompt}`;
};

export const buildExplainResultUserPrompt = (payload: { locale: Locale; toolId: string; toolName: string; inputs: Record<string, unknown>; outputs: Record<string, unknown>; auditTrail?: unknown; question?: string; history?: { role: "user" | "assistant"; content: string }[] }) => {
  const lines: string[] = [
    payload.locale === "tr"
      ? "Aşağıdaki bilgileri kullanarak yanıt ver. Yalnızca sağlanan verileri kullan, yeni hesaplama yapma."
      : "Answer using the information below. Use only the provided values and do not compute new results.",
    `Tool: ${payload.toolName} (${payload.toolId})`,
    "Inputs:",
    JSON.stringify(payload.inputs, null, 2),
    "Outputs:",
    JSON.stringify(payload.outputs, null, 2),
  ];

  if (payload.auditTrail) {
    lines.push("Audit trail:", JSON.stringify(payload.auditTrail, null, 2));
  }

  if (payload.history?.length) {
    lines.push("Conversation history:");
    payload.history.forEach((message) => {
      lines.push(`${message.role}: ${message.content}`);
    });
  }

  if (payload.question) {
    lines.push(payload.locale === "tr" ? `Takip sorusu: ${payload.question}` : `Follow-up question: ${payload.question}`);
  } else {
    lines.push(
      payload.locale === "tr"
        ? "Açıklamayı aşağıdaki başlıklara göre ver: Genel Bakış, Kritik Faktörler, Güvenlik Marjı, Hassasiyet, Pratik Anlam."
        : "Provide the explanation with these headings: Overview, Critical factors, Safety margin, Sensitivity, Practical takeaway.",
    );
  }

  return lines.join("\n\n");
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
      summaryMd: "Açıklama hizmeti şu an kullanılamıyor.",
      assumptions: [
        "Sadece gönderilen deterministik araç çıktıları esas alınmalıdır.",
        `Araç bağlamı: ${toolName}`,
      ],
      warnings: [
        "Açıklama hizmeti geçici olarak yanıt veremedi veya kota sınırına ulaşıldı.",
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
    summaryMd: "Explanation service is temporarily unavailable.",
    assumptions: [
      "Only provided deterministic tool outputs should be considered.",
      `Tool context: ${toolName}`,
    ],
    warnings: [
      "The explanation service is temporarily unavailable or quota has been reached.",
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
