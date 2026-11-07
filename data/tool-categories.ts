import type { Locale } from "@/utils/locale";

export type CategorySlug =
  | "power-drives"
  | "fasteners-strength"
  | "fluids-heat"
  | "manufacturing-tolerance"
  | "utilities";

export type CategoryDefinition = {
  slug: CategorySlug;
  title: Record<Locale, string>;
  shortDescription: Record<Locale, string>;
  seoTitle: Record<Locale, string>;
  seoDescription: Record<Locale, string>;
  toolIds: string[];
  introHtml: Record<Locale, {
    eyebrow: string;
    heading: string;
    lead: string;
    sections: Array<{
      title: string;
      content: string[];
    }>;
  }>;
};

export const TOOL_CATEGORIES: CategoryDefinition[] = [
  {
    slug: "power-drives",
    title: {
      tr: "Güç ve Aktarma",
      en: "Power & Drives",
    },
    shortDescription: {
      tr: "Motor gücü, tork, kayış kasnak, rulman ömrü ve kapsamlı dişli tasarımı hesaplayıcıları.",
      en: "Motor power, torque, belt pulleys, bearing life, and complete gear design calculators.",
    },
    seoTitle: {
      tr: "Güç ve Aktarma Hesaplayıcıları | TORQYX",
      en: "Power & Drives Calculators | TORQYX",
    },
    seoDescription: {
      tr: "Mekanik güç, tork, kayış boyu, ISO 281 rulman ömrü, mil burulması ve DIN/AGMA dişli tasarımı için doğrulanmış mühendislik hesaplayıcıları.",
      en: "Verified mechanical calculation tools for power, torque, belt length, ISO 281 bearing life, shaft torsion, and DIN/AGMA gear design.",
    },
    toolIds: [
      "torque-power",
      "belt-length",
      "bearing-life",
      "shaft-torsion",
      "gear-design",
      "gear-calculators",
      "gear-ratio",
      "gear-module",
      "gear-backlash",
      "gear-contact-ratio",
      "gear-force-torque",
      "gear-helix-axial",
      "gear-viscosity",
      "gear-weight",
      "gear-simulations",
    ],
    introHtml: {
      tr: {
        eyebrow: "Güç İletimi ve Mekanik Tahrik Sistemleri",
        heading: "Mekanik Güç, Aktarma ve Dişli Mekanizmaları Tasarım Rehberi",
        lead: "Endüstriyel mekanik tasarımda güç ve hareket iletimi, elektrik motorlarından tahrik millerine, redüktör dişli çiftlerinden kayış-kasnak mekanizmalarına kadar enerji akışının kesintisiz ve güvenli şekilde aktarılmasını hedefler. Bu sayfadaki hesaplayıcılar; tork-güç-devir bağıntıları, ISO 281 rulman yorulma ömrü, mil burulma mukavemeti ve DIN 3990 / AGMA normlarına uygun dişli optimizasyonu alanlarında doğrulanmış formüller sunar.",
        sections: [
          {
            title: "Dönel Güç ve Tork Dinamiği",
            content: [
              "Mekanik aktarma organlarının boyutlandırılmasında ilk adım, iletilecek gücün (kW veya HP) dönel devir sayısı (rpm) ile olan ilişkisini tork cinsinden belirlemektir. Tork (T) ve açısal hız (ω) arasındaki temel fizik bağıntısı T = P / ω formülüyle ifade edilir. Metrik birimlerde pratik hesaplama için T = (9550 · P) / n formülü kullanılır. Motor seçimi ve redüktör tahvil oranı belirlenirken anma torkunun yanı sıra kalkış anındaki dinamik yük katsayıları (KA) ve servis faktörleri hesaba katılmalıdır.",
              "Dönel millerde tork aktarımı, milde kayma gerilmesi (torsional shear stress) ve burulma açısı meydana getirir. Dairesel kesitli dolu veya içi boş millerde burulma gerilmesi τ = (T · r) / Jp formülüyle hesaplanır. İzin verilen maksimum kayma gerilmesi, malzeme akma sınırının Tresca veya von Mises kriterine göre belirli bir emniyet katsayısına bölünmesiyle elde edilir. Millerde ayrıca açısal burulmanın (twist angle) metre başına 0.25° ila 0.5° sınırını aşmaması, hassas dişli kavramasının korunması açısından kritiktir.",
            ],
          },
          {
            title: "Rulman Yorulma Ömrü ve Yataklama Standartları",
            content: [
              "Dönel milleri yataklayan bilyalı ve makaralı rulmanlar, periyodik değişken temas gerilmeleri nedeniyle yorulma hasarına maruz kalır. ISO 281 standardı, rulmanların dinamik yük sayısı (C) ve eşdeğer dinamik radyal/eksenel yükü (P) temelinde L10 temel anma ömrünü tanımlar. L10 ömrü, bir grup özdeş rulmanın %90'ının malzeme yorulması belirtisi göstermeksizin tamamlayacağı milyon devir sayısını ifade eder.",
              "Bilyalı rulmanlar için ömür üssü p = 3, makaralı rulmanlar için ise p = 10/3 (3.33) olarak alınır. Çalışma devri n bilindiğinde saat cinsinden anma ömrü L10h = (10^6 / 60n) · (C / P)^p formülüyle hesaplanır. Endüstriyel redüktörlerde 20.000 ila 40.000 saat, sürekli çalışan ağır sanayi tesislerinde ise 50.000 saat üzeri L10h hedeflenir. Yağlama filmi kalınlığı, ortam sıcaklığı ve kirlilik faktörleri de aISO düzeltme katsayılarıyla modern ISO 281 analizine dahil edilir.",
            ],
          },
          {
            title: "Kayış-Kasnak Mekanizmaları ve Sarma Geometrisi",
            content: [
              "Miller arası eksen mesafesinin büyük olduğu durumlarda esnek aktarma organı olarak V-kayışları veya senkron (triger) kayışlar tercih edilir. Açık kayış düzenlerinde kayış hatvesi uzunluğu, iki kasnağın hatve çapları (d1, d2) ve merkezler arası mesafe (a) kullanılarak Pisagor geometrisi üzerinden hesaplanır.",
              "Küçük kasnak üzerindeki sarma açısının (wrap angle, α1) 120 derecenin altına düşmemesi, sürtünme yüzeyinin korunması ve kayışın kayma yapmadan (slip) güç aktarabilmesi için temel tasarım kriteridir. Euler-Eytelwein sürtünme katsayısı bağıntısı uyarınca sarma açısı küçüldükçe aktarılabilecek maksimum teğetsel kuvvet hızla düşer. Bu hesaplayıcılarımızla hem hatve uzunluğunu hem de sarma açısını anlık olarak doğrulayabilirsiniz.",
            ],
          },
          {
            title: "Dişli Geometrisi, Mukavemet ve Yağlama Kriterleri",
            content: [
              "Dişli çark mekanizmaları; silindirik düz dişliler, helis dişliler, konik dişliler ve sonsuz vida mekanizmaları olmak üzere yüksek verimli pozitif iletim elemanlarıdır. Dişli tasarımının omurgasını oluşturan modül (m), hatve dairesi çapının (d) diş sayısına (z) bölünmesiyle belirlenir (d = m · z). Düz ve helis dişlilerde temas oranı (contact ratio, ε), dişlerin süreklilik içinde birbirine yük aktarmasını sağlar ve gürültü ile dinamik yükleri minimize etmek için ε ≥ 1.2 olması şarttır.",
              "Helis dişlilerde helis açısı (β) nedeniyle radyal ve teğetsel kuvvetlerin yanı sıra eksenel kuvvet (Fa = Ft · tan β) oluşur. Bu eksenel kuvvet yataklama rulmanları üzerinde ek yük yaratır. Diş dibi kırılmasına karşı Lewis ve DIN 3990 eğilme mukavemeti, diş yüzeyi çukurlaşmasına (pitting) karşı ise Hertz basma gerilmesi kriterleri uygulanır. Dişli kutusu çalışma sıcaklığı ve çevre hızı dikkate alınarak doğru ISO VG viskozite sınıfı madeni veya sentetik yağ seçimi yapılmalıdır.",
            ],
          },
        ],
      },
      en: {
        eyebrow: "Power Transmission and Mechanical Drive Systems",
        heading: "Engineering Guide to Mechanical Power, Drivetrains, and Gear Design",
        lead: "In industrial mechanical engineering, power transmission covers the unbroken transfer of rotational kinetic energy from prime movers to work machines. This suite of engineering calculators provides certified computational methods for speed-torque-power equations, ISO 281 rolling element bearing fatigue lives, shaft torsional stress verification, and complete DIN 3990 / AGMA compliant involute gear geometry and contact evaluations.",
        sections: [
          {
            title: "Rotational Dynamics, Torque, and Mechanical Power",
            content: [
              "The first step in sizing any mechanical drive system is establishing the rigorous mathematical relationship between rotational speed (rpm), transmitted power (kW or hp), and shaft torque. Fundamentally, mechanical power is the product of torque (T) and angular velocity (ω): P = T · ω. In SI metric engineering units, this translates to the familiar equation T = (9550 · P) / n, where P is in kilowatts and n is in revolutions per minute.",
              "Transmitting torque generates internal torsional shear stresses across the shaft cross section. For solid and hollow cylindrical shafts, shear stress is governed by the torsion formula τ = (T · r) / Jp, where Jp is the polar moment of inertia. Permissible torsional stress must respect yield limits under von Mises or Tresca failure criteria, incorporating dynamic application factors (KA). Additionally, limiting torsional twist to 0.25°–0.5° per meter of length is critical to avoid tooth misalignment in precision gearboxes.",
            ],
          },
          {
            title: "Rolling Element Bearing Fatigue Life (ISO 281)",
            content: [
              "Shaft support bearings experience cyclic Hertzian contact stresses across their raceways, making subsurface fatigue the primary failure mechanism. ISO 281 standardizes the L10 basic rating life methodology based on basic dynamic load rating (C) and equivalent dynamic radial and axial load (P). L10 represents the operating time or number of revolutions that 90% of a sufficiently large group of identical bearings can complete before initial flaking occurs.",
              "The life exponent p is 3 for ball bearings and 10/3 (3.33) for roller bearings. Given shaft speed n in rpm, the life in operational hours is L10h = (10^6 / 60n) · (C / P)^p. Typical industrial gearboxes demand 20,000 to 40,000 hours, whereas continuous heavy process equipment requires over 50,000 hours. The calculators incorporate modern life modification factors (aISO) accounting for lubrication film thickness, contamination, and operating temperature.",
            ],
          },
          {
            title: "Belt Drives, Wrap Angle, and Geometry Optimization",
            content: [
              "When shafts are positioned with significant center-to-center distances, flexible belt drives (classical V-belts, narrow wedge belts, or synchronous timing belts) offer cost-effective, shock-absorbing power transmission. Sizing open belt drives requires exact computation of belt pitch length using the pitch diameters of the driving and driven pulleys along with nominal center distance.",
              "Maintaining an adequate arc of contact (wrap angle α1) on the smaller pulley—ideally exceeding 120 degrees—is vital. According to the belt friction equation (Euler-Eytelwein formula), reduced wrap angles significantly degrade the traction limit, leading to belt slip, overheating, and premature cord failure. Our calculators ensure accurate verification of both pitch length and wrap angle parameters.",
            ],
          },
          {
            title: "Involute Gear Geometry, Durability, and Lubrication",
            content: [
              "Gear drives provide positive, slip-free power transmission with high efficiency. The metric module (m) serves as the dimensional standard for gear tooth sizing, where pitch diameter d = m · z. For smooth and quiet meshing, the total contact ratio (ε) must satisfy ε ≥ 1.2 to guarantee that succeeding tooth pairs engage before preceding pairs disengage.",
              "In helical gears, the helix angle (β) introduces an axial thrust component Fa = Ft · tan β that must be accommodated by the shaft bearings. Structural gear design requires checking both tooth root bending fatigue (Lewis formula / ISO 6336 Method B) and contact stress pitting (Hertzian contact pressure). Matching pitch-line velocity with proper ISO VG lubricant viscosity prevents adhesive wear (scuffing) and ensures optimal elastohydrodynamic film formation.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "fasteners-strength",
    title: {
      tr: "Bağlantı Elemanları ve Mukavemet",
      en: "Fasteners & Strength",
    },
    shortDescription: {
      tr: "Cıvata ön yükü, tork hesabı, köşe kaynak ve kiriş eğilme gerilmesi hesaplayıcıları.",
      en: "Bolt preloads, tightening torque, fillet weld sizing, and beam deflection calculators.",
    },
    seoTitle: {
      tr: "Bağlantı Elemanları ve Mukavemet Hesaplayıcıları | TORQYX",
      en: "Fasteners & Strength Calculators | TORQYX",
    },
    seoDescription: {
      tr: "ISO 898-1 cıvata ön yükü ve tork hesabı, VDI 2230 bağlantı güvenliği, Eurocode 3 köşe kaynak boyutlandırma ve Euler-Bernoulli kiriş sehim analizleri.",
      en: "ISO 898-1 bolt sizing, tightening torque, VDI 2230 joint safety, Eurocode 3 fillet weld sizing, and Euler-Bernoulli beam deflection calculations.",
    },
    toolIds: [
      "bolt-calculator",
      "bolt-database",
      "bolt-size-torque",
      "simple-stress",
      "bending-stress",
      "fillet-weld",
      "strength-statics",
    ],
    introHtml: {
      tr: {
        eyebrow: "Bağlantı Elemanları, Kaynak ve Mukavemet Analizi",
        heading: "Cıvatalı Bağlantılar, Kaynaklı Konstrüksiyon ve Yapısal Mukavemet Rehberi",
        lead: "Mekanik yapıların güvenilirliği, münferit elemanların mukavemetine olduğu kadar onları birleştiren cıvata ve kaynak bağlantılarının doğru boyutlandırılmasına bağlıdır. Bu kategoride; ISO 898-1 cıvata malzeme sınıflarına göre gerilme alanı ve montaj ön yükü hesabı, VDI 2230 ilkelerine dayalı sıkma torku, Eurocode 3 uyumlu köşe kaynak dayanımı ve Euler-Bernoulli kiriş eğilme-sehim analizleri yer almaktadır.",
        sections: [
          {
            title: "Cıvata Boyutlandırma, Ön Yük ve Tork Bağıntıları (ISO 898-1 & VDI 2230)",
            content: [
              "Metrik cıvatalı bağlantılarda yük taşıma kapasitesi, diş açılmış bölümün çekme gerilme alanına (tensile stress area, As) dayanır. ISO 965 uyarınca nominal çap (d) ve diş adımı (P) kullanılarak gerilme alanı As = (π / 4) · [d - 0.9382 · P]^2 formülüyle hesaplanır. Cıvata kaliteleri (örneğin 8.8, 10.9, 12.9), ilk rakamın 100 ile çarpılmasıyla nominal çekme dayanımını (Rm, MPa), iki rakamın çarpımının 10 ile çarpılmasıyla da akma sınırını (Rp0.2, MPa) verir.",
              "VDI 2230 normuna göre kritik cıvatalı bağlantılar, işletme yükleri altında açılmayı (gap separation) ve yorulma kırılmasını önlemek amacıyla akma sınırının %70 ila %90'ı mertebesinde kontrollü bir montaj ön yüküyle (FM) sıkılmalıdır. Gerekli sıkma torku MA = FM · [(0.16 · P) + (0.58 · d2 · μth) + (0.5 · dw · μb)] formülüyle hesaplanır. Diş sürtünme katsayısı (μth) ve cıvata başı altı sürtünme katsayısı (μb), uygulanan torkun ön yüke dönüşme verimini doğrudan belirler.",
            ],
          },
          {
            title: "Kaynaklı Bağlantıların Boyutlandırılması ve Eurocode 3 İlkeleri",
            content: [
              "Çelik konstrüksiyon ve makine şaselerinde köşe kaynak dikişleri (fillet welds), birleşim noktalarındaki kesme ve çekme kuvvetlerini aktarır. Kaynak dikişinin mukavemeti, kaynak boğaz kalınlığı (throat thickness, a) ve dikiş uzunluğu (L) üzerinden hesaplanan etkili kesit alanına dayanır. Eurocode 3 (EN 1993-1-8) uyarınca kaynak gerilmeleri dikiş eksenine dik normal gerilme (σ⊥), dik kayma gerilmesi (τ⊥) ve paralel kayma gerilmesi (τ∥) olarak ayrıştırılır.",
              "Birleşik gerilme kontrolü [σ⊥^2 + 3 · (τ⊥^2 + τ∥^2)]^0.5 ≤ fu / (βw · γM2) formülüyle yapılır. Burada fu ana malzemenin çekme dayanımı, βw malzeme korelasyon katsayısı (S235 için 0.8, S355 için 0.9) ve γM2 kaynak kısmi emniyet katsayısıdır (1.25). Doğru kaynak boğazı seçimi, aşırı kaynak dolgusundan kaynaklanan distorsiyonu ve gereksiz maliyeti önler.",
            ],
          },
          {
            title: "Kiriş Eğilmesi, Kesme Kuvveti ve Sehim Analizi (Euler-Bernoulli)",
            content: [
              "Mekanik kirişler ve makine şaseleri eğilme momentleri altında elastik deformasyona uğrar. Euler-Bernoulli kiriş teorisi uyarınca, enine düzlem kesitlerin deformasyondan sonra da düzlem kaldığı kabul edilir. Maksimum eğilme gerilmesi σ = (M · y) / I formülüyle, kesit modülü W = I / y kullanılarak σ = M / W şeklinde basitleştirilir.",
              "Mukavemet kontrolünün yanı sıra fonksiyonel sehim (deflection, f) sınırları makine elemanlarının düzgün çalışması için zorunludur. Örneğin basit mesnetli tekil yüklü bir kirişte maksimum sehim f = (F · L^3) / (48 · E · I) formülüyle bulunur. Kiriş sehiminin açıklığın 1/500 ila 1/1000'i ile sınırlandırılması, şaft yataklarının kasılmasını ve mekanik sıkışmaları engeller.",
            ],
          },
          {
            title: "Birleşik Statik Gerilme Durumları ve Emniyet Faktörleri",
            content: [
              "Gerçek mühendislik parçaları nadiren saf çekme veya saf burulmaya maruz kalır; çoğunlukla eksenel yük, eğilme ve burulmanın birleşimi olan çok eksenli gerilme halleri mevcuttur. Sünek metallerde (çelikler, alüminyum alaşımları) eşdeğer gerilme von Mises kriteriyle σv = [σ^2 + 3 · τ^2]^0.5 formülüyle hesaplanır.",
              "Hesaplanan eşdeğer gerilme malzemenin akma dayanımına bölünerek tasarım emniyet katsayısı (Safety Factor, S = Sy / σv) tespit edilir. Statik yüklerde minimum emniyet katsayısı 1.5–2.0 arasında seçilirken, darbe veya dinamik titreşim bulunan sistemlerde bu değer 3.0 veya üzerine çıkarılmalıdır.",
            ],
          },
        ],
      },
      en: {
        eyebrow: "Structural Fasteners, Welded Joints, and Strength Analysis",
        heading: "Engineering Guide to Bolted Joints, Welds, and Structural Strength",
        lead: "The structural integrity of mechanical equipment relies heavily on the engineering design of its primary joints and structural members. This section features verified calculation tools for ISO 898-1 tensile stress area and bolt preload, VDI 2230 systematic torque requirements, Eurocode 3 fillet weld sizing, and Euler-Bernoulli beam deflection and bending stress evaluations.",
        sections: [
          {
            title: "Bolt Sizing, Preload, and Tightening Torque (ISO 898-1 & VDI 2230)",
            content: [
              "In metric threaded fastener design, load capacity is governed by the thread tensile stress area (As). Defined under ISO 965 from nominal diameter (d) and thread pitch (P), As = (π / 4) · [d - 0.9382 · P]^2. Metric property classes (e.g., 8.8, 10.9, 12.9) specify nominal ultimate tensile strength (Rm) and yield strength (Rp0.2).",
              "Per VDI 2230 guidelines, high-integrity bolted joints must be preloaded to 70%–90% of bolt proof strength to prevent joint separation, fatigue cycling, and self-loosening under service loads. Required tightening torque MA is computed considering thread lead, thread friction coefficient (μth), and under-head friction coefficient (μb). Friction coefficient scatter is the predominant cause of clamp load variation.",
            ],
          },
          {
            title: "Fillet Weld Sizing and Eurocode 3 Design Criteria",
            content: [
              "Fabricated machinery bases and structural joints transfer loads primarily through fillet weld throat sections. The effective throat thickness (a) and weld length (L) determine the throat area. Under Eurocode 3 (EN 1993-1-8), directional stress components are resolved into normal stress perpendicular to throat (σ⊥), shear stress perpendicular to axis (τ⊥), and shear stress parallel to axis (τ∥).",
              "The design condition requires [σ⊥^2 + 3 · (τ⊥^2 + τ∥^2)]^0.5 ≤ fu / (βw · γM2), where fu is parent metal tensile strength, βw is the correlation factor (0.8 for S235, 0.9 for S355), and γM2 is the partial safety factor (1.25). Accurate throat sizing prevents over-welding, which introduces excessive thermal distortion and residual stress.",
            ],
          },
          {
            title: "Euler-Bernoulli Beam Bending, Shear, and Deflection Limits",
            content: [
              "Beams and structural members experience bending moments (M) that generate normal stresses across cross sections. In linear elastic Euler-Bernoulli theory, maximum bending stress is given by σ = M · y / I = M / W, where I is area moment of inertia and W is section modulus.",
              "Deflection criteria frequently govern beam sizing rather than pure strength limits. For a simply supported beam with a central point load, maximum deflection is f = (F · L^3) / (48 · E · I). In precision machinery, deflection must commonly remain under L/500 to L/1000 to prevent bearing misalignment and gear tooth binding.",
            ],
          },
          {
            title: "Combined Stress States and Factor of Safety Verification",
            content: [
              "Machine components typically endure multiaxial stress states combining axial force, bending, and torsional shear. For ductile metals, the von Mises equivalent stress σv = [σ^2 + 3 · τ^2]^0.5 combines these orthogonal stress vectors into a scalar value directly comparable to uniaxial tensile test yields.",
              "The design safety factor S = Sy / σv ensures adequate margin against yielding. While static industrial structures operate with safety factors between 1.5 and 2.0, systems subjected to cyclic fatigue or dynamic impact demand safety factors of 3.0 or higher.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "fluids-heat",
    title: {
      tr: "Akışkanlar ve Isı",
      en: "Fluids & Heat",
    },
    shortDescription: {
      tr: "Boru basınç kaybı, hidrolik silindir, kompresör debisi ve ısı iletimi hesaplayıcıları.",
      en: "Pipe pressure loss, hydraulic cylinder, compressor displacement, and heat flow calculators.",
    },
    seoTitle: {
      tr: "Akışkanlar ve Isı Transferi Hesaplayıcıları | TORQYX",
      en: "Fluids & Heat Transfer Calculators | TORQYX",
    },
    seoDescription: {
      tr: "Darcy-Weisbach boru basınç kaybı, hidrolik silindir kuvvet ve hız hesabı, kompresör deplasmanı ve 1D termal iletim mühendislik hesaplayıcıları.",
      en: "Darcy-Weisbach pipe head loss, hydraulic cylinder force and velocity, compressor displacement, and 1D thermal conduction engineering calculators.",
    },
    toolIds: [
      "pipe-pressure-loss",
      "hydraulic-cylinder",
      "compressor-cc",
      "fluids-hvac",
      "basic-engineering",
      "heat-energy",
    ],
    introHtml: {
      tr: {
        eyebrow: "Termal Akışkan Sistemleri ve Hidrolik Güç",
        heading: "Boru Hatları, Hidrolik-Pnömatik Tahrik ve Isı Transferi Rehberi",
        lead: "Akışkan transferi ve termal enerji yönetimi; boru hatlarında basınç kayıplarının asgari seviyede tutulması, hidrolik silindirlerin strok boyunca gerekli itme ve çekme kuvvetlerini sağlaması ve enerji verimliliği için kritik ısı iletim hesaplarını kapsar. Bu kategori; Darcy-Weisbach ve Colebrook-White hidrolik analizleri, hidrolik silindir debi-hız hesaplamaları, kompresör hacimsel verimleri ve 1D Fourier ısı iletim çözümleri sunar.",
        sections: [
          {
            title: "Boru İçi Akış, Reynolds Sayısı ve Sürtünme Katsayısı (Darcy-Weisbach)",
            content: [
              "Basınçlı boru hatlarında akışkan hareketi sırasında sürtünme kaynaklı basınç düşümü meydana gelir. Akış rejiminin belirlenmesi, eylemsizlik kuvvetlerinin viskozite kuvvetlerine oranı olan Reynolds sayısı (Re = ρ · v · D / μ) ile yapılır. Dairesel borularda Re < 2300 laminer akış, Re > 4000 ise türbülanslı akış rejimini ifade eder.",
              "Basınç kaybı Darcy-Weisbach denklemiyle Δp = f · (L / D) · (ρ · v^2 / 2) şeklinde hesaplanır. Laminer rejimde sürtünme katsayısı f = 64 / Re iken, türbülanslı rejimde boru iç yüzey pürüzlülüğüne (ε) ve Re'ye bağlı olarak Colebrook-White bağıntısı çözülür. Hesaplayıcımız bu denklemi sayısal yöntemlerle çözerek hem basınç kaybını hem de gereken pompa basma yüksekliğini hassasiyetle hesaplar.",
            ],
          },
          {
            title: "Hidrolik Silindir Kuvvet, Hız ve Debi Boyutlandırması",
            content: [
              "Akışkan gücü sistemlerinde doğrusal hareket üreten hidrolik silindirler, piston çapı (D) ve piston mili çapı (d) geometrisine göre boyutlandırılır. İleri strokta basınç tüm piston alanına (A1 = π · D^2 / 4) etki ederek maksimum itme kuvveti üretir: F_ileri = p · A1 · η_m (burada η_m mekanik verimdir, tipik olarak 0.90–0.95).",
              "Geri çekme strokunda ise basınç yalnızca halka alana (annulus area, A2 = π · (D^2 - d^2) / 4) etki ettiğinden geri çekme kuvveti daha düşüktür. Silindir hızı sisteme beslenen hacimsel debi (Q) ile orantılıdır (v = Q / A). Doğru pompa debisi ve boru kesitinin seçilmesi, aşırı akışkan hızından kaynaklanan türbülansı ve kavitasyon riskini ortadan kaldırır.",
            ],
          },
          {
            title: "Kompresör ve Pompaların Hacimsel Kapasite Analizi",
            content: [
              "Pozitif deplasmanlı pistonlu kompresörler ve pompalarda teorik süpürme hacmi (displacement, Vd), piston çapı, strok uzunluğu ve silindir adedinin çarpımıyla bulunur. Krank mili devri (n) ile çarpıldığında teorik emiş debisi elde edilir.",
              "Gerçek debi ise ölü hacim genleşmesi, supap gecikmeleri ve sızıntılar nedeniyle hacimsel verim (volumetric efficiency, ηv) ile ölçeklenir. Kompresör deplasman hesaplayıcımız, otomotiv ve endüstriyel pnömatik uygulamalarında motor devrine ve strok parametrelerine bağlı hava debisi gereksinimlerini belirlemenize yardımcı olur.",
            ],
          },
          {
            title: "Bir Boyutlu Isı İletimi ve Enerji Kayıpları (Fourier Kanunu)",
            content: [
              "Endüstriyel fırınlar, boru hatları ve ısı değiştiricilerinde sıcaklık gradyanı boyunca ısı transferi Fourier iletim kanunuyla gerçekleşir: q = -k · A · (dT / dx). Tek veya çok katmanlı düzlemsel ve silindirik duvarlarda toplam termal direnç (Rth = Σ [L_i / (k_i · A)]) hesaplanarak kararlı haldeki ısı akışı tespit edilir.",
              "Uygun ısı yalıtım malzemesi kalınlığının seçilmesi, işletme enerji maliyetlerini minimize ederken yüzey sıcaklığını personel güvenliği sınırlarında (< 60°C) tutmayı garanti altına alır.",
            ],
          },
        ],
      },
      en: {
        eyebrow: "Thermal Fluid Systems and Fluid Power",
        heading: "Engineering Guide to Pipe Hydraulics, Fluid Power, and Heat Transfer",
        lead: "Efficient fluid transport and thermal management demand rigorous hydraulic and thermodynamic modeling: minimizing frictional head losses in process piping, sizing hydraulic actuators for required extension and retraction forces, and evaluating conductive thermal dissipation. This section provides validated tools for Darcy-Weisbach flow, hydraulic cylinder kinematics, compressor displacement, and steady-state 1D heat conduction.",
        sections: [
          {
            title: "Pipe Hydraulics, Reynolds Number, and Darcy-Weisbach Friction",
            content: [
              "Fluid transport through conduit systems generates head loss due to boundary layer shear. Flow regime is determined by the dimensionless Reynolds number (Re = ρ · v · D / μ). For circular conduits, Re < 2300 indicates laminar flow, whereas Re > 4000 signifies fully developed turbulent flow.",
              "Frictional pressure drop is evaluated via the Darcy-Weisbach equation: Δp = f · (L / D) · (ρ · v^2 / 2). While the laminar friction factor is simply f = 64 / Re, turbulent regimes require solving the implicit Colebrook-White equation based on pipe relative roughness (ε / D) and Re. Our tool numerically resolves this relationship for exact pressure loss and pumping power predictions.",
            ],
          },
          {
            title: "Hydraulic Cylinder Sizing, Annulus Area, and Volumetric Flow",
            content: [
              "Linear fluid power actuators are parameterized by bore diameter (D) and rod diameter (d). On extension, operating pressure acts across full piston area A1 = π · D^2 / 4 to generate maximum thrust: F_ext = p · A1 · η_m (where η_m is mechanical efficiency, typically 0.90–0.95).",
              "During retraction, fluid pressure acts solely on the annular area A2 = π · (D^2 - d^2) / 4, yielding reduced force but higher speed for a constant flow rate Q (v = Q / A). Balancing line diameters and valve sizing maintains fluid velocities within recommended industry thresholds (2–4 m/s for suction, 4–6 m/s for pressure lines) to prevent cavitation and pressure spikes.",
            ],
          },
          {
            title: "Compressor and Positive Displacement Capacity Modeling",
            content: [
              "In reciprocating compressors and positive displacement pumps, theoretical swept volume (displacement, Vd) is derived from cylinder bore, stroke length, and cylinder count. Multiplying displacement by operational RPM yields ideal volumetric delivery.",
              "Actual mass and volumetric throughput are scaled by volumetric efficiency (ηv), which accounts for clearance re-expansion, valve throttling, and piston blow-by. This calculator provides fast capacity estimation for automotive and industrial pneumatic machinery.",
            ],
          },
          {
            title: "Steady-State 1D Conduction and Thermal Resistance Networks",
            content: [
              "Heat conduction across solid layers follows Fourier's law: q = -k · A · (dT / dx). In composite planar walls and insulated cylindrical conduits, total thermal resistance is modeled as an electrical circuit analog (Rth = Σ [Li / (ki · A)]).",
              "Sizing thermal insulation thickness minimizes continuous thermal losses while ensuring external touch temperatures meet occupational health and safety limits (< 60°C).",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "manufacturing-tolerance",
    title: {
      tr: "İmalat ve Tolerans",
      en: "Manufacturing & Tolerance",
    },
    shortDescription: {
      tr: "Tolerans yığını analizi, malzeme kartları, ısıl işlem ve yüzey kaplama rehberleri.",
      en: "Tolerance stackup analysis, material cards, heat treatment, and surface coating guides.",
    },
    seoTitle: {
      tr: "İmalat ve Tolerans Hesaplayıcıları | TORQYX",
      en: "Manufacturing & Tolerance Calculators | TORQYX",
    },
    seoDescription: {
      tr: "1D Worst-Case ve RSS tolerans yığını analizi, ISO 286 geçme toleransları, malzeme mekanik özellikleri, ısıl işlem adımları ve kaplama korozyon koruması.",
      en: "1D Worst-Case and RSS tolerance stackup analysis, ISO 286 limits and fits, material mechanical properties, heat treatment steps, and coating corrosion protection.",
    },
    toolIds: [
      "tolerance-lab",
      "materials-manufacturing",
      "production-project",
      "coating-guide",
      "heat-treatment",
      "material-cards",
      "sealing-guide",
    ],
    introHtml: {
      tr: {
        eyebrow: "Tolerans Zincirleri, Malzeme Mühendisliği ve İmalat",
        heading: "Tolerans Yığını Analizi, Malzeme Seçimi ve İmalat Süreçleri Rehberi",
        lead: "Hassas makine imalatında parçaların birbirine montajlanabilirliği ve işlevselliği, tolerans zincirlerinin doğru hesaplanmasına ve uygun malzeme ile yüzey işlemlerinin seçimine dayanır. Bu kategoride; 1D doğrusal tolerans yığınlarında En Kötü Durum (Worst-Case) ve İstatistiksel (RSS) analizler, ISO 286 geçme seçimleri, çelik ve alaşımların malzeme kartları, ısıl işlem sertleştirme adımları ve ISO 12944 korozif kaplama seçimleri yer almaktadır.",
        sections: [
          {
            title: "1D Doğrusal Tolerans Yığını Analizi (Worst-Case ve RSS Yöntemleri)",
            content: [
              "Montaj zincirlerinde münferit parça toleranslarının toplam montaj boşluğu üzerindeki kümülatif etkisi, tolerans yığını analiziyle (tolerance stackup) değerlendirilir. En Kötü Durum (Worst-Case / WC) yaklaşımı, tüm parçaların aynı anda üst veya alt tolerans sınırında üretildiğini varsayar (T_WC = Σ |t_i|). Bu yöntem nükleer ve havacılık gibi sıfır hata toleranslı alanlarda zorunludur ancak üretim maliyetlerini artırır.",
              "İstatistiksel Tolerans Analizi (Root-Sum-Square / RSS) ise parçaların normal dağılım (Gauss) gösterdiğini ve eşzamanlı ekstrem sınırlarda bulunma olasılığının düşük olduğunu kabul eder (T_RSS = [Σ t_i^2]^0.5). RSS yöntemi, seri imalatta gereksiz dar toleranslardan kaçınarak işleme maliyetlerini %30–%50 oranında düşürür. Tolerans Lab aracımız her iki yöntemi ve parçaların toleransa katkı hassasiyetini (sensitivity index) anlık olarak grafiklendirir.",
            ],
          },
          {
            title: "ISO 286 Sınırlar ve Geçmeler Sistemi (Limits & Fits)",
            content: [
              "Miller ve delikler arasındaki montaj ilişkisi, ISO 286 sistemine göre temel delik (H) veya temel mil (h) esasına göre sınıflandırılır. Geçmeler üç ana kategoride toplanır: Boşluklu geçmeler (örneğin H7/g6, H7/f7 - dönel veya kayar hareketler için), geçişli geçmeler (örneğin H7/k6, H7/m6 - sökülebilir hassas konumlamalar için) ve sıkı/pres geçmeler (örneğin H7/p6, H7/s6 - tork ileten kalıcı montajlar için).",
              "Pres geçmelerde montaj sırasında parçaların deforme olmaması ve gereken sürtünme torkunun iletilebilmesi için radyal gerilme ve genişleme miktarları elastisite teorisi (Lamé denklemleri) uyarınca doğrulanmalıdır.",
            ],
          },
          {
            title: "Mühendislik Malzemeleri, Mekanik Özellikler ve Eşdeğerlikler",
            content: [
              "Tasarımın başarısı doğru malzeme seçimine bağlıdır. Yapı çelikleri (S235, S355), ıslah çelikleri (4140/42CrMo4), sementasyon çelikleri (8620/16MnCr5), paslanmaz çelikler (304, 316) ve alüminyum alaşımları (6061-T6, 7075-T6) farklı akma, çekme ve tokluk değerlerine sahiptir.",
              "Malzeme Kartları aracımız; EN, AISI/ASTM ve JIS standartlarındaki kimyasal bileşim ve mekanik özellik eşdeğerliklerini sunarak uluslararası tedarik süreçlerinde doğru muadil malzemenin tespit edilmesini sağlar.",
            ],
          },
          {
            title: "Isıl İşlem Süreçleri ve Korozyona Karşı Yüzey Kaplamaları",
            content: [
              "Çelik parçaların aşınma direnci ve yorulma mukavemetini artırmak için su verme (quenching), temperleme (tempering), sementasyon (case hardening) ve nitrasyon işlemleri uygulanır. Sertlik değerleri Rockwell C (HRC), Brinell (HBW) ve Vickers (HV) cinsinden birbirine dönüştürülebilir.",
              "Atmosferik ve kimyasal korozyona karşı koruma sağlamak için ISO 12944 koroziflik sınıflarına (C1'den C5-M'ye kadar) uygun çinko galvaniz, fosfatlama, eloksal (anodizing) veya epoksi boya sistemleri seçilmelidir. Doğru kaplama seçimi, ekipmanın servis ömrünü onlarca yıl uzatır.",
            ],
          },
        ],
      },
      en: {
        eyebrow: "Tolerance Chains, Materials Engineering, and Fabrication",
        heading: "Engineering Guide to Tolerance Stackup, Materials, and Manufacturing",
        lead: "In precision mechanical fabrication, the assembleability and longevity of parts rest upon accurate tolerance stackup calculations and informed selection of alloys and surface treatments. This section hosts engineering tools for 1D Worst-Case and Statistical (RSS) tolerance stacks, ISO 286 limit fits, cross-standard material property cards, heat treatment metallurgy, and ISO 12944 protective coating specifications.",
        sections: [
          {
            title: "1D Linear Tolerance Stackup Analysis (Worst-Case vs. RSS)",
            content: [
              "Evaluating how individual component variations accumulate across an assembly gap is the essence of tolerance stackup analysis. The deterministic Worst-Case (WC) method assumes every dimension in the loop simultaneously reaches its most adverse manufacturing extreme (T_WC = Σ |t_i|). While required for mission-critical aerospace assemblies, it often forces unnecessarily stringent tolerances.",
              "Statistical Tolerance Analysis (Root-Sum-Square / RSS) recognizes that manufacturing dimensions follow normal Gaussian distributions, making simultaneous extreme deviations statistically rare (T_RSS = [Σ t_i^2]^0.5). RSS stackups permit wider machining tolerances, slashing fabrication costs by 30%–50% while preserving high assembly yields. Our Tolerance Lab visually charts both models alongside individual sensitivity contribution indices.",
            ],
          },
          {
            title: "ISO 286 Limits and Fits Standards for Shafts and Holes",
            content: [
              "Mating relationships between cylindrical shafts and holes follow the ISO 286 system, structured around the basic hole (H) or basic shaft (h) system. Fits are categorized into clearance fits (e.g., H7/g6, H7/f7 for sliding and rotational pairs), transition fits (e.g., H7/k6, H7/m6 for precision location), and interference / press fits (e.g., H7/p6, H7/s6 for permanent frictional drive joints).",
              "For interference fits, radial contact pressure and tensile hoop stresses must be checked via thick-walled cylinder theory (Lamé equations) to ensure the hub does not yield during press-fitting while maintaining adequate torque transmission capacity.",
            ],
          },
          {
            title: "Engineering Alloy Selection, Properties, and Equivalents",
            content: [
              "Matching structural demands with optimal material chemistry is fundamental. Structural steels (S235, S355), quench-and-temper alloys (4140/42CrMo4), case-hardening grades (8620/16MnCr5), austenitic stainless steels (304, 316), and aerospace aluminum alloys (6061-T6, 7075-T6) exhibit distinct strength, ductility, and fracture toughness thresholds.",
              "Our Material Cards tool cross-references EN, AISI/ASTM, and JIS global standards to guarantee verified equivalent material substitution during manufacturing procurement.",
            ],
          },
          {
            title: "Heat Treatment Metallurgy and ISO 12944 Surface Protection",
            content: [
              "Enhancing core fatigue resistance and surface wear endurance requires controlled thermal processing: austenitizing, quenching, tempering, carburizing, or nitriding. Hardness readings convert seamlessly across Rockwell C (HRC), Brinell (HBW), and Vickers (HV) scales.",
              "To resist environmental corrosion, protective systems are selected according to ISO 12944 corrosivity categories (C1 through C5-M/CX). Applying zinc galvanizing, hard anodizing, nitriding, or multi-coat epoxy systems ensures decades of reliable operational life.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "utilities",
    title: {
      tr: "Genel Araçlar",
      en: "Utilities",
    },
    shortDescription: {
      tr: "Birim dönüştürücü, mantık doğrulama laboratuvarı, yay kuvveti ve hızlı referanslar.",
      en: "Unit converter, sanity check verification lab, spring force, and quick references.",
    },
    seoTitle: {
      tr: "Genel Mühendislik Araçları ve Yardımcılar | TORQYX",
      en: "General Engineering Utilities & Tools | TORQYX",
    },
    seoDescription: {
      tr: "SI ve Imperial birim dönüştürücü, Monte Carlo mühendislik kontrol laboratuvarı, EN 13906 yay kuvvet grafiği ve hızlı atölye referans merkezi.",
      en: "SI and Imperial unit conversions, Monte Carlo engineering sanity check lab, EN 13906 spring force curves, and workshop quick reference center.",
    },
    toolIds: [
      "unit-converter",
      "sanity-check",
      "param-chart",
      "reference",
    ],
    introHtml: {
      tr: {
        eyebrow: "Genel Mühendislik, Birimler ve Doğrulama",
        heading: "Birim Dönüşümleri, Mantık Doğrulama ve Mühendislik Referansları Rehberi",
        lead: "Mühendislik hesaplarında hata payını en aza indirmek; tutarlı birim sistemlerinin kullanılmasına, karmaşık formüllerin sınır koşullarında doğrulanmasına ve standart tablolara hızlı erişime bağlıdır. Bu kategoride; SI metrik ve Imperial birim dönüştürücüsü, parametre duyarlılığı ve Monte Carlo belirsizlik analizi sunan Mühendislik Kontrol Laboratuvarı, EN 13906 yay kuvvet grafiği ve atölye hızlı referans merkezi yer almaktadır.",
        sections: [
          {
            title: "Birim Sistemleri ve Boyutsal Homojenlik (SI ve Imperial)",
            content: [
              "Mühendislik hesaplamalarında en sık karşılaşılan hata kaynağı, farklı birim sistemleri arasındaki dönüşüm tutarsızlıklarıdır. Uluslararası Birimler Sistemi (SI), yedi temel birim (metre, kilogram, saniye vb.) üzerine kuruludur. Basınç ve gerilmede Pascal (1 Pa = 1 N/m²; 1 MPa = 1 N/mm² = 10 bar), torkta Newton-metre (N·m) ve güçte Watt (W = J/s) kullanılır.",
              "Imperial ve US Customary sistemlerinde ise kuvvet pound-force (lbf), uzunluk inç veya fit, basınç psi (lbf/in²) ve tork lbf·ft cinsindendir. Birim Dönüştürücümüz; uzunluk, alan, hacim, kütle, kuvvet, basınç, tork, enerji, güç ve dinamik/kinematik viskozite birimlerini kayan noktalı hassasiyetle birbirine çevirerek boyutsal homojenliği garanti eder.",
            ],
          },
          {
            title: "Mühendislik Kontrol Laboratuvarı ve Monte Carlo Doğrulaması",
            content: [
              "Deterministik formüller girdi parametrelerinin nominal değerlerini kullanır; oysa gerçek dünyada malzeme özellikleri, boyutlar ve yükler tolerans bandı içinde belirsizlik taşır. Mühendislik Kontrol Laboratuvarı (Sanity Check Lab), formül sonuçlarını sadece tek bir nominal değerle değil, duyarlılık analizi (sensitivity) ve Monte Carlo olasılık simülasyonlarıyla test eder.",
              "Parametrelerin varyasyon katsayıları girilerek çıktının ortalaması, standart sapması ve %95 güven aralığı hesaplanır. Bu sayede tasarımın aşırı duyarlı olduğu kritik değişkenler anında tespit edilir ve beklenmedik saha arızaları tasarım aşamasında engellenir.",
            ],
          },
          {
            title: "Helisel Yay Mekaniği ve Kuvvet-Deplasman Eğrileri (EN 13906-1)",
            content: [
              "Mekanik sistemlerde enerji depolama ve geri çağırma elemanı olarak kullanılan helisel silindirik baskı yayları, tel çapı (d), ortalama yay çapı (D) ve aktif sarım sayısı (n) parametreleriyle tanımlanır. Yay rijitliği (yay sabiti, k) k = (G · d^4) / (8 · D^3 · n) formülüyle hesaplanır (burada G malzemenin kayma modülüdür, yay çeliği için tipik olarak 78.500–81.500 MPa).",
              "Kuvvet Grafiği aracımız; EN 13906-1 standardına göre serbest boy (L0), blok boy (solid length, Lc), izin verilen maksimum çalışma stroku ve F-x doğrusal kuvvet eğrisini oluşturarak yayınızın plastik deformasyona veya sarım çakışmasına uğramadan çalışacağını garanti eder.",
            ],
          },
          {
            title: "Hızlı Referans Merkezi ve Atölye Pratik Tabloları",
            content: [
              "Tasarım ve imalat aşamalarında standart metrik vida kılavuz çekme delik çapları, metal-metal ve metal-polimer sürtünme katsayıları, yaygın çeliklerin mekanik eşdeğerlikleri ve yüzey pürüzlülük sınıfları gibi kritik referans verilerine anlık erişim gerekir.",
              "Hızlı Referans Merkezimiz, dağınık kataloglar arasında kaybolmadan ihtiyaç duyduğunuz tüm doğrulanmış mühendislik verilerini tek bir ekranda toplayarak tasarım sürecinizi hızlandırır.",
            ],
          },
        ],
      },
      en: {
        eyebrow: "General Engineering, Units, and Verification",
        heading: "Engineering Guide to Unit Conversions, Sanity Verification, and Reference Data",
        lead: "Minimizing calculation risk requires uncompromising dimensional consistency, mathematical boundary testing, and instant access to verified workshop data. This utilities suite features our multidimensional SI/Imperial unit converter, the Monte Carlo powered Engineering Sanity Check Lab, EN 13906 linear spring force curve generator, and the comprehensive quick reference center.",
        sections: [
          {
            title: "Dimensional Homogeneity and Multi-Unit Conversion (SI & Imperial)",
            content: [
              "Discrepancies in unit conversion represent the single largest root cause of mathematical design blunders. The International System of Units (SI) establishes base quantities, defining pressure in Pascals (1 MPa = 1 N/mm² = 10 bar), torque in Newton-meters (N·m), and mechanical power in Watts (1 kW = 1000 J/s).",
              "Contrasting US Customary systems employ pounds-force (lbf), inches, psi (lbf/in²), and foot-pounds (lbf·ft). Our high-precision Unit Converter enforces exact conversion coefficients across length, area, volume, mass, force, pressure, torque, energy, power, and viscosity without floating-point drift.",
            ],
          },
          {
            title: "Engineering Sanity Check Lab and Stochastic Monte Carlo Analysis",
            content: [
              "Standard engineering formulas yield point estimates based on nominal inputs. In real-world manufacturing, material properties, machining dimensions, and operating loads follow statistical distributions. The Sanity Check Lab subjects your design formulas to parameter sensitivity evaluation and Monte Carlo stochastic verification.",
              "By assigning tolerance deviations to input variables, the tool computes output mean, standard deviation, and 95% confidence intervals, immediately isolating process-critical variables and averting field failures before fabrication commences.",
            ],
          },
          {
            title: "Helical Spring Mechanics and Force-Deflection Curves (EN 13906-1)",
            content: [
              "Cylindrical helical compression springs are defined by wire diameter (d), mean coil diameter (D), and active coil count (n). Spring stiffness rate (k) is derived from k = (G · d^4) / (8 · D^3 · n), where G is material shear modulus (78,500–81,500 MPa for spring wire steels).",
              "Our Spring Force Chart tool plots the linear F-x response, verifies solid height clearance (Lc), and flags risk of permanent set or coil clash under full compression, ensuring compliance with EN 13906-1 industrial standards.",
            ],
          },
          {
            title: "Quick Reference Center and Workshop Engineering Tables",
            content: [
              "During daily CAD modeling and fabrication planning, engineers require instant access to verified standard tap drill hole sizes, dry/lubricated friction coefficients for common tribological pairs, steel grade cross-references, and surface roughness conversion scales.",
              "The Quick Reference Center gathers these scattered standard tables into an intuitive, searchable dashboard, keeping essential engineering references at your fingertips.",
            ],
          },
        ],
      },
    },
  },
];

export const getCategoryBySlug = (slug: string): CategoryDefinition | null => {
  return TOOL_CATEGORIES.find((cat) => cat.slug === slug) ?? null;
};

export const getCategoryForToolId = (toolId: string): CategoryDefinition | null => {
  return TOOL_CATEGORIES.find((cat) => cat.toolIds.includes(toolId)) ?? null;
};
