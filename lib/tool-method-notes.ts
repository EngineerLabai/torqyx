import type { Locale } from "@/utils/locale";

export type ToolMethodInput = {
  name: string;
  unit?: string;
  range?: string;
  impact: string;
};

export type ToolMethodFormula = {
  summary: string;
  expressions: string[];
  notes?: string[];
};

export type ToolMethodExample = {
  inputs: Record<string, string>;
  outputs: Record<string, string>;
  interpretation: string;
};

export type ToolMethodFaq = {
  question: string;
  answer: string;
};

export type ToolMethodReference = {
  title: string;
  href?: string;
  note?: string;
};

export type ToolMethodNotes = {
  intro: string[];
  inputs: ToolMethodInput[];
  formula: ToolMethodFormula;
  assumptions: string[];
  example: ToolMethodExample;
  faqs: ToolMethodFaq[];
  references?: ToolMethodReference[];
};

export type ToolMethodNotesByLocale = {
  tr?: ToolMethodNotes;
  en?: ToolMethodNotes;
};

export const toolMethodNotes = {
  "bolt-calculator": {
    tr: {
      intro: [
        "Cıvata bağlantısında nominal çap, diş adımı ve kalite sınıfına göre gerilme alanını ve hedef ön yükü hesaplar.",
        "Bu değerler tork ayarında başlangıç noktası verir; yağlama ve yüzey koşulları sahada sonucu önemli ölçüde etkiler.",
      ],
      inputs: [
        {
          name: "Nominal çap (d)",
          unit: "mm",
          range: "M4–M24",
          impact: "Gerilme alanını büyütür, daha yüksek ön yük ve tork üretir.",
        },
        {
          name: "Diş adımı (P)",
          unit: "mm",
          range: "0.5–3.0",
          impact: "As değerini değiştirir; ince hatve daha yüksek gerilme alanı verir.",
        },
        {
          name: "Kalite sınıfı",
          range: "8.8 / 10.9 / 12.9",
          impact: "Akma dayanımı Re üzerinden izinli ön yük seviyesini belirler.",
        },
        {
          name: "Sürtünme durumu",
          range: "Kuru / yağlı / kaplamalı",
          impact: "Tork katsayısı K değişir; aynı torkta ön yük farklılaşır.",
        },
        {
          name: "Ön yük seviyesi",
          unit: "%Re",
          range: "60–80",
          impact: "Hedef ön yük ve tork doğrudan bu yüzde ile ölçeklenir.",
        },
      ],
      formula: {
        summary: "Gerilme alanı ISO metrik yaklaşımıyla hesaplanır, ön yük ise akma dayanımının seçilen yüzdesidir.",
        expressions: [
          "As = (π/4) · (d - 0.9382·P)^2",
          "Fv = (ön yük %) · Re · As",
          "T ≈ K · Fv · d",
        ],
        notes: ["Tork hesabında K sürtünme etkisini temsil eder, d metre cinsinden alınır."],
      },
      assumptions: [
        "ISO metrik diş profili ve standart hatve varsayılır.",
        "Sürtünme katsayısı sabit kabul edilir; gerçek tork sapabilir.",
        "Plastik şekil değiştirme, yüzey oturması ve elastik olmayan etkiler hesaba katılmaz.",
      ],
      example: {
        inputs: {
          "Nominal çap": "M10 (d=10 mm, P=1.5 mm)",
          "Kalite": "8.8",
          "Sürtünme": "Kuru",
          "Ön yük": "%70 Re",
        },
        outputs: {
          "As": "≈ 58 mm²",
          "Ön yük Fv": "≈ 26 kN",
          "Tork T": "≈ 65 Nm",
          "Emniyet katsayısı": "≈ 1.4",
        },
        interpretation: "Ön yük hedefi sağlanır ancak emniyet katsayısı sınırlıdır; kritik bağlantılarda daha yüksek emniyet gerekebilir.",
      },
      faqs: [
        {
          question: "Neden tork tek başına yeterli değil?",
          answer:
            "Sürtünme değişimi nedeniyle aynı tork farklı ön yükler doğurur. Kritik bağlantılarda tork+angle veya gerinim ölçümü tercih edilir.",
        },
        {
          question: "Ön yük yüzdesi kaç olmalı?",
          answer:
            "Statik bağlantılarda genellikle %60–75 Re aralığı kullanılır. Titreşimli bağlantılarda daha yüksek ön yük gerekebilir.",
        },
        {
          question: "Yağlama torku nasıl etkiler?",
          answer:
            "Yağlama K katsayısını düşürür; aynı torkla daha yüksek ön yük oluşur. Yağlı durumda tork düşürülmelidir.",
        },
        {
          question: "İnç (UNC/UNF) civatalar için geçerli mi?",
          answer:
            "Bu hesap ISO metrik diş profiline göre yapılır. İnç dişler için farklı gerilme alanı formülü gerekir.",
        },
      ],
      references: [
        { title: "ISO 898-1 (Civata mekanik özellikleri)" },
        { title: "VDI 2230 (Cıvata bağlantıları tasarımı)" },
      ],
    },
  },
  "unit-converter": {
    tr: {
      intro: [
        "Farklı birim sistemleri arasında hızlı dönüşüm sağlar ve tüm hesapları aynı birim setinde toplar.",
        "Özellikle rapor, çizim ve hesap tablolarında tutarlılık kontrolü için kullanılır.",
      ],
      inputs: [
        {
          name: "Kategori",
          range: "Uzunluk / Kuvvet / Basınç / Enerji",
          impact: "Seçilen kategori, kullanılabilir birim listesini ve katsayıları belirler.",
        },
        {
          name: "Kaynak birim",
          impact: "Girilen değerin temel birime çevrileceği başlangıç birimidir.",
        },
        {
          name: "Hedef birim",
          impact: "Temel birimden dönüştürülecek son birimdir.",
        },
        {
          name: "Değer",
          range: "Herhangi bir pozitif/negatif değer",
          impact: "Sonuç doğrudan bu değerin katsayısı ile ölçeklenir.",
        },
      ],
      formula: {
        summary: "Dönüşüm iki adımlıdır: önce temel birime, sonra hedef birime.",
        expressions: [
          "V_base = V_in · k_from",
          "V_out = V_base / k_to",
        ],
      },
      assumptions: [
        "Katsayılar sabit kabul edilir; sıcaklık/irtifa gibi çevresel etkiler hesaba katılmaz.",
        "Birim listesi yalnızca seçilen kategoriyi kapsar.",
      ],
      example: {
        inputs: {
          Kategori: "Kuvvet",
          "Kaynak birim": "N",
          "Hedef birim": "kN",
          "Değer": "1000",
        },
        outputs: {
          Sonuç: "1 kN",
          "Temel birim": "1000 N",
        },
        interpretation: "1 kN, 1000 N ile aynı kuvvet büyüklüğünü ifade eder.",
      },
      faqs: [
        {
          question: "Neden temel birim üzerinden dönüştürme yapılıyor?",
          answer:
            "Tek bir temel birim kullanmak dönüşümü hata riskinden arındırır ve yeni birim eklemeyi kolaylaştırır.",
        },
        {
          question: "Listede olmayan birimi nasıl dönüştürürüm?",
          answer:
            "Önce mevcut birimler üzerinden ara dönüşüm yapabilir veya desteğe yeni birim talebi gönderebilirsiniz.",
        },
        {
          question: "Basınç ve kuvvet dönüşümlerinde işaret önemli mi?",
          answer:
            "Negatif değerler matematiksel olarak dönüştürülür; fiziksel yorumunu siz belirlemelisiniz.",
        },
      ],
    },
  },
  "basic-engineering": {
    tr: {
      intro: [
        "Tek katmanlı bir malzeme üzerinden iletim (conduction) için ısı akışını hesaplar.",
        "İzolasyon kalınlığı, malzeme iletkenliği ve sıcaklık farkının etkisini hızlıca görmeyi sağlar.",
      ],
      inputs: [
        {
          name: "Isıl iletkenlik (k)",
          unit: "W/m·K",
          range: "0.02–400",
          impact: "k arttıkça ısı akışı artar.",
        },
        {
          name: "Alan (A)",
          unit: "m²",
          range: "0.01–10",
          impact: "Alan büyüdükçe ısı akışı artar.",
        },
        {
          name: "Sıcaklık farkı (ΔT)",
          unit: "K",
          range: "1–200",
          impact: "ΔT arttıkça ısı akışı artar.",
        },
        {
          name: "Kalınlık (L)",
          unit: "m",
          range: "0.001–0.5",
          impact: "Kalınlık arttıkça ısı akışı azalır.",
        },
      ],
      formula: {
        summary: "Fourier yasasının tek katmanlı 1D formu kullanılır.",
        expressions: [
          "Q = k · A · ΔT / L",
          "R = L / (k · A)",
        ],
      },
      assumptions: [
        "Sürekli rejim ve tek boyutlu iletim varsayılır.",
        "Malzeme özellikleri sabit ve sıcaklıktan bağımsız kabul edilir.",
        "Konveksiyon ve radyasyon etkileri hesaba katılmaz.",
      ],
      example: {
        inputs: {
          "k": "0.9 W/m·K",
          "A": "0.5 m²",
          "ΔT": "20 K",
          "L": "0.05 m",
        },
        outputs: {
          "Isı akışı Q": "≈ 180 W",
          "Isıl direnç R": "≈ 0.11 K/W",
        },
        interpretation: "Kalınlık iki katına çıkarsa Q yarıya düşer; ısı kaybını azaltmak için L artırılır.",
      },
      faqs: [
        {
          question: "Birden fazla katman varsa ne yapmalıyım?",
          answer:
            "Katmanların ısıl dirençleri toplanır: R_toplam = Σ(L/kA). Bu araç tek katman içindir.",
        },
        {
          question: "Konveksiyon etkisi dahil mi?",
          answer:
            "Hayır. Dış yüzey konveksiyonunu hesaba katmak için ek film dirençleri gerekir.",
        },
        {
          question: "ΔT hangi değerler arasında seçilmeli?",
          answer:
            "Yüzey sıcaklıkları veya ortam sıcaklıkları arasındaki gerçek fark kullanılmalıdır.",
        },
      ],
    },
  },
  "param-chart": {
    tr: {
      intro: [
        "Lineer yay için kuvvet–yer değiştirme (F–x) eğrisini hızlıca üretir.",
        "Grafik, yay karakteristiğini ve maksimum kuvveti görselleştirmek için kullanılır.",
      ],
      inputs: [
        {
          name: "Yay sabiti (k)",
          unit: "N/m",
          range: "100–50000",
          impact: "k arttıkça eğri dikleşir ve maksimum kuvvet artar.",
        },
        {
          name: "Maksimum yer değiştirme",
          unit: "mm",
          range: "1–100",
          impact: "x_max arttıkça maksimum kuvvet artar.",
        },
        {
          name: "Adım sayısı",
          range: "2–20",
          impact: "Nokta sayısını ve grafik çözünürlüğünü belirler.",
        },
      ],
      formula: {
        summary: "Lineer yay için Hooke yasası kullanılır; x metreye çevrilir.",
        expressions: [
          "F = k · x",
          "x (m) = x (mm) / 1000",
        ],
      },
      assumptions: [
        "Yay lineer davranır ve histerezis yoktur.",
        "Dinamik etkiler, sönüm ve sürtünme hesaba katılmaz.",
      ],
      example: {
        inputs: {
          "k": "10000 N/m",
          "x_max": "30 mm",
          "Adım": "7",
        },
        outputs: {
          "Adım boyu": "≈ 5 mm",
          "Maksimum kuvvet": "≈ 300 N",
        },
        interpretation: "Bu ayarlar 0–30 mm arasında 7 noktalı lineer bir F–x eğrisi üretir.",
      },
      faqs: [
        {
          question: "k birimi neden N/m?",
          answer:
            "Hesap x değerini metreye çevirir. N/mm ile çalışıyorsanız k değerini 1000 ile çarpın.",
        },
        {
          question: "Yay doğrusal değilse?",
          answer:
            "Bu araç doğrusal yaylar içindir. Nonlineer yaylar için deney verisi veya özel model gerekir.",
        },
        {
          question: "Adım sayısı sonucu etkiler mi?",
          answer:
            "Maksimum kuvvet değişmez; adım sayısı yalnızca grafiğin pürüzsüzlüğünü belirler.",
        },
      ],
    },
  },
  "simple-stress": {
    tr: {
      intro: [
        "Eksenel çekme yükü altında kesit gerilmesini ve emniyet katsayısını hesaplar.",
        "Malzeme akma dayanımı ile karşılaştırma yaparak hızlı bir dayanım kontrolü sağlar.",
      ],
      inputs: [
        {
          name: "Kuvvet (F)",
          unit: "N",
          range: "10–50000",
          impact: "Gerilme doğrudan F ile artar.",
        },
        {
          name: "Kesit alanı (A)",
          unit: "mm²",
          range: "10–5000",
          impact: "Alan büyüdükçe gerilme düşer.",
        },
        {
          name: "Malzeme",
          range: "S235, S355, C45...",
          impact: "Akma dayanımı Re değerini belirler.",
        },
      ],
      formula: {
        summary: "Gerilme hesaplanır ve akma dayanımına oranlanır.",
        expressions: [
          "σ = F / A",
          "n = Re / σ",
        ],
        notes: ["A mm² girildiğinde σ değeri MPa çıkar."],
      },
      assumptions: [
        "Eksenel yükleme ve düzgün gerilme dağılımı varsayılır.",
        "Gerilme yığılması, kesit zayıflaması ve burkulma etkileri hesaba katılmaz.",
      ],
      example: {
        inputs: {
          "Kuvvet": "8000 N",
          "Alan": "100 mm²",
          "Malzeme": "S235",
        },
        outputs: {
          "Gerilme": "≈ 80 MPa",
          "Emniyet katsayısı": "≈ 2.9",
        },
        interpretation: "Emniyet katsayısı 2’nin üzerinde olduğu için statik çekme için güvenli kabul edilir.",
      },
      faqs: [
        {
          question: "Basınç yüklerinde de kullanılabilir mi?",
          answer:
            "Gerilme hesabı aynı olsa da basınçta burkulma riski vardır. İnce elemanlarda burkulma ayrıca kontrol edilmelidir.",
        },
        {
          question: "Kesme veya eğilme gerilmesi için uygun mu?",
          answer:
            "Bu araç yalnızca çekme/eksenel gerilme içindir. Kesme veya eğilme için farklı formüller gerekir.",
        },
        {
          question: "Hangi emniyet katsayısı yeterli?",
          answer:
            "Statik yüklerde genellikle 1.5–2 arası, dinamik yüklerde daha yüksek değerler tercih edilir.",
        },
      ],
    },
  },
  "torque-power": {
    tr: {
      intro: [
        "Güç, tork ve devir arasındaki temel ilişkiyi kullanarak hızlı motor/aktarımı kontrolü sağlar.",
        "Mekanik verim girildiğinde gerçek torku ve hp dönüşümünü aynı tabloda gösterir.",
      ],
      inputs: [
        {
          name: "Güç (P)",
          unit: "kW",
          range: "0.1–500",
          impact: "Güç arttıkça tork artar (rpm sabitse).",
        },
        {
          name: "Devir (n)",
          unit: "rpm",
          range: "100–6000",
          impact: "Devir arttıkça tork düşer (güç sabitse).",
        },
        {
          name: "Mekanik verim (η)",
          unit: "%",
          range: "80–99",
          impact: "Gerçek torku düşürür; kayıpları temsil eder.",
        },
      ],
      formula: {
        summary: "kW ve rpm üzerinden tork hesaplanır, verim ile düzeltilir.",
        expressions: [
          "T = 9550 · P / n",
          "T_eff = T · η",
          "hp = kW · 1.34102",
        ],
      },
      assumptions: [
        "Sürekli rejim ve sabit rpm varsayılır.",
        "Verim sabit kabul edilir; yük değişimlerinde farklı olabilir.",
      ],
      example: {
        inputs: {
          "Güç": "7.5 kW",
          "Devir": "1500 rpm",
          "Verim": "%92",
        },
        outputs: {
          "Tork (ideal)": "≈ 47.8 Nm",
          "Tork (verim)": "≈ 43.9 Nm",
          "Güç (hp)": "≈ 10.1 hp",
        },
        interpretation: "Verim kaybı torku düşürür; motor seçimi yapılırken bu düşüş dikkate alınmalıdır.",
      },
      faqs: [
        {
          question: "9550 sabiti nereden geliyor?",
          answer:
            "P(kW) = T(Nm)·n(rpm)/9550 dönüşümünden gelir; birim dönüşümü sabitidir.",
        },
        {
          question: "Elektrik motoru gücü ile şaft gücü aynı mı?",
          answer:
            "Hayır. Şaft gücü verim nedeniyle daha düşüktür; bu yüzden η ile düzeltme yapılır.",
        },
        {
          question: "Düşük devirde tork neden artıyor?",
          answer:
            "Aynı güçte devir düşerse tork artar; bu ilişki temel mekanik enerji dönüşümünden gelir.",
        },
      ],
      references: [
        { title: "DIN 70020 (Motor gücü tanımları)" },
        { title: "ISO 3046 (Motor performans tanımları)" },
      ],
    },
  },
} satisfies Record<string, ToolMethodNotesByLocale>;

export const getToolMethodNotes = (toolId: string, locale: Locale): ToolMethodNotes | null =>
  toolMethodNotes[toolId]?.[locale] ?? null;

export const buildFaqJsonLd = (notes: ToolMethodNotes, locale: Locale) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: locale === "tr" ? "tr-TR" : "en-US",
  mainEntity: notes.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});
