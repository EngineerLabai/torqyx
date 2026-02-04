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
    title: "M12 10.9 civata torku ve yaglama",
    author: "Ayse Yilmaz",
    category: "Tork / Baglanti",
    details:
      "Tablo degerleriyle gercek sikma arasinda fark var. Moment anahtari kalibrasyonu ve yaglama secimi torku nasil etkiler? Kuru/yagli degerleri nasil ayiriyorsunuz?",
    excerpt: "Tablo ve gercek tork farki; moment anahtari kalibrasyonu ve yaglama secimi torku nasil degistiriyor?",
    updated: "2 saat once",
    tags: ["tork", "civata", "yaglama"],
    views: 240,
    replies: [
      {
        user: "Kadir",
        text: "DIN tablosu yagsiz deger verir, yagli kullaniyorsan %20-25 dus. Moment anahtarini yilda bir kalibre ettir.",
        time: "1 dk once",
      },
      {
        user: "Elif",
        text: "M12 10.9 icin tipik ~90 Nm (kuru). Yagliysa 65-70 Nm araligi yeterli. Yuzeyleri temiz tut; oturma yuzeyi yagliysa sonuc sapar.",
        time: "12 dk once",
      },
      {
        user: "Selim",
        text: "Kaymali rondela kullaniyorsan surtunme duser; torku biraz azalt. Turn-of-nut yontemiyle on yuku dogrulamak ise yariyor.",
        time: "25 dk once",
      },
    ],
  },
  {
    slug: "kaynak-sonrasi-sehim",
    title: "S235 plakada kaynak sonrasi sehim",
    author: "Mehmet A.",
    category: "Kaynak / Yapi",
    details:
      "300x500x10 mm plakayi kose kaynak ile birlestirdikten sonra sehim olustu; fiksturlama ve on isitma onerisi olan var mi? Faro kol veya 3D tarama ile olcum plani nasil hazirlanmali?",
    excerpt: "Kose kaynak sonrasi S235 plakada sehim: fiksturlama, on isitma ve olcum plani onerileri ariyorum.",
    updated: "5 saat once",
    tags: ["kaynak", "sehim", "fikstur"],
    views: 180,
    replies: [
      {
        user: "Hakan",
        text: "Simetrik puntolar + karsilikli kaynat, sonra doldur. On isi 120-150 C celikte ise yariyor, ozellikle kalin plakada.",
        time: "10 dk once",
      },
      {
        user: "Derya",
        text: "Ters kamber verip kaynatmayi dene. Siki fikstur ile baski uygula, sonra olcumde sapmalari kaydet.",
        time: "35 dk once",
      },
    ],
  },
  {
    slug: "h8d9-yuzey-puruzluluk",
    title: "H8/d9 gecme icin yuzey puruzlulugu",
    author: "Selin K.",
    category: "Tolerans / GD&T",
    details:
      "O25 delik ve mil icin H8/d9 sectim. Preslemede gevseme olmamasi icin yuzey puruzlulugu ne olmali? Ra araligi oneriniz?",
    excerpt: "H8/d9 gecme icin pres sikiligini koruyacak yuzey puruzlulugu (Ra) araligi nedir?",
    updated: "1 gun once",
    tags: ["tolerans", "gecme", "yuzey"],
    views: 120,
    replies: [
      {
        user: "Elif",
        text: "Ra 1.6-3.2 um araligi genelde yeterli. Temiz yuzey ve capaksizlik kritik.",
        time: "2 dk once",
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
