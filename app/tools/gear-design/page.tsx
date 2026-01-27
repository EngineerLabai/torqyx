import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";

type Bullet = { title: string; points: string[] };

type Section = {
  title: string;
  intro: string;
  items: Bullet[];
};

const sections: Section[] = [
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
          "Kremayer: lineer hız = dairesel hız · π·m; backlash ve hizalama ömrü belirler.",
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
          "Üretim sapmalarının NVH etkisi; tolerans ve hizalama kontrolleri",
        ],
      },
    ],
  },
  {
    title: "4. Dişli Üretim Metotları",
    intro:
      "PDF içeriği derin ve zengin; burada yöntemleri açılır kartlarla özetliyoruz. Her yöntemin yanına animasyon/şema eklenebilir.",
    items: [
      {
        title: "4.1 Yuvarlanma Metodu (Genel)",
        points: [
          "Kremayer formu ile diş profilinin yuvarlanarak kesilmesi",
          "Senkron hareket: kesici ve iş parçasının diş sayısına göre bağlanan dönüş hızları",
          "Animasyon/şema: kremayer bıçak + dişli çark hareket diyagramı",
        ],
      },
      {
        title: "4.1.1 MAAG Sistemi",
        points: [
          "Planya hareketi: ileri–geri tabla + dişli dönüş senkronu",
          "Kremayer bıçakla iki yüzeyin aynı anda kesimi",
          "Zürih MAAG makinelerinin çalışma diyagramları (çift yüzey işleme)",
          "Avantaj: diş profili simetrisi yüksek, hassasiyet iyi",
          "Dezavantaj: çevrim süresi uzun",
          "Animasyon/şema: planya stroku + kremayer bıçak hareketi",
        ],
      },
      {
        title: "4.1.2 FELLOW Sistemi",
        points: [
          "Dişli şeklinde kesici (pinion-type cutter) ile yuvarlanma",
          "Yukarı çıkışta dönüş – aşağı inişte kesme prensibi",
          "Konik bıçak ve eğik tabla ayarı ile profil uyumu",
          "ABD endüstrisinde yaygın kullanım",
          "Animasyon/şema: dişli kesici + iş parçası senkron hareketi",
        ],
      },
      {
        title: "4.1.3 Azdırma (Hobbing) Sistemi",
        points: [
          "Sonsuz vida formunda hob ile sürekli kesme (kontinü freze)",
          "Radyal, eksenel ve kombinasyon talaş kaldırma yöntemleri",
          "Yüksek verim; seri üretimde tercih",
          "Helis açısı ayarlama: β – γ ilişkisi (helis açısı ve hob sarmal açısı)",
          "Çok ağızlı hob kullanımı ve aşınma problemi",
          "DIN kalite sınıflarına göre yüzey/doğruluk hedefleri",
          "Animasyon/şema: hob + çark besleme yönleri (radyal/eksenel)",
        ],
      },
      {
        title: "4.2 Döküm Dişliler",
        points: [
          "Düşük hız – yüksek dayanım uygulamaları",
          "Döküm hataları ve tolerans kontrolü",
          "Model tasarım kriterleri (çekilme eğimi, büzülme payı)",
          "Kaynak notu: 12_05_dislilerin_uretimi",
          "Animasyon/şema: model + yolluk + besleyici örneği",
        ],
      },
      {
        title: "4.3 Modül Frezeleri",
        points: [
          "Form frezelerinin sınırlamaları (her diş sayısı için farklı profil)",
          "Çok diş sayısı için farklı takım ihtiyacı → stok/maliyet artar",
          "Güncel üretimde tercih edilmeme sebepleri: esneklik ve hassasiyet düşüklüğü",
        ],
      },
      {
        title: "4.4 Haddeleme – Ovalama",
        points: [
          "Soğuk/ılık şekillendirme ile yüzey sertleştirme etkisi",
          "Yüksek ömür, düşük talaş çıktısı; yüzey pürüzlülüğü iyileşir",
          "Hassasiyet: diş formunu doğrudan üretmek için kalıp/doğruluk kritik",
        ],
      },
      {
        title: "4.5 Zımbalama",
        points: [
          "Önce sac/ince kesit dişli parçalar için hızlı yöntem",
          "Kalıp ömrü ve kenar çizgisinin bükülme riskleri",
          "Ses ve hassasiyet gerektiren uygulamalarda sınırlı",
        ],
      },
      {
        title: "4.6 Plastik – Püskürtme Kalıp Dişliler",
        points: [
          "Büzülme ve nem alımı nedeniyle boyutsal düzeltme gereksinimi",
          "Profil modifikasyonu ve çarpılmayı azaltacak kalıp tasarımı",
          "Yüzey kalitesi ve NVH: malzeme seçimi (PA, POM vb.) ve katkının etkisi",
        ],
      },
      {
        title: "4.7 Sinterleme",
        points: [
          "Gözeneklilik → yağ emdirme ile kendiliğinden yağlama",
          "Boyutsal tolerans: sinterleme sonrası kalibrasyon/coining ihtiyacı",
          "Isıl işlem ve infiltrasyon ile mekanik dayanım iyileştirme",
        ],
      },
      {
        title: "4.8 Broşlama",
        points: [
          "İç dişli ve spline için tek geçişte yüksek doğruluk",
          "Takım maliyeti yüksek; seri üretimde verimli",
          "Çap ve diş sayısı arttıkça broş boyu/maliyeti artar",
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
      "PDF’de detaylı anlatılan yağlama stratejileri. Çevre hızı ve kuvvet-hız faktörüne göre seçim yapılır; tablo 1.1/1.2 referans alınabilir.",
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
          "Tablo 1.1 ve 1.2 (12_05_dislilerin_uretimi) doğrudan işlenebilir.",
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
        title: "6.4 Kuvvet–Hız Faktörü (ks / vç)",
        points: [
          "ks (N/mm) ve çevre hızı vç (m/s) birlikte değerlendirilir; yağ filmi kalınlığı ve sıcaklık artışı kontrol edilir.",
          "Hesaplayıcı planı: ks girişi, vç hesap, önerilen ISO VG ve yağlama tipi.",
        ],
      },
      {
        title: "6.5 Isı Tahkiki",
        points: [
          "Güç kaybı → ısı oluşumu; banyoda sıcaklık artışı tahmini gerekir.",
          "Püskürtmede yağ debisi ve dönüş hattı soğutması planlanmalı.",
          "Sıcaklık kontrolü için ısı eşanjörü/soğutucu entegrasyonu.",
        ],
      },
      {
        title: "6.6 Köpüklenme, Taşma, Soğutma",
        points: [
          "Köpük önleyici katkılar ve uygun yağ seviyesi ile taşma riski azaltılır.",
          "Havalandırma/tahliye (breather) tasarımı; dönüş hattında hava ayrıştırma.",
          "Nozul yerleşimi yanlışsa sıçratma kaybı ve köpük artar; görsel kontrol önerilir.",
        ],
      },
    ],
  },
  {
    title: "7. Dişli Konstrüksiyon İncelikleri",
    intro: "PDF’deki kritik tasarım nüansları: göbek, disk/kaburga ve mil geçmesi.",
    items: [
      {
        title: "7.1 Göbek Tasarımı",
        points: [
          "dGD ≥ 1.5·dM kriteri (göbek dış çapı ≥ 1.5×dişli modülü*diş sayısı / π).",
          "Dolu malzeme – dövme – döküm karşılaştırması: dayanım, maliyet, çarpılma riskleri.",
          "Transport delikleri ve ağırlık optimizasyonu; balansı etkilemeyecek simetrik yerleşim.",
          "Kaynak notu: 12_05_dislilerin_uretimi.",
        ],
      },
      {
        title: "7.2 Disk – Kaburga Tasarımı",
        points: [
          "Disk açısı 8–12°: rijitlik ve dökümde kalıp çıkarma kolaylığı.",
          "Kaburga kalınlığı: moment yolu ve kaynak/döküm kalitesiyle uyumlu seçilmeli.",
          "Çember et kalınlığı: termal/işleme payı ve mukavemet için minimum et.",
          "Kol sayısı: zK ≈ 0.125·d (hızlı başlangıç kuralı); simetri ve balans dikkate alınır.",
          "Kaynak notu: 12_05_dislilerin_uretimi.",
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
        title: "8.1 Standartlar",
        points: [
          "DIN 3960–3967: kalite sınıfları, profil/hatve sapması tanımları.",
          "ISO 1328: helis/düz dişliler için genel tolerans ve kalite sınıfları.",
          "Kontrol yöntemleri: hatve, profil ve runout ölçümleri.",
        ],
      },
      {
        title: "8.2 Profil Sapması",
        points: [
          "Tipik sapmalar: profile slope, profile form error.",
          "Düzeltmeler: profil modifikasyonu (tip relief) ile dağılımı iyileştirme.",
          "Taşlama sonrası profil hassasiyeti yükselir; yanık ve fazla malzeme alımına dikkat.",
        ],
      },
      {
        title: "8.3 Hatve Sapması",
        points: [
          "Tek hatve, toplam hatve, kumulatif sapma kontrolleri.",
          "Helisli dişlilerde hatve ölçümünde helis açısına bağlı düzeltme.",
          "Raspalama/taşlama ile hatve dağılımı iyileşir; ölçüm cihazı seçimi kritik.",
        ],
      },
      {
        title: "8.4 Tipik Üretim Toleransları",
        points: [
          "Kaba işleme vs ince işleme: hedef kalite sınıfına göre tolerans daraltma.",
          "DIN kalite sınıfları için örnek tolerans aralıkları (p, f, F).",
          "Isıl işlem sonrası deformasyon payı ve taşlama payı planlama.",
        ],
      },
      {
        title: "8.5 Taşlama Sonrası Kalite Artırma",
        points: [
          "Raspalama ve taşlamanın toleransa etkisi: PDF’de mükemmel açıklama (12_05_dislilerin_uretimi).",
          "Taşlama yanığı ve mikro yapı bozulması riskine karşı proses kontrolü.",
          "Superfinish/honing ile pürüzlülük ve NVH iyileştirmesi.",
        ],
      },
    ],
  },
  {
    title: "9. Dişli Arızaları ve Analizleri",
    intro: "Saha ve test arızaları; fotoğraf/şema ile desteklenebilir. Pitting, scuffing, kırılma ve hizasızlık etkileri.",
    items: [
      {
        title: "9.1 Pitting (Yüzey Çukurlaşması)",
        points: [
          "Yüksek yüzey basıncı ve yağ filmi yetersizliğinde mikro çukurlaşma.",
          "Önleme: doğru viskozite, yüzey pürüzlülüğü iyileştirme, yük dağılımı (helis, profil modifikasyonu).",
          "Foto notu: çukur alanlar genelde hatve doğrultusunda ilerler.",
        ],
      },
      {
        title: "9.2 Scuffing (Yapışma/Aşınma)",
        points: [
          "Yüksek kayma + sıcaklık → film kopması; diş yanaklarında mavi/kahverengi renklenme.",
          "Önleme: EP katkılı yağ, doğru viskozite, yüzey ısısını kontrol (püskürtme yağlama).",
          "Foto notu: sürtünme yönünde çizgisel aşınma izleri.",
        ],
      },
      {
        title: "9.3 Bending Fracture (Diş Dibi Kırığı)",
        points: [
          "Yüksek Ft + çentik etkisi → diş dibi çatlağı/kırığı.",
          "Önleme: yeterli diş dibi emniyeti (SF), uygun fillet yarıçapı, kontrollü ısıl işlem.",
          "Foto notu: kökten başlayan kırık yüzey; çoğunlukla tek taraflı yük yönünde.",
        ],
      },
      {
        title: "9.4 Tooth Tip Fracture (Diş Ucu Kırığı)",
        points: [
          "Yanlış temas çizgisi veya aşırı backlash → diş ucu darbeleri.",
          "Önleme: doğru backlash ayarı, profil modifikasyonu, hizalama kontrolü.",
          "Foto notu: diş ucunda lokal kopma ve kırık yüzeyi.",
        ],
      },
      {
        title: "9.5 Worn Flank (Yan Yüzey Aşınması)",
        points: [
          "Yağlama yetersizliği veya kontaminasyon → parlatılmış/aşınmış yanak.",
          "Önleme: filtre/temizlik, uygun yağ değişimi, pürüzlülük kontrolü.",
          "Foto notu: geniş yüzeyde parlak aşınma izi, pittingten farklı olarak çukursuz.",
        ],
      },
      {
        title: "9.6 Hizasızlık Kaynaklı Arızalar",
        points: [
          "Yanlış hizalama → kenar yüklenmesi, lokal pitting/scuffing.",
          "Önleme: şim/mesnet ayarı, lead correction/crowning ile yük dağılımı düzeltme.",
          "Foto notu: sadece bir kenarda yoğun hasar veya renk değişimi.",
        ],
      },
      {
        title: "9.7 Yanlış Yağ Viskozitesi Etkileri",
        points: [
          "Düşük viskozite: film kopması, scuffing/pitting riski.",
          "Yüksek viskozite: sürtünme/ısı artışı, enerji kaybı ve köpüklenme.",
          "Önleme: çevre hızı + ks/vç faktörüne göre doğru ISO VG seçimi; köpük önleyici katkı ve doğru yağ seviyesi.",
        ],
      },
    ],
  },
  {
    title: "10. Online Hesaplayıcılar",
    intro:
      "Modül, oran, kuvvet, backlash, helis aksiyel kuvvet ve yağ viskozitesi seçici gibi etkileşimli araçlar. Ayrı sayfada başlatılabilir.",
    items: [
      {
        title: "10.1 Modül Hesaplayıcı",
        points: [
          "Dişli boyutu ve diş sayısına göre modül hesaplama/öneri.",
          "Plan: diş sayısı, çap, hedef kalite girişi; modül ve tolerans çıktısı.",
        ],
      },
      {
        title: "10.2 Dişli Oranı Hesaplayıcı",
        points: [
          "z1 / z2 veya d1 / d2 ile oran ve devir ilişkisi.",
          "Plan: rpm ve diş sayısı girişi; çıkışta tork ve devir eşlemesi.",
        ],
      },
      {
        title: "10.3 Çevresel Kuvvet – Tork Hesaplayıcı",
        points: [
          "Ft = 2·T / d; Fr, Fa (heliste) otomatik hesap.",
          "Plan: güç, rpm, çap/modül girişi; Ft/Fr/Fa çıktısı.",
        ],
      },
      {
        title: "10.4 Helis Dişli Aksiyel Kuvvet Hesaplayıcı",
        points: [
          "Fa = Ft·tanβ; helis açısı ve basınç açısıyla otomatik hesap.",
          "Plan: β, α, güç, rpm girişi; Fa ve yatak yükü çıktısı.",
        ],
      },
      {
        title: "10.5 Backlash Hesaplayıcı",
        points: [
          "Min/nom/max backlash; helis/düz dişli için tolerans tabanlı.",
          "Plan: modül, kalite sınıfı, sıcaklık farkı girişi; backlash sınırları çıktısı.",
        ],
      },
      {
        title: "10.6 Kontak Oranı Hesaplayıcı",
        points: [
          "εα ve εβ hesapları; profil/hatve oranı ile gürültü tahmini.",
          "Plan: modül, basınç açısı, diş sayısı, helis açısı girişi; temas oranı çıktısı.",
        ],
      },
      {
        title: "10.7 Yağ Viskozitesi Seçici (ks/vç grafiği)",
        points: [
          "ks ve çevre hızı vç girişiyle ISO VG önerisi.",
          "Plan: tablo 1.1/1.2 referanslı; daldırma/püskürtme seçimi.",
        ],
      },
      {
        title: "10.8 Dişli Ağırlığı – Gövde Optimizasyon Hesaplayıcı",
        points: [
          "Dişli geometrisi + boşaltma delikleri/kaburga sayısı ile ağırlık tahmini.",
          "Plan: d, b, malzeme yoğunluğu, boşaltma oranı girişi; ağırlık ve tasarruf çıktısı.",
        ],
      },
    ],
  },
  {
    title: "11. Dişli Üretim Simülasyonları",
    intro: "Üniversite ve meslek lisesi öğrencileri için hareket/işleme animasyonları; ayrı sayfada açılabilir.",
    items: [
      {
        title: "11.1 MAAG Sistemi Hareket Animasyonu",
        points: [
          "Planya stroku ve kremayer bıçak hareketi senkronu.",
          "Çift yüzey işleme diyagramı; hız ve strok ayarı gösterimi.",
        ],
      },
      {
        title: "11.2 FELLOW Sistemi Dinamiği",
        points: [
          "Dişli şeklinde kesici ile yukarı çıkışta dönüş – aşağı inişte kesme hareketi.",
          "Kesici/iş parçası senkronizasyonu; eğik tabla ayarı görselleştirme.",
        ],
      },
      {
        title: "11.3 Azdırma (Hobbing) Kesim Animasyonu",
        points: [
          "Hob sarmal hareketi, besleme yönleri (radyal/eksenel) ve helis açısı ayarı.",
          "Çok ağızlı hob aşınma ve yüzey oluşumunun gösterimi.",
        ],
      },
      {
        title: "11.4 Taşlama Simülasyonu",
        points: [
          "Profil taşlama vs form taşlama; yanma riski ve soğutma akışı görselleştirme.",
          "Honing/superfinish sonrası pürüzlülük etkisi.",
        ],
      },
      {
        title: "11.5 Döküm Soğuma Animasyonu",
        points: [
          "Besleyici/maça yerleşimi ve katılaşma sırası; büzülme risk alanları.",
          "Soğutma kanalı/izolasyon ile kusur önleme senaryoları.",
        ],
      },
    ],
  },
];

export default function GearDesignPage() {
  return (
    <PageShell>
      <ToolDocTabs slug="gear-design">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_24%)]" />
        <div className="relative space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
              Dişli Hesaplamaları ve Dişli Tasarım İncelikleri
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              Geliştiriliyor
            </span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">
            Dişli temelleri, tipleri, hesaplamalar ve üretim metotları için açılır bilgi kartları
          </h1>
          <p className="text-sm leading-relaxed text-slate-700">
            Dört ana başlık altında açılır kartlar: (1) Temeller, (2) Tipler, (3) Hesaplamalar, (4) Üretim
            metotları. Her kartı genişleterek maddeleri okuyabilirsin; ileride hesap modülleri ve PDF bağlantıları
            eklenecek.
          </p>
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
                    href="/tools/gear-design/calculators"
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
                  >
                    Online hesaplayıcıları aç
                    <span className="text-[12px]">→</span>
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                  Açılır kartlar
                </span>
                {section.title.startsWith("11.") && (
                  <Link
                    href="/tools/gear-design/simulations"
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100"
                  >
                    Simülasyon sayfasını aç
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
                      {idx === 0 ? "Açık" : "Aç"}
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


