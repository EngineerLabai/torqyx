import type { Locale } from "@/utils/locale";

export type Answer = {
  user: string;
  text: string;
  time: string;
};

export type Thread = {
  slug: string;
  title: string;
  author: string;
  category: string;
  details: string;
  excerpt: string;
  updated: string;
  tags: string[];
  replies: Answer[];
  views: number;
};

const threadsTr: Thread[] = [
  {
    slug: "m12-civata-torku",
    title: "M12 10.9 civata torku ve yağlama",
    author: "Ayşe Yılmaz",
    category: "Tork / Bağlantı",
    details:
      "Tablo değerleriyle gerçek sıkma arasında fark var. Moment anahtarı kalibrasyonu ve yağlama seçimi torku nasıl etkiler? Kuru/yağlı değerleri nasıl ayırıyorsunuz?",
    excerpt: "Tablo ve gerçek tork farkı; moment anahtarı kalibrasyonu ve yağlama seçimi torku nasıl değiştiriyor?",
    updated: "2 saat önce",
    tags: ["tork", "civata", "yağlama"],
    views: 240,
    replies: [
      {
        user: "Kadir",
        text: "DIN tablosu yağsız değer verir, yağlı kullanıyorsan %20-25 düş. Moment anahtarını yılda bir kalibre ettir.",
        time: "1 dk önce",
      },
      {
        user: "Elif",
        text: "M12 10.9 için tipik ~90 Nm (kuru). Yağlıysa 65-70 Nm aralığı yeterli. Yüzeyleri temiz tut; oturma yüzeyi yağlıysa sonuç sapar.",
        time: "12 dk önce",
      },
      {
        user: "Selim",
        text: "Kaymalı rondela kullanıyorsan sürtünme düşer; torku biraz azalt. Turn-of-nut yöntemiyle ön yükü doğrulamak işe yarıyor.",
        time: "25 dk önce",
      },
    ],
  },
  {
    slug: "kaynak-sonrasi-sehim",
    title: "S235 plakada kaynak sonrası sehim",
    author: "Mehmet A.",
    category: "Kaynak / Yapı",
    details:
      "300x500x10 mm plakayı köşe kaynak ile birleştirdikten sonra sehim oluştu; fikstürleme ve ön ısıtma önerisi olan var mı? Faro kol veya 3D tarama ile ölçüm planı nasıl hazırlanmalı?",
    excerpt: "Köşe kaynak sonrası S235 plakada sehim: fikstürleme, ön ısıtma ve ölçüm planı önerileri arıyorum.",
    updated: "5 saat önce",
    tags: ["kaynak", "sehim", "fikstür"],
    views: 180,
    replies: [
      {
        user: "Hakan",
        text: "Simetrik puntolar + karşılıklı kaynat, sonra doldur. Ön ısı 120-150 C çelikte işe yarıyor, özellikle kalın plakada.",
        time: "10 dk önce",
      },
      {
        user: "Derya",
        text: "Ters kamber verip kaynatmayı dene. Sıkı fikstür ile baskı uygula, sonra ölçümde sapmaları kaydet.",
        time: "35 dk önce",
      },
    ],
  },
  {
    slug: "h8d9-yuzey-puruzluluk",
    title: "H8/d9 geçme için yüzey pürüzlülüğü",
    author: "Selin K.",
    category: "Tolerans / GD&T",
    details:
      "Ø25 delik ve mil için H8/d9 seçtim. Preslemede gevşeme olmaması için yüzey pürüzlülüğü ne olmalı? Ra aralığı öneriniz?",
    excerpt: "H8/d9 geçme için pres sıkılığını koruyacak yüzey pürüzlülüğü (Ra) aralığı nedir?",
    updated: "1 gün önce",
    tags: ["tolerans", "geçme", "yüzey"],
    views: 120,
    replies: [
      {
        user: "Elif",
        text: "Ra 1.6-3.2 µm aralığı genelde yeterli. Temiz yüzey ve çapaksızlık kritik.",
        time: "2 dk önce",
      },
    ],
  },
];

const threadsEn: Thread[] = [
  {
    slug: "m12-bolt-torque",
    title: "M12 10.9 bolt torque and lubrication",
    author: "Ayla Y.",
    category: "Torque / Fasteners",
    details:
      "There is a gap between table values and actual tightening. How do calibration and lubrication affect torque? How do you separate dry vs lubricated values?",
    excerpt: "Torque tables vs real tightening: calibration and lubrication impact on torque values.",
    updated: "2 hours ago",
    tags: ["torque", "bolt", "lubrication"],
    views: 240,
    replies: [
      {
        user: "Kadir",
        text: "DIN tables are dry values; if lubricated, drop by 20-25%. Calibrate the torque wrench yearly.",
        time: "1 min ago",
      },
      {
        user: "Elif",
        text: "For M12 10.9, ~90 Nm dry is typical. Lubed values around 65-70 Nm are enough. Keep surfaces clean.",
        time: "12 min ago",
      },
      {
        user: "Selim",
        text: "With sliding washers friction drops, so reduce torque. The turn-of-nut method is a good preload check.",
        time: "25 min ago",
      },
    ],
  },
  {
    slug: "weld-distortion-s235",
    title: "Distortion after welding S235 plate",
    author: "Mehmet A.",
    category: "Welding / Structure",
    details:
      "After welding a 300x500x10 mm plate we saw distortion. Any tips on fixturing or preheat? How would you plan measurement with a Faro arm or 3D scan?",
    excerpt: "S235 plate distortion after corner welds: looking for fixturing and preheat advice.",
    updated: "5 hours ago",
    tags: ["welding", "distortion", "fixture"],
    views: 180,
    replies: [
      {
        user: "Hakan",
        text: "Tack symmetrically and weld opposite sides, then fill. Preheat 120-150 C helps for thicker plates.",
        time: "10 min ago",
      },
      {
        user: "Derya",
        text: "Try reverse camber. Apply pressure with a rigid fixture and log deviations after measurement.",
        time: "35 min ago",
      },
    ],
  },
  {
    slug: "h8d9-surface-roughness",
    title: "Surface roughness for H8/d9 fit",
    author: "Selin K.",
    category: "Tolerances / GD&T",
    details:
      "For an O25 hole and shaft I picked H8/d9. What surface roughness keeps the press fit stable? Any suggested Ra range?",
    excerpt: "Surface roughness (Ra) guidance for keeping an H8/d9 press fit tight.",
    updated: "1 day ago",
    tags: ["tolerance", "fit", "surface"],
    views: 120,
    replies: [
      {
        user: "Elif",
        text: "Ra 1.6-3.2 um is usually enough. Clean surfaces and no burrs are critical.",
        time: "2 min ago",
      },
    ],
  },
];

export const getThreads = (locale: Locale): Thread[] => (locale === "en" ? threadsEn : threadsTr);
