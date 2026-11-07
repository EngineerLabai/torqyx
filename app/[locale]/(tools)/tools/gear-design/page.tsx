import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { withLocalePrefix } from "@/utils/locale-path";
import { NOINDEX_FOLLOW_ROBOTS, buildPageMetadata } from "@/utils/metadata";
import { isToolLocaleIndexReady } from "@/utils/tool-content-readiness";

type Bullet = { title: string; points: string[] };

type Section = {
  title: string;
  intro: string;
  items: Bullet[];
};

const SECTIONS_TR: Section[] = [
  {
    title: "1. Dişli Temelleri",
    intro: "Dişli tanımları, modül/hatve ve referans daireleri için hızlı özet.",
    items: [
      {
        title: "1.1 Dişli Tanımları ve Geometri Temeli",
        points: [
          "Modül nedir, neden kritik? Modül (m) diş boyutunu belirler; aynı modülde çalışan dişliler aynı hatve dairesi adımını paylaşır.",
          "Diş sayısı ve aktarım oranı ilişkisi: i = z2/z1; küçük diş sayısında undercut ve profil kaydırma ihtiyacı doğar.",
          "Adım (pitch), hatve, taksimat dairesi: hatve dairesi çevresindeki diş aralığı π·m; hatve doğrusu heliste helis açısına bağlıdır.",
          "Referans dairesi, taban dairesi, kafa ve dip daireleri: temas çizgisi taban dairesinde başlar, kafa/dip boşlukları temas güvenliği sağlar.",
          "Basınç açısı (20° / 17.5° / 14.5°): açı küçüldükçe sessizlik artar ama diş dibi zayıflar; 20° güncel standart, yüksek yükte daha rijit.",
        ],
      },
    ],
  },
  {
    title: "2. Dişli Tipleri",
    intro: "Düz, helis, konik, salyangoz, planet ve kremayer/zincir için kısa teknik notlar.",
    items: [
      {
        title: "2.1 Düz Dişliler",
        points: [
          "Kuvvetler: Ft (tangansiyel), Fr (radyal), Fa ≈ 0; yataklama radyal ağırlıklı seçilir.",
          "Avantaj: takım maliyeti düşük, taşlama kolay; dezavantaj: ses/vibrasyon helise göre yüksek.",
          "Kullanım: düşük/orta hız, maliyet duyarlı uygulamalar.",
        ],
      },
      {
        title: "2.2 Helis Dişliler – Helis Açısı, Eksenel Kuvvet Analizi",
        points: [
          "Kuvvetler: Ft; Fr = Ft·tan(αt), Fa = Ft·tan(β). β arttıkça Fa büyür, sessizlik artar.",
          "Çift helis/herringbone ile Fa dengelenir; yataklama eksenel kuvveti taşıyacak şekilde seçilir.",
          "Kullanım: orta/yüksek hız, düşük gürültü, otomotiv/indüstri redüktörleri.",
        ],
      },
      {
        title: "2.3 Konik Dişliler",
        points: [
          "Eksenleri kesişen miller için; yüz genişliği boyunca modül değişir.",
          "Spiral konik daha sessiz ve yüksek yük paylaşımı sunar; straight bevel daha basit ama gürültülü.",
          "İmalat ve kontrol: özel takım/tezgah (Gleason/Klingelnberg) ve hassas ayar gerekir.",
        ],
      },
      {
        title: "2.4 Salyangoz (Worm) Dişliler",
        points: [
          "Yüksek oran tek kademede (i ≈ 20–80); kayma yüksek, verim düşer, ısı artar.",
          "Malzeme eşleştirme: bronz çark + alaşımlı çelik salyangoz; yağlama viskoz ve ısı kontrolü kritik.",
          "Kendi kilitleme potansiyeli uygulamaya göre kontrol edilmeli (helis açısı ve sürtünmeye bağlı).",
        ],
      },
      {
        title: "2.5 Planet Dişli Sistemleri",
        points: [
          "Yüksek tork yoğunluğu ve kompakt yapı; güneş, taşıyıcı, halka kombinasyonlarına göre i belirlenir.",
          "Yük paylaşımı: taşıyıcı esnekliği, planet sayısı ve tolerans zinciri kritik.",
          "Gürültü/denge: simetri ve ağırlık dağılımı titreşim/gürültüyü belirler.",
        ],
      },
      {
        title: "2.6 Zincir ve Kremayer Dişliler",
        points: [
          "Kremayer: lineer hız = dairesel hız · π·m; backlash ve hızalama ömrü belirler.",
          "Zincir: hatve seçimi, uzama ve yağlama planı; sproket hatve toleransı kritik.",
          "Hizalama ve germe ayarı hem ömür hem gürültü için ana parametre.",
        ],
      },
    ],
  },
  {
    title: "3. Dişli Hesaplamaları (Ana Teknik İçerik)",
    intro:
      "Trafiğin ana kaynağı olacak hesap ve kontrol başlıkları. Her alt başlık ileride otomatik hesaplayıcıya dönüşebilir.",
    items: [
      {
        title: "3.1 Güç – Tork – Gerilme Hesaplamaları",
        points: [
          "Dişli çarkta çevre kuvveti: Ft = 2*T / d",
          "Eşdeğer diş yüzeyi basıncı ve Hertz temas gerilmesi",
          "Bükülme (Lewis formülü) kontrolü",
          "DIN 3990 / ISO 6336'e göre dayanım ve güvenlik katsayıları (SF, SH)",
        ],
      },
      {
        title: "3.2 Modül ve Diş Sayısı Seçimi",
        points: [
          "Modül seçim tabloları ve tipik aralıklar",
          "Çark çapı için modül–diş sayısı ilişkisi",
          "Alt ve üst sınır bağlamında optimum diş sayısı (z_min)",
          "Alt kesme (undercut) analizi ve profil kaydırma notu",
        ],
      },
      {
        title: "3.3 Helis Dişli Hesaplamaları",
        points: [
          "Normal–esas modül dönüşümü",
          "Helis açısının yük dağılımına etkisi",
          "Aksiyel kuvvet hesapları (Fa = Ft*tan beta)",
          "Eşdeğer düz dişli modülü ile karşılaştırma",
        ],
      },
      {
        title: "3.4 Boşluk (Backlash) Hesabı",
        points: [
          "Minimum – nominal – maksimum backlash tanımları",
          "ISO 2768 benzeri tolerans mantığı ile sınırlar",
          "Helisli sistemlerde backlash kontrolü",
          "İmal/taşlama toleransları ile birleşik not: taşlama sonrası yüzeylerde +/-µm düzeyleri",
        ],
      },
      {
        title: "3.5 Yüzey Kalitesi ve Pinyon-Çark Uyumu",
        points: [
          "Diş yanaklarının taşlanması, raspalama, form taşlama",
          "Reishauer / Maag yöntemlerinin yüksek hızlarda yüzey kalitesine katkısı",
          "Pinyon-çark uyumu için eşleştirilmiş taşlama stratejisi",
        ],
      },
      {
        title: "3.6 Verim Hesaplamaları",
        points: [
          "Helis dişlide verim ve kayma bileşeni etkisi",
          "Konik dişlide verim",
          "Worm gear verimi (yaklaşık %40–95 arası)",
        ],
      },
      {
        title: "3.7 Gürültü – Titreşim – NVH Hesaplamaları",
        points: [
          "Dişli temas oranı artırma teknikleri",
          "Profil modifikasyonları: tip relief, lead correction, crowning",
          "Üretim sapmalarının NVH etkisi; tolerans ve hızalama kontrolleri",
        ],
      },
    ],
  },
  {
    title: "4. Dişli Üretim Metotları",
    intro:
      "Yöntemleri açılır kartlarla özetliyoruz. Her yöntemin yanına imalat ve proses notları eklenmiştir.",
    items: [
      {
        title: "4.1 Yuvarlanma Metodu (Genel)",
        points: [
          "Kremayer formu ile diş profilinin yuvarlanarak kesilmesi",
          "Senkron hareket: kesici ve iş parçasının diş sayısına göre bağlanan dönüş hızları",
          "Kremayer bıçak + dişli çark hareket senkronu ile kusursuz evolvent profil oluşturulur",
        ],
      },
      {
        title: "4.1.1 MAAG Sistemi",
        points: [
          "Planya hareketi: ileri–geri tabla + dişli dönüş senkronu",
          "Kremayer bıçakla iki yüzeyin aynı anda kesimi",
          "Avantaj: diş profili simetrisi yüksek, hassasiyet iyi",
          "Dezavantaj: çevrim süresi uzun",
        ],
      },
      {
        title: "4.1.2 FELLOW Sistemi",
        points: [
          "Dişli şeklinde kesici (pinion-type cutter) ile yuvarlanma",
          "Yukarı çıkışta dönüş – aşağı inişte kesme prensibi",
          "İç dişliler ve omuzlu dişliler için vazgeçilmez imalat yöntemi",
        ],
      },
      {
        title: "4.1.3 Azdırma (Hobbing) Sistemi",
        points: [
          "Sonsuz vida formunda hob ile sürekli kesme (kontinü freze)",
          "Radyal, eksenel ve kombinasyon talaş kaldırma yöntemleri",
          "Yüksek verim; seri üretimde dünya standardı",
          "Helis açısı ayarlama: β – γ ilişkisi (helis açısı ve hob sarmal açısı)",
        ],
      },
      {
        title: "4.2 Döküm Dişliler",
        points: [
          "Düşük hız – yüksek dayanım uygulamaları",
          "Döküm hataları ve tolerans kontrolü; çekilme eğimi ve büzülme payı",
        ],
      },
      {
        title: "4.3 Modül Frezeleri",
        points: [
          "Form frezelerinin sınırlamaları (her diş sayısı için farklı profil)",
          "Çok diş sayısı için farklı takım ihtiyacı → stok/maliyet artar",
          "Bakım ve tamirat atölyelerinde tekil parça için uygundur",
        ],
      },
      {
        title: "4.4 Haddeleme – Ovalama",
        points: [
          "Soğuk/ılık şekillendirme ile yüzey sertleştirme etkisi",
          "Yüksek ömür, düşük talaş çıktısı; yüzey pürüzlülüğü iyileşir",
        ],
      },
      {
        title: "4.5 Zımbalama",
        points: [
          "Önce sac/ince kesit dişli parçalar için hızlı yöntem",
          "Kalıp ömrü ve kenar çizgisinin bükülme riskleri",
        ],
      },
      {
        title: "4.6 Plastik – Püskürtme Kalıp Dişliler",
        points: [
          "Büzülme ve nem alımı nedeniyle boyutsal düzeltme gereksinimi",
          "Profil modifikasyonu ve çarpılmayı azaltacak kalıp tasarımı (POM, PA66)",
        ],
      },
      {
        title: "4.7 Sinterleme",
        points: [
          "Gözeneklilik → yağ emdirme ile kendiliğinden yağlama",
          "Boyutsal tolerans: sinterleme sonrası kalibrasyon/coining ihtiyacı",
        ],
      },
      {
        title: "4.8 Broşlama",
        points: [
          "İç dişli ve spline için tek geçişte yüksek doğruluk",
          "Takım maliyeti yüksek; seri üretimde çok verimli",
        ],
      },
    ],
  },
  {
    title: "5. Dişli Malzemeleri ve Isıl İşlemler",
    intro: "Çelik sınıfları, yüzey sertleştirme, temperleme ve mikro yapı ile kalite ilişkisi.",
    items: [
      {
        title: "5.1 Çelik Safhaları (C45, 16MnCr5, 20MnCr5, 42CrMo4)",
        points: [
          "C45: orta karbon, indüksiyonla yüzey sertleştirme; çekirdek tok.",
          "16MnCr5 / 20MnCr5: sementasyon için düşük karbonlu alaşımlar; yüzey sert, çekirdek tok.",
          "42CrMo4: temperlenebilir; yüksek çekme ve yorulma dayanımı gereken miller/dişliler.",
          "Seçim kriterleri: hedef sertlik, diş boyutu, darbeye maruziyet, maliyet.",
        ],
      },
      {
        title: "5.2 Yüzey Sertleştirme (Sementasyon, Nitrasyon)",
        points: [
          "Sementasyon: 0.8–1.2 mm karbonlama, ardından temperleme; yüksek yüzey sertliği (58–62 HRC).",
          "Nitrasyon: düşük sıcaklık, düşük deformasyon; 0.2–0.6 mm derinlik, iyi aşınma/yorulma direnci.",
          "Seçim: diş boyutu, deformasyon toleransı, yük spektrumu ve maliyet.",
        ],
      },
      {
        title: "5.3 Temperleme ve Gerilim Giderme",
        points: [
          "Sementasyon sonrası düşük temp. temperleme ile kırılganlık azaltma.",
          "Nitrasyon öncesi gerilim giderme: deformasyonu minimize eder.",
          "Üretim sırası: kaba işleme → ısıl işlem → taşlama/honing.",
        ],
      },
      {
        title: "5.4 Dişli Kalitesi – Mikro Yapı İlişkisi",
        points: [
          "Martenzit yüzey + toklu çekirdek kombinasyonu yorulma ömrünü belirler.",
          "Karbür dağılımı ve tane boyutu, pitting ve diş dibi çatlaklarına karşı kritiktir.",
          "Taşlama yanığı mikro yapıyı bozarak erken pittinge yol açabilir.",
        ],
      },
      {
        title: "5.5 Sürünme ve Yorulma Dayanımı",
        points: [
          "Yüksek sıcaklık/uzun süreli yükte sürünme; alaşım ve sertlik seçimi etkili.",
          "Yorulma dayanımı: yüzey sertliği, sıkıştırma kalıntı gerilmeleri ve yüzey pürüzlülüğü belirleyici.",
          "Yağlama ve yüzey pürüzlülüğü iyileştirmeleri (honing, superfinish) yorulma ömrünü artırır.",
        ],
      },
    ],
  },
  {
    title: "6. Dişlilerde Yağlama",
    intro:
      "Yağlama stratejileri. Çevre hızı ve kuvvet-hız faktörüne göre seçim yapılır.",
    items: [
      {
        title: "6.1 Yağlama Türleri",
        points: [
          "Sürmeli (splash-on/brush): düşük/orta hızlar için basit uygulama.",
          "Daldırma (sump/bath): çarkın bir bölümü yağ banyosuna girer; vç arttıkça kayıplara dikkat.",
          "Püskürtme (spray/jet): yüksek hız ve yükte kontrollü dağılım; nozul yerleşimi kritik.",
        ],
      },
      {
        title: "6.2 Çevre Hızı vç’ye Göre Seçim",
        points: [
          "vç < ~8 m/s: daldırma yeterli; sürmeli basit uygulamalarda kullanılabilir.",
          "8–20 m/s: daldırma + yönlendirilmiş sıçratma; yağ köpüklenmesi/taşma kontrolü.",
          ">20 m/s: püskürtme/jetsiz olmaz; nozul açısı ve debi hesaplanmalı.",
        ],
      },
      {
        title: "6.3 Viskozite Seçimi",
        points: [
          "Çevre hızı ve yük faktörü (ks / vç) ile ISO VG seçimi.",
          "DIN 51509 yağ sınıfları: yük/hız aralıklarına göre rehber.",
          "Yüksek hızda daha düşük viskozite, düşük hız/yüksek torkta daha yüksek viskozite tercih edilir.",
        ],
      },
      {
        title: "6.4 Isı Tahkiki & Soğutma",
        points: [
          "Güç kaybı → ısı oluşumu; banyoda sıcaklık artışı tahmini gerekir.",
          "Püskürtmede yağ debisi ve dönüş hattı soğutması planlanmalı.",
          "Sıcaklık kontrolü için ısı eşanjörü/soğutucu entegrasyonu.",
        ],
      },
    ],
  },
  {
    title: "7. Dişli Konstrüksiyon İncelikleri",
    intro: "Kritik tasarım nüansları: göbek, disk/kaburga ve mil geçmesi.",
    items: [
      {
        title: "7.1 Göbek Tasarımı",
        points: [
          "dGD ≥ 1.5·dM kriteri (göbek dış çapı ≥ 1.5×dişli modülü*diş sayısı / π).",
          "Dolu malzeme – dövme – döküm karşılaştırması: dayanım, maliyet, çarpılma riskleri.",
          "Transport delikleri ve ağırlık optimizasyonu; balansı etkilemeyecek simetrik yerleşim.",
        ],
      },
      {
        title: "7.2 Disk – Kaburga Tasarımı",
        points: [
          "Disk açısı 8–12°: rijitlik ve dökümde kalıp çıkarma kolaylığı.",
          "Kaburga kalınlığı: moment yolu ve kaynak/döküm kalitesiyle uyumlu seçilmeli.",
          "Çember et kalınlığı: termal/işleme payı ve mukavemet için minimum et.",
        ],
      },
      {
        title: "7.3 Mil Üzerine Geçme",
        points: [
          "Boyuna geçme toleransları: yük yönü ve montaj koşullarına göre geçme sınıfı.",
          "Dişli–mil bağlantı hesapları: yüzey basıncı, kayma ve emniyet katsayısı kontrolü.",
          "Anahtar kanalı vs frezeli mil: montaj kolaylığı, tork kapasitesi ve yorulma etkisi karşılaştırması.",
        ],
      },
    ],
  },
  {
    title: "8. Toleranslar ve Kalite Sınıfları",
    intro:
      "DIN 3960–3967, ISO 1328 çerçevesinde profil/hatve sapmaları ve üretim toleransları; taşlama ve raspalama etkisi.",
    items: [
      {
        title: "8.1 Standartlar & Kalite Sınıfları",
        points: [
          "DIN 3960–3967: kalite sınıfları, profil/hatve sapması tanımları.",
          "ISO 1328: helis/düz dişliler için genel tolerans ve kalite sınıfları.",
          "Kontrol yöntemleri: hatve, profil ve runout ölçümleri.",
        ],
      },
      {
        title: "8.2 Profil & Hatve Sapmaları",
        points: [
          "Tipik sapmalar: profile slope, profile form error.",
          "Düzeltmeler: profil modifikasyonu (tip relief) ile dağılımı iyileştirme.",
          "Taşlama sonrası profil hassasiyeti yükselir; yanık ve fazla malzeme alımına dikkat.",
        ],
      },
      {
        title: "8.3 Taşlama Sonrası Kalite Artırma",
        points: [
          "Raspalama ve taşlamanın toleransa etkisi ve DIN kalite iyileştirmesi.",
          "Taşlama yanığı ve mikro yapı bozulması riskine karşı proses kontrolü.",
          "Superfinish/honing ile pürüzlülük ve NVH iyileştirmesi.",
        ],
      },
    ],
  },
  {
    title: "9. Dişli Arızaları ve Kök-Neden Analizi",
    intro: "Saha ve test arızaları; pitting, scuffing, kırılma ve hizasızlık etkileri.",
    items: [
      {
        title: "9.1 Pitting (Yüzey Çukurlaşması)",
        points: [
          "Yüksek yüzey basıncı ve yağ filmi yetersizliğinde mikro çukurlaşma.",
          "Önleme: doğru viskozite, yüzey pürüzlülüğü iyileştirme, yük dağılımı (helis, profil modifikasyonu).",
        ],
      },
      {
        title: "9.2 Scuffing (Yapışma / Aşınma)",
        points: [
          "Yüksek kayma + sıcaklık → film kopması; diş yanaklarında mavi/kahverengi renklenme.",
          "Önleme: EP katkılı yağ, doğru viskozite, yüzey ısısını kontrol (püskürtme yağlama).",
        ],
      },
      {
        title: "9.3 Diş Dibi Bükülme Kırığı",
        points: [
          "Yüksek Ft + çentik etkisi → diş dibi çatlağı/kırığı.",
          "Önleme: yeterli diş dibi emniyeti (SF), uygun fillet yarıçapı, kontrollü ısıl işlem.",
        ],
      },
      {
        title: "9.4 Hizasızlık Kaynaklı Kenar Hasarları",
        points: [
          "Yanlış hızalama → kenar yüklenmesi, lokal pitting/scuffing.",
          "Önleme: şim/mesnet ayarı, lead correction/crowning ile yük dağılımı düzeltme.",
        ],
      },
    ],
  },
  {
    title: "10. Online Hesaplayıcılar",
    intro:
      "Modül, oran, kuvvet, backlash, helis aksiyel kuvvet ve yağ viskozitesi seçici gibi etkileşimli araçlar.",
    items: [
      {
        title: "10.1 Modül ve Geometri Hesaplayıcı",
        points: [
          "Dişli boyutu ve diş sayısına göre modül hesaplama ve standart seri eşleme.",
          "Adım, taksimat dairesi ve kafa/dip çapları çıktısı.",
        ],
      },
      {
        title: "10.2 Çevresel Kuvvet – Tork Hesaplayıcı",
        points: [
          "Ft = 2·T / d; Fr ve helisli dişlilerde Fa otomatik hesap.",
          "Güç, rpm, çap/modül girişiyle doğrudan yatak yükleri tahmini.",
        ],
      },
      {
        title: "10.3 Backlash & Temas Oranı Hesaplayıcı",
        points: [
          "Min/nom/max backlash; helis/düz dişli için tolerans tabanlı hesap.",
          "εα ve εβ profil temas oranları ile gürültü ve NVH tahmini.",
        ],
      },
    ],
  },
  {
    title: "11. Dişli Üretim Simülasyonları",
    intro: "Mühendisler ve öğrenciler için kinematik hareket ve kesme simülasyonları.",
    items: [
      {
        title: "11.1 Azdırma (Hobbing) Kesim Simülasyonu",
        points: [
          "Hob sarmal hareketi, radyal/eksenel besleme ve helis açısı ayarı.",
          "Evolvent diş formunun sürekli talaş kaldırma ile oluşumu.",
        ],
      },
      {
        title: "11.2 Profil Taşlama & Honlama",
        points: [
          "Sertleştirilmiş dişli yüzeylerinde taşlama ve mikro yapı kontrolü.",
          "Superfinish işlemi ile ayna yüzey ve mikron seviyesi pürüzlülük.",
        ],
      },
    ],
  },
];

const SECTIONS_EN: Section[] = [
  {
    title: "1. Gear Fundamentals & Involute Geometry",
    intro: "Core gear definitions, module standards, pitch circles, and base involute geometry summary.",
    items: [
      {
        title: "1.1 Gear Terminology and Involute Geometry",
        points: [
          "Module (m): Fundamental metric unit defining tooth size (m = d / z). Mating gears on identical center distances must share the same normal module.",
          "Gear Ratio & Kinematic Reduction: i = z2 / z1 = n1 / n2. Low pinion tooth counts require profile shift (addendum modification) to prevent undercut.",
          "Pitch Circles & Circular Pitch: Pitch distance p = π·m. The operating pitch diameter represents the pure rolling kinematic line without instantaneous sliding.",
          "Base Circle, Addendum, and Dedendum Circles: Involute tooth action originates strictly at the base circle (db = d·cos α); clearance protects root fillets.",
          "Pressure Angle (20° standard / 14.5° legacy / 25° heavy duty): 20° is the ISO/DIN standard providing optimal balance between tooth bending strength and contact ratio.",
        ],
      },
    ],
  },
  {
    title: "2. Gear Types & Mechanical Configurations",
    intro: "Engineering overview of spur, helical, bevel, worm, planetary, and rack-and-pinion transmission mechanisms.",
    items: [
      {
        title: "2.1 Spur Gears (External & Internal)",
        points: [
          "Load vectors: Tangential tooth force Ft, radial separating force Fr = Ft·tan α, zero axial thrust (Fa ≈ 0). Allows simplified bearing arrangements.",
          "Advantages: Lowest manufacturing and tooling cost, straightforward profile grinding; trade-off is higher impact noise at elevated pitchline speeds.",
          "Primary applications: Low to moderate pitchline speeds (< 10 m/s), industrial reducers, and cost-sensitive mechanical drives.",
        ],
      },
      {
        title: "2.2 Helical Gears – Helix Angle and Axial Thrust",
        points: [
          "Load vectors: Ft; radial force Fr = Ft·tan αt / cos β; axial thrust Fa = Ft·tan β. Higher helix angle β increases contact overlap but creates substantial thrust.",
          "Thrust management: Double-helical (herringbone) gearing cancels internal axial thrust; single helical requires opposed tapered roller bearings.",
          "Primary applications: Automotive transmissions, high-speed industrial speed reducers, and quiet turbomachinery drives.",
        ],
      },
      {
        title: "2.3 Bevel Gears (Straight & Spiral)",
        points: [
          "Designed for intersecting shaft axes (typically 90°); tooth module decreases continuously from heel to toe along the pitch cone.",
          "Spiral bevel (Gleason / Klingelnberg) delivers continuous overlapping tooth engagement and higher power density than straight bevel gears.",
          "Mounting & alignment: Strict axial shim adjustment required to keep contact tooth patterns centered under shaft bending deflections.",
        ],
      },
      {
        title: "2.4 Worm Gearing (High Reduction)",
        points: [
          "Enormous single-stage reduction ratios (i = 10:1 to 80:1) with compact orthogonal non-intersecting axes.",
          "Sliding kinematics: Continuous sliding friction demands bronze gear rings (CuSn12Ni2) paired with case-hardened ground steel worms.",
          "Self-locking behavior: Occurs when lead angle γ is lower than the friction angle; verify under dynamic shock and vibration environments.",
        ],
      },
      {
        title: "2.5 Planetary (Epicyclic) Gear Trains",
        points: [
          "Outstanding torque density and coaxial shaft arrangement; kinematic ratio set by sun, carrier, and ring gear tooth relationships.",
          "Load sharing: Requires floating sun gears, flexible pin carriers, or micro-matched planet tooth tolerances to distribute torque equally across planets.",
          "NVH & balance: Multi-planet symmetry reduces net radial shaft forces to near zero.",
        ],
      },
      {
        title: "2.6 Rack & Pinion and Chain Drives",
        points: [
          "Rack and Pinion: Translates rotary motion to linear velocity (v = π·m·z·n / 60); backlash adjustment and linear stiffness dictate positioning accuracy.",
          "Sprockets & Roller Chains: Discrete pitch engagement with polygon effect chordal vibrations; requires regular lubrication and tensioners.",
        ],
      },
    ],
  },
  {
    title: "3. Gear Calculations & Strength Analysis (ISO 6336 / DIN 3990)",
    intro:
      "Core analytical methods: power-torque sizing, contact pressure (Hertz), root bending stress, backlash, and efficiency.",
    items: [
      {
        title: "3.1 Power, Torque & Tooth Stress (ISO 6336 / DIN 3990)",
        points: [
          "Nominal tangential pitchline force: Ft = 2000·T / d [N].",
          "Hertzian contact stress (Pitting durability): σH = ZE · ZH · Zε · Zβ · √(Ft · (u + 1) / (d1 · b · u)) ≤ σHP.",
          "Tooth root bending stress (Lewis / ISO formula): σF = (Ft / (b · mn)) · YF · YS · Yβ · KA · Kv ≤ σFP.",
          "Application & dynamic factors: KA covers external torque shocks, Kv models internal pitch line dynamic excitations.",
        ],
      },
      {
        title: "3.2 Module and Pinion Tooth Sizing",
        points: [
          "Standard metric module preferred series per ISO 54 (1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20 mm).",
          "Minimum undercut tooth limit: z_min = 2 / (sin² α) ≈ 17 teeth for standard 20° spur gears without profile shift.",
          "Profile shift coefficient (x): Positive shift (x > 0) prevents undercut on small pinions, thickens the tooth root, and balances Hertzian stresses.",
        ],
      },
      {
        title: "3.3 Helical Gear Parameter Conversions",
        points: [
          "Transverse vs normal module: mt = mn / cos β. Normal module defines standard cutting hob geometry.",
          "Transverse pressure angle: tan αt = tan αn / cos β.",
          "Virtual spur tooth count: zv = z / (cos³ β); used for Lewis form factor lookup.",
        ],
      },
      {
        title: "3.4 Backlash Determination (DIN 3967 / ISO 21771)",
        points: [
          "Definitions: Normal backlash jn, transverse backlash jt, and circumferential backlash jt.",
          "Thermal clearance: Differential thermal expansion between steel gears and aluminum/cast iron housings must never close backlash to zero.",
          "Manufacturing tooth thickness thinning: Center distance tolerance, runout, and gear hob depth tolerances set minimum backlash.",
        ],
      },
      {
        title: "3.5 Contact Ratio & NVH Optimization",
        points: [
          "Transverse contact ratio (εα): Must exceed 1.2 for spur gears to ensure continuous smooth load transfer.",
          "Overlap contact ratio (εβ = b · sin β / (π · mn)): For helical gears, total contact ratio εγ = εα + εβ frequently exceeds 2.0–2.5, dropping noise by 6–10 dB.",
          "Micro-geometry profile corrections: Tip relief (k-relief), crowning, and lead angle correction to eliminate edge contact under shaft bending.",
        ],
      },
    ],
  },
  {
    title: "4. Gear Manufacturing & Machining Methods",
    intro:
      "Comprehensive breakdown of generating processes, hobbing, shaping, broaching, and high-precision tooth grinding.",
    items: [
      {
        title: "4.1 Generating Machining Processes",
        points: [
          "Continuous envelope generation: The cutting tool moves as a virtual mating rack or pinion, rolling synchronously with the gear blank.",
          "Generates mathematically true involute geometry automatically without requiring dedicated custom cutters for each tooth number.",
        ],
      },
      {
        title: "4.1.1 Continuous Gear Hobbing",
        points: [
          "Continuous rotating worm-hob synchronized electronically or via index gearing with table rotation.",
          "World standard for high-production external spur and helical gears; supports climb or conventional hobbing with carbide hobs.",
          "Helix angle synchronization: Hob swivel angle set to (β ± γ_hob) depending on hand of helix.",
        ],
      },
      {
        title: "4.1.2 Fellows Gear Shaping",
        points: [
          "Pinion-shaped cutter reciprocating vertically while rolling into the workpiece blank.",
          "Essential for internal ring gears, cluster gears with narrow relief shoulders, and internal splines where hobs cannot pass.",
        ],
      },
      {
        title: "4.1.3 Precision Gear Grinding & Finishing",
        points: [
          "Continuous generating gear grinding (threaded wheel, Reishauer style) and form profile grinding (single tooth, Hofler/Niles style).",
          "Achieves DIN quality classes 4–6 after heat treatment, removing quench distortion and correcting lead deviations.",
          "Process controls: Flood coolant filtration to prevent thermal grinding temper burn (Barkhausen noise tested).",
        ],
      },
      {
        title: "4.2 Cold / Warm Gear Rolling",
        points: [
          "Chipless plastic deformation using synchronized rolling dies; work-hardens tooth flanks and creates uninterrupted grain flow for maximum fatigue life.",
        ],
      },
      {
        title: "4.3 Powder Metal & Injection Molded Gears",
        points: [
          "PM gears: Sintered iron/steel for automotive oil pumps; porosity allows vacuum oil impregnation.",
          "Polymer gears: POM and PA66 injection molding for low-load actuators, office automation, and dry medical drives.",
        ],
      },
    ],
  },
  {
    title: "5. Gear Materials & Heat Treatment Protocols",
    intro: "Alloy steel selection, case carburizing, nitriding, quenching, and core microstructure relationships.",
    items: [
      {
        title: "5.1 Structural & Case-Hardening Steels",
        points: [
          "Through-hardening steels (AISI 1045 / 4140): Normalized or quenched & tempered to 28–34 HRC for moderate loads.",
          "Carburizing alloy steels (16MnCr5, 20MnCr5, AISI 8620, 9310): Case-hardened to 58–62 HRC with high core toughness (> 800 MPa yield).",
          "Nitriding steels (31CrMoV9, 42CrMo4 nitrided): Surface hardness 650–900 HV with minimal quench warping.",
        ],
      },
      {
        title: "5.2 Heat Treatment Protocols",
        points: [
          "Gas carburizing at 900–930°C followed by controlled oil quenching and sub-critical tempering at 160–200°C.",
          "Deep cryogenic freezing (-196°C) to eliminate retained austenite on high-precision aerospace gears.",
          "Shot peening: Induces compressive residual surface stresses (-600 to -900 MPa) in root fillets, doubling bending fatigue life.",
        ],
      },
    ],
  },
  {
    title: "6. Gearbox Lubrication Strategies",
    intro: "Splash and forced-feed lubrication guidelines, pitchline velocity limits, and ISO VG viscosity selection.",
    items: [
      {
        title: "6.1 Lubrication Methods",
        points: [
          "Splash / Bath Lubrication: Tooth dip depth equals 1–3 module heights; optimal for pitchline velocities v ≤ 12–15 m/s.",
          "Forced Oil Jet / Spray Lubrication: Pressurized oil nozzles aimed directly at the gear disengagement (for cooling) or engagement (for film).",
          "Grease lubrication: Compact fractional-horsepower gear motors and sealed handheld power tools.",
        ],
      },
      {
        title: "6.2 Oil Viscosity Selection (ISO VG)",
        points: [
          "Selected using pitchline velocity v and specific tooth force ks (N/mm) per DIN 51509.",
          "Higher speeds require lower viscosity (ISO VG 100–150) to minimize churning drag; heavy loads require ISO VG 220–460 with EP anti-wear additives.",
        ],
      },
      {
        title: "6.3 Thermal Equilibrium & Churning Losses",
        points: [
          "Total power loss = tooth sliding friction + rolling friction + seal drag + windage and oil churning.",
          "Sump temperature should be maintained below 80–90°C to prevent rapid oxidation of mineral oils.",
        ],
      },
    ],
  },
  {
    title: "7. Gear Structural Design & Blank Geometry",
    intro: "Engineering design rules for hubs, webbed disks, rim thickness, and shaft-hub interference connections.",
    items: [
      {
        title: "7.1 Hub & Bore Proportions",
        points: [
          "Hub outer diameter dH ≥ 1.5–1.8 · dBore for keyway integrity and press-fit hoop stress resistance.",
          "Cast and forged wheels utilize webbed disk cross-sections (8–12° taper) and weight-reduction lightening holes.",
        ],
      },
      {
        title: "7.2 Rim Thickness & Web Design",
        points: [
          "Rim thickness beneath the root: sR ≥ 1.2–1.5 · m to avoid rim bending fatigue fractures under the root fillet.",
          "Involute spline connections per DIN 5480 provide superior fatigue endurance and self-centering compared to parallel keyways.",
        ],
      },
    ],
  },
  {
    title: "8. Tolerances & Quality Classes (ISO 1328 / DIN 3962)",
    intro: "Accuracy grades, individual profile and pitch deviations, and post-grinding inspection standards.",
    items: [
      {
        title: "8.1 Accuracy Grades",
        points: [
          "Grades 1–4: Master reference gears and ultra-precision metrology standards.",
          "Grades 5–6: Ground automotive transmissions, aerospace turboprops, and high-speed industrial reducers.",
          "Grades 7–9: Hobbed and shaved general industrial machinery and agricultural gearboxes.",
          "Grades 10–12: As-stamped, cast, or flame-cut low-speed open drives.",
        ],
      },
      {
        title: "8.2 Elemental Pitch & Profile Errors",
        points: [
          "Profile slope error (fHα) and profile form error (ffα) measured on CNC gear coordinate measuring machines (CMMs).",
          "Single pitch error (fp) and total cumulative pitch error (Fp) control gear rotational velocity uniformity.",
        ],
      },
    ],
  },
  {
    title: "9. Gear Failure Modes & Root-Cause Analysis",
    intro: "Investigation of pitting, scuffing, bending fracture, and edge loading failure mechanisms in industrial service.",
    items: [
      {
        title: "9.1 Pitting & Surface Macropitting",
        points: [
          "Sub-surface shear stress exceeding fatigue endurance limit under cyclic Hertzian contact, causing metal flaking.",
          "Preventive measures: Increase core/surface hardness, optimize oil viscosity (higher film thickness parameter λ), and apply tip relief.",
        ],
      },
      {
        title: "9.2 Scuffing & Adhesive Smearing",
        points: [
          "Sudden localized microwelding and tearing of tooth flanks caused by lubricant film flash temperature breakdown under high sliding.",
          "Preventive measures: Use extreme pressure (EP) sulphur-phosphorus additives, improve surface finish (Ra < 0.3 µm), and reduce sliding velocity.",
        ],
      },
      {
        title: "9.3 Tooth Root Bending Fatigue",
        points: [
          "Beach-mark crack propagation initiating at the tension-side root fillet due to cyclic tooth bending overload.",
          "Preventive measures: Increase root fillet radius, introduce shot peening residual compression, or enlarge module.",
        ],
      },
      {
        title: "9.4 Misalignment & Edge Loading",
        points: [
          "Shaft deflection or housing bore angular error concentrating 100% of the tooth load onto one outer corner.",
          "Preventive measures: Apply symmetrical crowning (Cβ) and end-relief to guarantee centered contact patterns.",
        ],
      },
    ],
  },
  {
    title: "10. Interactive Engineering Calculators",
    intro: "Access our dedicated online calculation tools for sizing modules, torque, backlash, and helix parameters.",
    items: [
      {
        title: "10.1 Module and Geometry Calculator",
        points: [
          "Calculate standard module, reference pitch circle, addendum, dedendum, and root fillet parameters.",
        ],
      },
      {
        title: "10.2 Tooth Forces & Torque Sizing",
        points: [
          "Direct computation of tangential force Ft, separating radial force Fr, and helical thrust force Fa.",
        ],
      },
      {
        title: "10.3 Backlash & Contact Ratio Sizing",
        points: [
          "Compute minimum/maximum operational backlash and transverse/overlap contact ratios (εα, εβ).",
        ],
      },
    ],
  },
  {
    title: "11. Gear Manufacturing Simulations",
    intro: "Interactive kinematic motion studies illustrating generating machining mechanisms for students and design engineers.",
    items: [
      {
        title: "11.1 Continuous Gear Hobbing Kinematics",
        points: [
          "Hob spindle synchronized continuous cutting simulation with radial and axial feed directions.",
        ],
      },
      {
        title: "11.2 Gear Shaper Generating Action",
        points: [
          "Vertical reciprocating stroke and rotary index motions for internal ring gears and cluster teeth.",
        ],
      },
    ],
  },
];

const COPY = {
  tr: {
    categoryBadge: "Dişli Hesaplamaları ve Dişli Tasarım İncelikleri",
    statusBadge: "Kapsamlı Rehber",
    title: "Dişli temelleri, tipleri, hesaplamalar ve üretim metotları teknik rehberi",
    desc: "Dişli geometrisi, DIN/ISO hesaplamaları, imalat metotları, malzeme/ısıl işlem ve arıza kök-neden analizlerini kapsayan teknik rehber. Her kartı genişleterek maddeleri okuyabilir, online hesap modüllerini kullanabilirsiniz.",
    calculatorsBtn: "Online hesaplayıcıları aç",
    simulationsBtn: "Simülasyon sayfasını aç",
    cardsBadge: "Açılır kartlar",
    openLabel: "Açık",
    closedLabel: "Aç",
  },
  en: {
    categoryBadge: "Gear Engineering & Transmission Design",
    statusBadge: "Technical Guide",
    title: "Comprehensive Engineering Guide to Gear Design, Sizing & Manufacturing",
    desc: "In-depth technical reference covering gear geometry fundamentals, DIN 3990 / ISO 6336 stress calculations, machining processes, heat treatment specs, and root-cause failure analysis. Expand any card to inspect design formulas and launch online calculators.",
    calculatorsBtn: "Open Online Calculators",
    simulationsBtn: "Open Manufacturing Simulations",
    cardsBadge: "Accordion sections",
    openLabel: "Expanded",
    closedLabel: "Expand",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Dişli Tasarım Rehberi" : "Gear Design Guide";
  const description =
    locale === "tr"
      ? "Dişli tasarımı, dişli tipleri, mukavemet ve imalat notlarını bir araya getiren mühendislik hesaplayıcıları odaklı kapsamlı teknik rehber."
      : "Comprehensive gear design guide for engineering calculators covering gear types, strength checks, and manufacturing notes in one technical page.";

  return buildPageMetadata({
    title,
    description,
    path: "/tools/gear-design",
    locale,
    robots: isToolLocaleIndexReady("gear-design", locale) ? undefined : NOINDEX_FOLLOW_ROBOTS,
  });
}

export default async function GearDesignPage() {
  const locale = await getLocaleFromCookies();
  const isEn = locale === "en";
  const t = COPY[isEn ? "en" : "tr"];
  const sections = isEn ? SECTIONS_EN : SECTIONS_TR;

  const initialDocs = await getToolDocsResponse("gear-design", locale);
  const calculatorsHref = withLocalePrefix("/tools/gear-design/calculators", locale);
  const simulationsHref = withLocalePrefix("/tools/gear-design/simulations", locale);

  return (
    <PageShell>
      <ToolDocTabs slug="gear-design" initialDocs={initialDocs}>
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_24%)]" />
          <div className="relative space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                {t.categoryBadge}
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                {t.statusBadge}
              </span>
            </div>
            <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">
              {t.title}
            </h1>
            <p className="text-sm leading-relaxed text-slate-700">{t.desc}</p>
          </div>
        </section>

        <section className="space-y-5">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-slate-900">{section.title}</h2>
                  <p className="text-sm text-slate-700">{section.intro}</p>
                  {section.title.startsWith("10.") && (
                    <Link
                      href={calculatorsHref}
                      className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
                    >
                      {t.calculatorsBtn}
                      <span className="text-[12px]">→</span>
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                    {t.cardsBadge}
                  </span>
                  {section.title.startsWith("11.") && (
                    <Link
                      href={simulationsHref}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100"
                    >
                      {t.simulationsBtn}
                    </Link>
                  )}
                </div>
              </header>

              <div className="space-y-3">
                {section.items.map((item, idx) => (
                  <details
                    key={item.title}
                    className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300"
                    {...(idx === 0 ? { open: true } : {})}
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-2 text-sm font-semibold text-slate-900 outline-none">
                      <span className="break-words">{item.title}</span>
                      <span className="text-[11px] font-medium text-slate-500 group-open:text-slate-700">
                        {idx === 0 ? t.openLabel : t.closedLabel}
                      </span>
                    </summary>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[12px] leading-relaxed text-slate-700">
                      {item.points.map((p) => (
                        <li key={p} className="break-words">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </article>
          ))}
        </section>
      </ToolDocTabs>
    </PageShell>
  );
}
