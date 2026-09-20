import type { Locale } from "@/utils/locale";

type LocalizedSupplement = Partial<Record<Locale, string>>;

/**
 * Editorial additions for compact glossary entries. These are intentionally
 * topic-specific so short definitions become useful engineering references,
 * rather than being padded with repeated boilerplate.
 */
const glossarySupplements: Record<string, LocalizedSupplement> = {
  "additive-manufacturing": {
    tr: `
## Mühendislikte yorumlama

Katmanlı imalatta parça yönü, katman yüksekliği, doluluk, destek ihtiyacı ve anizotropi birlikte değerlendirilir. Aynı CAD geometrisi farklı yönlendirmelerde farklı çekme, eğilme ve yüzey kalitesi gösterebilir. Prototip ile son kullanım parçası arasındaki fark açıkça yazılmalı; proses doğrulaması yapılmadan baskı parçası kritik bir emniyet elemanı olarak kabul edilmemelidir.

## Kontrol noktaları

- Tasarımda minimum et kalınlığı, kaçış kanalı ve destek temizleme erişimini kontrol et.
- Malzeme veri sayfasındaki baskı yönü, sıcaklık ve son işlem koşullarını kaydet.
- Ölçüsel doğruluğu ve mekanik dayanımı numune parça üzerinde doğrula.
`,
  },
  ansi: {
    en: `
## Engineering interpretation

ANSI is not a substitute for the exact product or application standard. The drawing should identify the applicable document, revision, dimensional system, and acceptance criteria. A reference to an ANSI family alone does not define material grade, pressure rating, fit, or inspection method.

## Practical checklist

- Record the exact standard designation and edition used by the project.
- Confirm whether the requirement is dimensional, safety-related, or performance-related.
- Check supplier certificates and inspection records against the same designation.
`,
    tr: `
## Mühendislikte yorumlama

ANSI ifadesi tek başına belirli bir ürün, malzeme veya basınç sınıfını tanımlamaz. Çizimde ilgili standardın tam kodu, revizyonu, ölçü sistemi ve kabul kriteri belirtilmelidir. Standart ailesi ile uygulama standardını birbirine karıştırmak, tedarik ve muayene aşamasında belirsizlik oluşturur.

## Kontrol noktaları

- Kullanılan dokümanın tam kodunu ve baskısını kaydet.
- Gereksinimin ölçü, güvenlik veya performans şartı olduğunu ayır.
- Tedarikçi sertifikasını aynı kod ve revizyonla karşılaştır.
`,
  },
  asme: {
    tr: `
## Mühendislikte yorumlama

ASME referansı, özellikle basınçlı ekipman ve borulamada tasarım, imalat, muayene ve dokümantasyon şartlarını etkileyebilir. Hangi bölümün uygulandığı açıkça belirtilmeden yalnızca “ASME uyumlu” ifadesi yeterli değildir. Malzeme, kaynak prosedürü, test basıncı ve yetkili muayene kapsamı ayrıca doğrulanmalıdır.

## Kontrol noktaları

- Tasarım hesabında kullanılan bölüm ve revizyonu proje dosyasına ekle.
- Tasarım basıncı, sıcaklığı ve malzeme grubu ile hesap varsayımlarını eşleştir.
- Kaynak ve test kayıtlarının satın alma şartlarıyla uyumunu kontrol et.
`,
  },
  astm: {
    tr: `
## Mühendislikte yorumlama

ASTM dokümanları çoğu zaman malzeme sınıfını veya test yöntemini tanımlar; ancak bir parçanın tüm tasarım uygunluğunu tek başına kanıtlamaz. Örneğin çekme testi sonucu, yorulma, korozyon, kaynaklanabilirlik veya gerçek servis sıcaklığı hakkında sınırlı bilgi verir. Sertifika üzerindeki test yönü, ısıl işlem ve parti bilgisi mutlaka okunmalıdır.

## Kontrol noktaları

- Malzeme sınıfı ile test yönteminin tam kodunu ayırarak kaydet.
- Numunenin parti, ısıl işlem ve yön bilgisini doğrula.
- Tasarım yükleri için gerekli ek test veya üretici verisini ayrıca iste.
`,
  },
  backlash: {
    tr: `
## Mühendislikte yorumlama

Backlash, dişli çiftinde yön değişimi sırasında oluşan kayıp hareketin önemli nedenlerinden biridir. Çok küçük seçilirse termal genleşme, imalat sapması ve yağlama filmi için pay kalmayabilir; çok büyük seçilirse konumlama hatası, darbe ve gürültü artabilir. Değer, merkez mesafesi ve çalışma sıcaklığıyla birlikte değerlendirilmelidir.

## Kontrol noktaları

- Ölçümü yük altında ve yük yönü değiştirilirken tanımla.
- Dişli modülü, helis açısı, merkez mesafesi ve yağlama koşullarını kaydet.
- Boşluk toleransını pozisyonlama doğruluğu ve termal pay ile karşılaştır.
`,
  },
  casting: {
    en: `
## Engineering interpretation

Casting design depends on alloy, mold process, solidification, draft, feeding, and expected defects. A cast geometry that is acceptable for sand casting may be unsuitable for die casting or investment casting. Wall transitions, shrinkage allowances, cores, and inspection access should be reviewed before the drawing is released.

## Practical checklist

- Identify the casting process and its dimensional capability.
- Avoid abrupt section changes and provide practical draft and fillets.
- Define porosity, surface, dimensional, and pressure-test acceptance criteria.
`,
    tr: `
## Mühendislikte yorumlama

Döküm tasarımı alaşım, kalıp prosesi, katılaşma, model çekmesi, çıkma açısı ve beklenen kusurlara bağlıdır. Kum döküm için uygun bir geometri basınçlı döküm için uygun olmayabilir. Et kalınlığı geçişleri, besleyici ihtiyacı, maça erişimi ve muayene yöntemi çizim yayımlanmadan değerlendirilmelidir.

## Kontrol noktaları

- Döküm prosesini ve prosesin ölçüsel kabiliyetini tanımla.
- Ani kesit değişimlerinden kaçın; radyüs ve çıkma açısını kontrol et.
- Gözeneklilik, yüzey, ölçü ve basınç testi kabul kriterlerini yaz.
`,
  },
  cavitation: {
    tr: `
## Mühendislikte yorumlama

Kavitasyon yalnızca pompa seçimiyle ilgili değildir; emiş hattı kaybı, sıvı sıcaklığı, atmosfer basıncı ve pompanın çalışma noktası birlikte belirleyicidir. Sıvı sıcaklığı yükseldikçe buhar basıncı artar ve kullanılabilir emiş payı azalabilir. Belirti olarak gürültü, titreşim, debi düşüşü ve çark yüzeyinde oyuklanma görülebilir.

## Kontrol noktaları

- NPSH mevcut değerini üretici NPSH ihtiyacıyla aynı debide karşılaştır.
- Emiş hattını kısalt, gereksiz dirsek ve daralmaları azalt.
- Sıcaklık, seviye ve filtre tıkanıklığını gerçek çalışma koşulunda kontrol et.
`,
  },
  clearance: {
    tr: `
## Mühendislikte yorumlama

Açıklık, parçaların birbirine temas etmeden hareket veya montaj yapabilmesi için bırakılan kontrollü farktır. Nominal ölçülerin farkı tek başına yeterli değildir; maksimum malzeme koşulu, tolerans birikimi, sıcaklık değişimi, yüzey pürüzlülüğü ve beklenen kirlenme de hesaba katılmalıdır. İşlev için gerekli en küçük açıklık ile üretilebilir en büyük açıklık ayrı kontrol edilmelidir.

## Kontrol noktaları

- Açıklığı minimum ve maksimum tolerans kombinasyonlarında hesapla.
- Termal genleşme ve hizalama hatası için pay bırak.
- Montaj sırasında sıkışma, çalışma sırasında temas ve bakım erişimini doğrula.
`,
  },
  cnc: {
    tr: `
## Mühendislikte yorumlama

CNC başarısı yalnızca takım yoluna değil, parça rijitliği, bağlama düzeni, takım çıkıntısı, kesme parametreleri ve ölçüm planına bağlıdır. Tasarım aşamasında takım erişimi, iç köşe radyüsü ve bağlama yüzeyleri düşünülmezse makineleme süresi veya yeniden bağlama hatası artar. CAD/CAM simülasyonu fiziksel çarpışma kontrolünün yerini tamamen tutmaz.

## Kontrol noktaları

- Malzeme ve takım üreticisinin hız, ilerleme ve kesme derinliği aralığını kullan.
- Kritik ölçüler için datum ve ölçüm sırasını tanımla.
- İlk parça doğrulamasında takım aşınması ve bağlama tekrarlanabilirliğini kaydet.
`,
  },
  concentricity: {
    tr: `
## Mühendislikte yorumlama

Konsantriklik, ortak merkez gerektiren döner parçalarda fonksiyonel bir hizalama göstergesidir; ancak ölçüm yöntemi tanımlanmadan yalnızca sembol kullanmak yeterli değildir. Mil, delik, rulman yatağı veya sızdırmazlık çapı için hangi referans eksenin esas alınacağı açık olmalıdır. Bazı uygulamalarda toplam salınım veya konum toleransı daha doğrudan kontrol edilebilir.

## Kontrol noktaları

- Referans eksenini ve ölçüm datumunu çizimde açıkça belirt.
- Parçayı hangi bağlama ve dönme koşulunda ölçeceğini tanımla.
- Ölçülen sapmayı rulman, keçe, kaplin ve titreşim gereksinimleriyle karşılaştır.
`,
  },
  "corrosion-resistance": {
    tr: `
## Mühendislikte yorumlama

Korozyon direnci malzemenin sabit bir etiketi değildir; ortamın klorür, pH, nem, sıcaklık, akış ve temas ettiği diğer metallerle birlikte değişir. Paslanmaz çelik seçimi, kaplama veya boya çözümü kadar yüzey hazırlığı, drenaj ve galvanik çiftlerin yönetimi de önemlidir. Tasarım ömrü ve kabul edilebilir bakım sıklığı baştan tanımlanmalıdır.

## Kontrol noktaları

- Ortam kimyasını ve sıcaklık aralığını veri sayfasıyla eşleştir.
- Su tutan cepler, keskin kaplama geçişleri ve farklı metal temaslarını azalt.
- Numune testi, kaplama kalınlığı ve bakım planını teknik dosyaya ekle.
`,
  },
  datum: {
    tr: `
## Mühendislikte yorumlama

Datum, ölçümde kullanılan keyfi bir çizgi değil, parçanın montajda nasıl konumlandığını temsil eden işlevsel referanstır. Birincil, ikincil ve üçüncül datum sırası parçanın altı serbestlik derecesini kontrollü biçimde kısıtlamalıdır. Ölçüm fikstürü ile gerçek montaj fikstürü farklı davranıyorsa, uygun görünen sonuç fonksiyonu garanti etmeyebilir.

## Kontrol noktaları

- Datum sırasını montajdaki temas sırasına göre seç.
- Referans yüzeyin yeterli alan, rijitlik ve temizlenebilirliğe sahip olduğunu doğrula.
- Ölçüm cihazı, bağlama kuvveti ve datum simülasyonunu kontrol planına yaz.
`,
  },
  din: {
    tr: `
## Mühendislikte yorumlama

DIN numarası bir ürünün tüm performansını değil, belirli bir boyut, sınıf veya teknik gereksinim setini ifade eder. Güncel EN veya ISO karşılığının projede zorunlu olup olmadığı ve tedarikçinin hangi revizyonu kullandığı kontrol edilmelidir. Özellikle bağlantı elemanlarında diş, başlık, dayanım sınıfı, kaplama ve tolerans birlikte yazılmalıdır.

## Kontrol noktaları

- Standardın tam kodunu, bölümünü ve revizyonunu kaydet.
- Eski DIN kodunun güncel karşılığıyla teknik eşdeğerliğini doğrula.
- Çizim ve satın alma metninde ölçü ile malzeme sınıfını ayrı belirt.
`,
  },
  ductility: {
    en: `
## Engineering interpretation

Ductility is commonly described with elongation or reduction of area, but the reported value depends on specimen geometry, test direction, temperature, and strain rate. It should not be treated as a direct replacement for fracture toughness or fatigue data. A ductile material can still fail if the section, stress concentration, or environment is unsuitable.

## Practical checklist

- Use data from the same material condition and temperature range.
- Review forming strain, weld heat-affected zones, and notch sensitivity.
- Separate yield, ultimate, fatigue, and fracture requirements in the design record.
`,
    tr: `
## Mühendislikte yorumlama

Süneklik genellikle kopma uzaması veya kesit daralmasıyla raporlanır; ancak sonuç numune geometrisi, test yönü, sıcaklık ve şekil değiştirme hızına bağlıdır. Süneklik, kırılma tokluğu veya yorulma verisinin yerine doğrudan kullanılamaz. Sünek bir malzeme de kesit zayıflığı, çentik veya uygunsuz ortam nedeniyle hasar görebilir.

## Kontrol noktaları

- Aynı malzeme durumu ve sıcaklık aralığındaki test verisini kullan.
- Şekil verme, kaynak ısı tesiri ve çentik hassasiyetini ayrıca değerlendir.
- Akma, çekme, yorulma ve kırılma şartlarını tasarım dosyasında ayır.
`,
  },
  forging: {
    en: `
## Engineering interpretation

Forging can improve directional strength and reduce some casting-related defects, but the result depends on die design, reduction, grain flow, heat treatment, and machining allowance. A forged part is not automatically stronger in every direction. The material condition and required inspection level should be specified with the part drawing.

## Practical checklist

- Define forging direction and critical load direction.
- Allow for die parting, draft, flash removal, and heat-treatment distortion.
- Confirm grain-flow, hardness, dimensional, and non-destructive-test requirements.
`,
    tr: `
## Mühendislikte yorumlama

Dövme, lif akışını yönlendirerek ve bazı döküm kusurlarını azaltarak avantaj sağlayabilir; ancak sonuç kalıp tasarımı, şekil değiştirme oranı, lif yönü ve ısıl işleme bağlıdır. Dövme parça her yönde otomatik olarak daha dayanıklı değildir. Malzeme durumu ve muayene seviyesi çizimde veya satın alma şartında açıkça yazılmalıdır.

## Kontrol noktaları

- Dövme yönünü kritik yük yönüyle birlikte tanımla.
- Kalıp ayırma çizgisi, çıkma açısı, çapak temizleme ve işleme payını kontrol et.
- Lif akışı, sertlik, ölçü ve tahribatsız muayene şartlarını doğrula.
`,
  },
  gdt: {
    tr: `
## Mühendislikte yorumlama

GD&T, ölçüleri sıkılaştırmak için kullanılan bir sembol listesi değil, parçanın fonksiyonunu tarif eden bir kontrol dilidir. Tolerans bölgesi, datum referansı, malzeme koşulu ve gerçek montaj ilişkisi birlikte okunmalıdır. Gereksiz geometrik toleranslar üretim ve ölçüm maliyetini artırırken, eksik fonksiyonel toleranslar montaj sorununu gizleyebilir.

## Kontrol noktaları

- Her sembol için hangi fonksiyonu koruduğunu yaz.
- Datum sırasını montaj ve ölçüm fikstürüyle doğrula.
- Toleransın ölçülebilir bir yöntem ve kabul kriteriyle eşleştiğini kontrol et.
`,
  },
  grinding: {
    en: `
## Engineering interpretation

Grinding is often selected for tight size, form, and surface requirements, but heat generation and wheel condition can damage the result. Coolant delivery, dressing, workholding, spark-out, and inspection temperature all matter. A low roughness value alone does not prove that form, residual stress, or dimensional stability is acceptable.

## Practical checklist

- Define size, roundness, waviness, roughness, and inspection method separately.
- Check burn risk, dressing interval, coolant filtration, and thermal distortion.
- Inspect the functional datum and the finished surface at a controlled temperature.
`,
    tr: `
## Mühendislikte yorumlama

Taşlama dar ölçü, form ve yüzey şartları için seçilir; ancak oluşan ısı taşlama yanığına, artık gerilmeye veya ölçü kaymasına yol açabilir. Soğutma, taş bileme, bağlama, kıvılcım kesme süresi ve ölçüm sıcaklığı birlikte kontrol edilmelidir. Düşük pürüzlülük tek başına form ve boyutsal kararlılık kanıtı değildir.

## Kontrol noktaları

- Boyut, yuvarlaklık, dalgalılık, pürüzlülük ve ölçüm yöntemini ayrı tanımla.
- Yanma riskini, taş bileme aralığını ve soğutma filtrasyonunu kontrol et.
- Fonksiyonel datum ve bitmiş yüzeyi kontrollü sıcaklıkta ölç.
`,
  },
  hardness: {
    tr: `
## Mühendislikte yorumlama

Sertlik, yüzey veya hacmin batmaya karşı direncini gösteren pratik bir göstergedir; çekme dayanımıyla her malzeme ve ısıl işlem için aynı oranda ilişkili değildir. Ölçüm yöntemi, yük, yüzey hazırlığı ve parça kalınlığı sonucu etkiler. Özellikle sementasyon veya nitrasyon gibi yüzey işlemlerinde yüzey sertliği ile çekirdek sertliği ayrı raporlanmalıdır.

## Kontrol noktaları

- HRC, HB, HV gibi yöntemi ve kabul aralığını belirt.
- Ölçüm noktalarının kenar, delik ve yüzey pürüzlülüğünden etkilenmediğini doğrula.
- Sertliği aşınma, işlenebilirlik ve tokluk hedefleriyle birlikte değerlendir.
`,
  },
  interference: {
    tr: `
## Mühendislikte yorumlama

Girişim, mil ile delik arasındaki pozitif çap farkıdır ve pres geçme veya ısıl montajda yük aktarımı sağlar. Minimum girişim kaymayı önlemeye, maksimum girişim ise göbekteki çevresel gerilme ve montaj hasarına karşı kritiktir. Yüzey pürüzlülüğü, elastik-plastik davranış ve sıcaklık farkı gerçek temas koşulunu değiştirir.

## Kontrol noktaları

- Mil ve delik toleranslarından minimum/maksimum girişimi ayrı hesapla.
- İnce cidarlı göbekte gerilme ve deformasyonu kontrol et.
- Montaj kuvveti, ısıtma sıcaklığı ve sökme prosedürünü üretim planına ekle.
`,
  },
  iso: {
    tr: `
## Mühendislikte yorumlama

ISO adı geniş bir standart ailesini ifade eder; yalnızca “ISO uyumlu” yazmak teknik gereksinimi tanımlamaz. Standardın numarası, bölümü, revizyonu ve projede hangi maddeye atıf yapıldığı belirtilmelidir. Bir ISO standardı ölçüleri tanımlarken başka bir standart malzeme, test veya kalite şartını tanımlayabilir.

## Kontrol noktaları

- Standardın tam numarasını ve güncel baskısını teknik dosyada tut.
- Tedarikçi beyanını ilgili madde ve kabul kriterleriyle karşılaştır.
- Ulusal veya müşteri şartlarının ISO referansından daha kısıtlayıcı olup olmadığını kontrol et.
`,
  },
  "laminar-flow": {
    tr: `
## Mühendislikte yorumlama

Laminer akışta akışkan tabakaları daha düzenli hareket eder ve viskozite etkisi baskındır. Boru hesabında Reynolds sayısı, hidrolik çap ve çalışma sıcaklığındaki viskozite birlikte kullanılmalıdır; geçiş bölgesinde tek bir rejim varsayımı hatayı büyütebilir. Çok düşük debi, yüksek viskozite ve küçük hidrolik çap laminer davranışı destekler.

## Kontrol noktaları

- Reynolds sayısını yerel özelliklerle ve gerçek kesitle hesapla.
- Kanal geometrisinde hidrolik çapı kullan.
- Giriş bölgesi, bağlantı elemanları ve sıcaklık değişimini basit modelin sınırı olarak belirt.
`,
  },
  machining: {
    tr: `
## Mühendislikte yorumlama

Makineleme yöntemi tolerans, yüzey pürüzlülüğü, malzeme sertliği, parti büyüklüğü ve takım erişimine göre seçilir. Aynı ölçü torna, freze veya taşlama ile farklı maliyet ve yüzey davranışıyla elde edilebilir. Tasarımda gereksiz dar tolerans ve erişilemeyen iç köşe, parçanın işlenebilirliğini düşürür.

## Kontrol noktaları

- Kritik ölçü için proses kabiliyeti ve ölçüm yöntemini eşleştir.
- Takım çapı, iç köşe radyüsü ve bağlama erişimini CAD/CAM öncesi kontrol et.
- İlk parça ölçümlerini takım aşınması ve proses trendiyle birlikte değerlendir.
`,
  },
  parallelism: {
    tr: `
## Mühendislikte yorumlama

Paralellik, bir yüzeyin veya eksenin referans datumuna göre yönelimini kontrol eder; tek başına iki yüzey arasındaki mesafenin sabit olduğunu garanti etmez. Yüzeyin form hatası, datum seçimi ve ölçüm fikstürü sonucu etkiler. Fonksiyonel gereksinim gerçekten düzlemsellik, paralellik veya konum kontrolü mü istiyor ayrıştırılmalıdır.

## Kontrol noktaları

- Referans datumunu montaj fonksiyonuna göre seç.
- Tolerans bölgesini, yüzey formunu ve ölçüm cihazını tanımla.
- Ölçüm sonucunu kayma, sızdırmazlık veya yataklama fonksiyonuyla ilişkilendir.
`,
  },
  "power-factor": {
    tr: `
## Mühendislikte yorumlama

Güç faktörü, AC sistemde gerçek gücün görünür güce oranıdır ve motorun veya tesisin şebekeden çektiği akımı etkiler. Düşük değer aynı gerçek güç için daha yüksek akım, kablo kaybı ve gerilim düşümü anlamına gelebilir. Kondansatör kompanzasyonu seçilirken harmonikler ve yükün değişkenliği ayrıca incelenmelidir.

## Kontrol noktaları

- Gerçek, reaktif ve görünür gücü aynı gerilim/faz varsayımıyla ayır.
- Motorun farklı yük noktalarındaki güç faktörünü kontrol et.
- Kompanzasyonun rezonans ve harmonik riskini tesis koşullarıyla doğrula.
`,
  },
  resistance: {
    tr: `
## Mühendislikte yorumlama

Direnç, gerilim ile akım arasındaki ilişkiyi belirler; fakat gerçek devrede sıcaklık, iletken uzunluğu, kesit, temas direnci ve malzeme özdirenci de hesaba katılır. Bir kablonun direnç kaybı yalnızca nominal ohm değerinden değil, çalışma sıcaklığından da etkilenir. Ölçüm yaparken bağlantı ve temas direnci sonucu bozabilir.

## Kontrol noktaları

- DC/AC koşulunu ve ölçüm frekansını belirt.
- Kablo kesiti, uzunluğu, sıcaklığı ve izin verilen gerilim düşümünü kontrol et.
- Direnç kaynaklı ısınmayı güç kaybı ve soğutma koşuluyla doğrula.
`,
  },
  resonance: {
    tr: `
## Mühendislikte yorumlama

Rezonans riski yalnızca doğal frekans ile çalışma devrinin eşit olmasına indirgenemez; sönüm, mesnet rijitliği, harmonikler ve değişken yükler de önemlidir. Bir sistem rezonans bölgesinden geçerken kısa süreli yüksek genlik yaşayabilir. Bu nedenle kritik makinelerde hız taraması, titreşim ölçümü ve yapısal değişiklik sonrası yeniden doğrulama planlanmalıdır.

## Kontrol noktaları

- Uyarı frekansının temel ve harmoniklerini listele.
- Mesnet, gevşeklik ve dengesizlik etkilerini modal davranıştan ayır.
- Kabul titreşim seviyesini hız aralığı ve ölçüm noktasına göre tanımla.
`,
  },
  rolling: {
    tr: `
## Mühendislikte yorumlama

Haddeleme ile sıcaklık, deformasyon oranı, merdane geometrisi ve paso planı malzeme yapısını ve son ölçüyü etkiler. Sıcak haddeleme şekillendirmeyi kolaylaştırırken soğuk haddeleme yüzey ve ölçü hassasiyeti sağlayabilir, ancak artık gerilme ve anizotropi oluşturabilir. Tasarımda malzemenin hadde yönü kritik yük yönüyle ilişkilendirilmelidir.

## Kontrol noktaları

- Sıcak/soğuk proses ve son ısıl işlem durumunu kaydet.
- Sac veya profilin hadde yönünü çizim ve test numunesinde belirt.
- Düzlük, kalınlık, yüzey ve artık gerilme gereksinimlerini ayrı kontrol et.
`,
  },
  runout: {
    tr: `
## Mühendislikte yorumlama

Salınım, dönen yüzeyin referans eksene göre toplam sapmasını gösterir ve dönme sırasında tek bir ölçümden daha anlamlı olabilir. Radyal ve eksenel salınım yönleri, datum ekseni ve ölçüm yarıçapı açıkça belirtilmelidir. Yatak, keçe ve dişli fonksiyonu için izin verilen salınım aynı olmayabilir.

## Kontrol noktaları

- Toplam salınım ile dairesel salınım gereksinimini ayır.
- Parçayı referans ekseninde, belirlenmiş devir ve ölçüm kuvvetiyle döndür.
- Sonucu rulman, keçe, dişli kavraması ve titreşim limitleriyle karşılaştır.
`,
  },
  stress: {
    tr: `
## Mühendislikte yorumlama

Gerilme, yükün kesit üzerinde nasıl dağıldığını anlatır; yalnızca ortalama kuvvet/bölü alan hesabı çentik, delik, temas veya eğilme etkilerini göstermez. Normal, kayma, eğilme ve burulma bileşenleri aynı kritik bölgede birleşebilir. Tasarım kontrolünde malzeme dayanımı, yük spektrumu ve güvenlik yaklaşımı açıkça yazılmalıdır.

## Kontrol noktaları

- Kritik kesitte gerilme türlerini ve birleşimlerini ayır.
- Gerilme yığılması için geometri veya sonlu eleman doğrulaması kullan.
- İzin verilen gerilmeyi sıcaklık, yorulma ve malzeme durumu ile ilişkilendir.
`,
  },
  "surface-finishing": {
    tr: `
## Mühendislikte yorumlama

Yüzey işlemi seçimi korozyon, sürtünme, aşınma, elektriksel temas, görünüm ve tolerans hedefinin hangisinin baskın olduğuna göre yapılır. Anodize, galvaniz, boya ve pasivasyon aynı koruma mekanizmasına sahip değildir. İşlem öncesi temizlik, maskeleme ve işlem sonrası ölçü değişimi tasarımın parçası olarak tanımlanmalıdır.

## Kontrol noktaları

- Kaplama kalınlığı ve yüzey pürüzlülüğünü fonksiyonla eşleştir.
- Keskin köşe, diş ve temas yüzeylerinde proses birikimini kontrol et.
- Yapışma, kalınlık, renk veya korozyon testinin kabul kriterini yaz.
`,
  },
  "tensile-strength": {
    tr: `
## Mühendislikte yorumlama

Çekme dayanımı kopma öncesindeki en yüksek mühendislik gerilmesini gösterir; tasarımda izin verilen gerilme olarak doğrudan kullanılamaz. Akma dayanımı, kesit geometrisi, çentik, sıcaklık, yükleme hızı ve yorulma çevrimleri farklı sınırlar oluşturabilir. Malzeme sertifikasındaki temper, hadde yönü ve test yönü dikkate alınmalıdır.

## Kontrol noktaları

- Çekme değerini akma ve uzama verisiyle birlikte değerlendir.
- Tasarım emniyet katsayısını ve yük türünü ayrıca belirt.
- Kritik uygulamalarda üretim partisi ve test standardı izlenebilirliğini koru.
`,
  },
  tolerance: {
    tr: `
## Mühendislikte yorumlama

Tolerans, nominal ölçünün çevresindeki kabul aralığıdır; fonksiyon için gereken sınır ile prosesin ekonomik kabiliyeti arasında denge kurar. Tek tek ölçüler uygun görünse bile tolerans zinciri montajda açıklık veya girişim sorununa dönüşebilir. Tolerans seçimi ölçüm yöntemi, sıcaklık ve datum düzeniyle birlikte yazılmalıdır.

## Kontrol noktaları

- Kritik fonksiyon ölçüsünü ve izin verilen boşluk/girişimi önce tanımla.
- En kötü durum ve istatistiksel tolerans yaklaşımını karıştırma.
- Ölçüm belirsizliği ile tolerans genişliğinin uyumlu olduğunu doğrula.
`,
  },
  "turbulent-flow": {
    en: `
## Engineering interpretation

Turbulent flow contains strong mixing and fluctuating eddies, so pressure loss depends on Reynolds number, relative roughness, fittings, and the selected friction-factor method. The same nominal pipe can behave differently when viscosity or temperature changes. A design note should state whether the model includes only straight-pipe loss or also local losses.

## Practical checklist

- Use operating-temperature properties and the actual hydraulic diameter.
- Record the friction-factor correlation and roughness assumption.
- Add valves, bends, entrances, exits, and filters to the system loss budget.
`,
    tr: `
## Mühendislikte yorumlama

Türbülanslı akışta karışım ve girdaplar güçlüdür; basınç kaybı Reynolds sayısı, bağıl pürüzlülük, bağlantı elemanları ve seçilen sürtünme katsayısı yöntemiyle değişir. Aynı nominal boru, sıcaklık veya viskozite değiştiğinde farklı davranabilir. Hesap notunda düz boru kaybı ile lokal kayıpların dahil olup olmadığı yazılmalıdır.

## Kontrol noktaları

- Çalışma sıcaklığındaki özellikleri ve gerçek hidrolik çapı kullan.
- Sürtünme korelasyonunu ve pürüzlülük varsayımını kaydet.
- Vana, dirsek, giriş, çıkış ve filtreleri toplam kayıp bütçesine ekle.
`,
  },
  viscosity: {
    tr: `
## Mühendislikte yorumlama

Viskozite, kayma hızına bağlı davranış gösteren Newton tipi olmayan akışkanlarda tek bir sabit sayı olmayabilir. Dinamik ve kinematik viskozite birbirine yoğunluk üzerinden bağlanır; birimlerin karıştırılması Reynolds sayısı ve pompa hesabını bozabilir. Yağlarda sıcaklık yükseldikçe viskozite genellikle düşer, bu nedenle veri çalışma sıcaklığında seçilmelidir.

## Kontrol noktaları

- Dinamik/kinematik viskozite ve birimi açıkça yaz.
- Sıcaklık-viskozite eğrisini üretici verisinden al.
- Pompa, vana, boru ve yağlama gereksinimlerini aynı çalışma noktasında kontrol et.
`,
  },
  voltage: {
    en: `
## Engineering interpretation

Voltage is a potential difference, not the same as available power. A motor, sensor, or control circuit must be checked for nominal voltage, tolerance, transient behavior, insulation, current demand, and grounding. A 24 V control supply can still produce unacceptable voltage drop if the cable is long or the load changes.

## Practical checklist

- Confirm nominal, minimum, maximum, and transient voltage.
- Check current, cable drop, protection, polarity, and connector rating.
- Separate signal reference and protective-earth requirements where applicable.
`,
    tr: `
## Mühendislikte yorumlama

Voltaj bir potansiyel farkıdır; kullanılabilir güç ile aynı kavram değildir. Motor, sensör veya kontrol devresinde nominal değer, tolerans, geçici darbeler, yalıtım, akım ihtiyacı ve topraklama birlikte kontrol edilmelidir. 24 V kontrol beslemesi, uzun kablo veya değişken yük nedeniyle kabul edilemez gerilim düşümüne sahip olabilir.

## Kontrol noktaları

- Nominal, minimum, maksimum ve geçici gerilim değerlerini doğrula.
- Akım, kablo düşümü, koruma, polarite ve konnektör sınıfını kontrol et.
- Sinyal referansı ile koruyucu toprak gereksinimini gerektiğinde ayır.
`,
  },
  "yield-strength": {
    tr: `
## Mühendislikte yorumlama

Akma dayanımı, kalıcı şekil değişiminin başladığı sınır olarak kullanılır; gerçek parçada yükleme türü, çok eksenli gerilme, sıcaklık ve üretim yönü bu değeri etkileyebilir. Tasarımda akma dayanımından izin verilen gerilmeye geçiş güvenlik katsayısı ve ilgili standardın yaklaşımıyla yapılmalıdır. Çekme dayanımı yüksek bir malzeme, düşük tokluk veya yorulma performansı nedeniyle uygun olmayabilir.

## Kontrol noktaları

- Malzeme durumu, sıcaklık ve test yönünü sertifikadan doğrula.
- Akma ölçütünü ve güvenlik katsayısını hesap notunda belirt.
- Kalıcı deformasyon, yorulma ve burkulma kontrollerini ayrıca yap.
`,
  },
  "youngs-modulus": {
    tr: `
## Mühendislikte yorumlama

Elastisite modülü, gerilme ile elastik birim şekil değiştirme arasındaki eğimi ifade eder ve rijitlik hesabında kullanılır. Dayanım değildir: daha yüksek E değeri daha az elastik deformasyon anlamına gelebilir, ancak akma veya kırılma kapasitesini tek başına belirlemez. Sıcaklık, yönlenme ve kompozitlerde lif doğrultusu değeri değiştirebilir.

## Kontrol noktaları

- Malzemenin sıcaklık ve yön bağımlı E değerini kullan.
- Sehim, burkulma ve titreşim hesabında sınır şartlarını açıkça tanımla.
- Gerilme sınırını E değerinden ayrı olarak akma/izin verilen değerle kontrol et.
`,
  },
};

const guideSupplements: Record<string, LocalizedSupplement> = {
  "akiskan-dinamigi-temelleri-boru-kanal-akisi": {
    tr: `
## Hesap sonucunu doğrulama

Sonucu tek bir sayı olarak değil, debi-sıcaklık-pürüzlülük senaryosu olarak incele. Debi artışında hız ve lokal kayıplar yükselir; boru çapı değiştiğinde pompa çalışma noktası da değişebilir. Son rapora kullanılan akışkan özelliklerini, boru iç çapını ve lokal kayıp katsayılarını yaz.
`,
  },
  "doner-ekipman-dengeleme-titresim-kontrolu": {
    tr: `
## Ölçümün izlenebilirliği

Titreşim trendi ancak aynı sensör yönü, ölçüm noktası, devir ve yük koşuluyla karşılaştırılırsa anlamlıdır. Dengeleme sonrası ölçümü önceki ölçümle aynı kurulumda tekrarla; rulman, kaplin ve temel gevşekliği için ayrı bir kontrol kaydı tut. Kabul limitini ekipmanın üretici verisi veya bakım standardıyla ilişkilendir.
`,
  },
  "isi-yalitimi-termal-genlesme-rehberi": {
    en: `
## Verification notes

Treat insulation and thermal expansion as one system calculation. Record conductivity at the operating temperature, the boundary temperatures, the restraint condition, and the clearance available for movement. If expansion is restrained, check the resulting force or stress rather than applying a free-expansion formula alone.
`,
    tr: `
## Doğrulama notları

Yalıtım ve termal genleşmeyi tek bir sistem hesabı olarak ele al. Çalışma sıcaklığındaki iletkenliği, sınır sıcaklıklarını, bağlantıların kısıtlama durumunu ve hareket için bırakılan boşluğu kaydet. Genleşme kısıtlanıyorsa yalnızca serbest genleşme formülünü kullanma; oluşan kuvvet veya gerilmeyi de kontrol et.
`,
  },
  "kama-tasarimi-101": {
    tr: `
## Tasarım doğrulaması

Kama tasarımında sürtünme katsayısının temiz, yağlı ve aşınmış yüzeylerde değişebileceğini varsay. Kilitlenme eğilimi ile geri sökme ihtiyacını birlikte değerlendir; yalnızca ideal geometriye göre hesaplanan normal kuvvet gerçek montajı temsil etmeyebilir. Temas yüzeyindeki ezilme ve kenar gerilmesini ayrıca kaydet.
`,
  },
  "makine-ogesi-omru-yorulma-rehberi": {
    tr: `
## Sonuçların sınırı

Yorulma ömrü hesabı yük spektrumuna, yüzey durumuna, çentik etkisine, artık gerilmeye ve çevreye duyarlıdır. Sabit genlikli ideal çevrim, değişken yük ve başlatma-durdurma etkilerini temsil etmeyebilir. Kritik parçalarda hesap sonucu prototip testi, tahribatsız muayene veya saha trendiyle doğrulanmalıdır.
`,
  },
  "pompa-turleri-secim-rehberi": {
    tr: `
## Çalışma noktası doğrulaması

Pompa seçimini yalnızca maksimum debiyle yapma; sistem eğrisi ile pompa eğrisinin kesişimini, verimi, motor gücünü ve minimum sürekli debiyi kontrol et. Viskozite veya sıcaklık değişiyorsa üretici düzeltme katsayılarını kullan. NPSH payı, emiş seviyesi ve filtre kaybı ayrı satırlarda izlenebilir olmalıdır.
`,
  },
  "press-fit-baglantilari-tolerans-secimi": {
    en: `
## Verification notes

A press-fit result depends on tolerance limits, surface roughness, material modulus, temperature, and assembly speed. Use minimum interference for load-transfer verification and maximum interference for hub stress and assembly-damage verification. Record whether the joint is assembled cold, by heating, or by cooling, and validate the actual assembly force on the first article.
`,
    tr: `
## Doğrulama notları

Press-fit sonucu tolerans sınırlarına, yüzey pürüzlülüğüne, elastisite modülüne, sıcaklığa ve montaj hızına bağlıdır. Minimum girişimi yük aktarımı için, maksimum girişimi göbek gerilmesi ve montaj hasarı için kontrol et. Bağlantının soğuk, ısıtılarak veya soğutularak monte edildiğini yaz ve ilk parçada gerçek montaj kuvvetini doğrula.
`,
  },
  "titanyum-alasimlari-rehberi": {
    tr: `
## Seçim ve doğrulama

Titanyum seçiminde özgül dayanım kadar elastisite modülü, yüzey teması, galvanik çift ve işleme ısısı da önemlidir. Alaşım ve ısıl işlem durumunu üretici sertifikasıyla doğrula; genel bir “titanyum” etiketi hesap girdisi için yeterli değildir. Kritik parçada yön, yüzey işlemi ve kaynak prosedürünü izlenebilir tut.
`,
  },
  "tolerans-zinciri-ve-gdt-rehberi": {
    en: `
## Verification notes

Start from the functional requirement and work backward to the dimensions that control it. Compare worst-case and statistical stack-up only when the production distribution and independence assumptions are justified. The drawing should connect each critical tolerance to a datum scheme, a measurement method, and an acceptance decision.
`,
    tr: `
## Doğrulama notları

Önce fonksiyon gereksinimini tanımla, ardından bu gereksinimi kontrol eden ölçülere geri dön. En kötü durum ile istatistiksel tolerans zincirini ancak üretim dağılımı ve bağımsızlık varsayımları doğrulanıyorsa karşılaştır. Çizim, her kritik toleransı datum düzeni, ölçüm yöntemi ve kabul kararıyla ilişkilendirmelidir.
`,
  },
  "yuzey-isleme-yontemleri-rehberi": {
    tr: `
## Kabul planı

Yüzey işlemi seçildikten sonra kaplama veya işlem kalınlığının ölçülere, dişlere ve geçmelere etkisini tolerans zincirine ekle. Temizlik, maskeleme, yapışma, kalınlık ve korozyon testlerini prosesin kabul planında tanımla. Görsel görünüm tek başına koruyuculuk veya yapışma kanıtı değildir.
`,
  },
};

export const getContentSupplement = (type: "blog" | "guides" | "glossary" | "qa", slug: string, locale: Locale) => {
  if (type === "glossary") return glossarySupplements[slug]?.[locale] ?? "";
  if (type === "guides") return guideSupplements[slug]?.[locale] ?? "";
  return "";
};
