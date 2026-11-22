import Link from "next/link";
import type { Locale } from "@/utils/locale";
import { withLocalePrefix } from "@/utils/locale-path";

type KeyTableContentProps = {
  locale: Locale;
};

export default function KeyTableContent({ locale }: KeyTableContentProps) {
  if (locale === "tr") {
    return (
      <article className="prose prose-slate max-w-none space-y-10 text-slate-700">
        {/* Bölüm 1: DIN 6885-1 ve ISO 773 Standart İlkeleri */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            DIN 6885-1 ve ISO 773 Paralel Kama Boyutlandırma İlkeleri
          </h2>
          <p className="leading-relaxed text-sm sm:text-base">
            Makine mühendisliğinde döner bir milden dişli çarka, kayış kasnağına, kapline veya volana tork aktarmanın en klasik, ekonomik ve kolay sökülebilir yöntemi <strong>DIN 6885-1 (ISO 773) paralel kama (feder)</strong> bağlantılarıdır. Eğimli kamaların (DIN 6886 / DIN 6887) aksine, paralel kamalar radyal yönde sıkıştırma kuvveti oluşturmaz; tork, mil kanalından kamaya ve kamanın yan yüzeyinden göbek kanalına saf teğetsel temas basıncı üzerinden aktarılır.
          </p>
          <p className="leading-relaxed text-sm sm:text-base">
            DIN 6885-1 standardında kama kesiti (genişlik <strong>b</strong> ve yükseklik <strong>h</strong>), kamanın takılacağı milin nominal anma çapına (<strong>d</strong>) göre standartlaştırılmıştır. Mühendis mil çapını belirlediğinde kama eni ve boyu keyfi olarak seçilemez; doğrudan tablodaki standart kademeye uymak zorundadır. Örneğin 38–44 mm çapındaki bir mil için standart kama kesiti istisnasız <strong>12 × 8 mm</strong>&apos;dir.
          </p>
          <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50/50 p-4 text-xs sm:text-sm text-slate-700">
            <p className="font-semibold text-emerald-950">Temel Boyutsal Kural: Kanal Derinlikleri Dengesi</p>
            <p className="mt-1 leading-relaxed">
              Standart kama yuvalarında mil kanalı derinliği <strong>t₁</strong> ile göbek kanalı derinliği <strong>t₂</strong> toplamı, kamanın nominal yüksekliği <strong>h</strong>&apos;den biraz büyüktür (<strong>t₁ + t₂ &gt; h</strong>). Bu radyal boşluk (genellikle 0.1–0.3 mm), kamanın üst yüzeyinin göbek tabanına temas ederek sistemi radyal olarak kasmaması, montajda eksenel kaçıklık yaratmaması ve tüm yükün sadece yan yüzeylerden taşınması için hayati öneme sahiptir.
            </p>
          </div>
        </section>

        {/* Bölüm 2: Form A, Form B ve Form C Geometrik Farkları */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Kama Formları: Form A (Yuvarlak Uçlu) vs. Form B (Düz Uçlu)
          </h2>
          <p className="leading-relaxed text-sm sm:text-base">
            DIN 6885 standardı, imalat ve montaj gereksinimlerine göre çeşitli uç formları tanımlar. Endüstride en çok karşılaşılan iki temel form Form A ve Form B&apos;dir:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
              <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                Form A (Yuvarlak Uçlu / Round Ends)
              </span>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Her iki ucu da <strong>r = b / 2</strong> yarıçapında yarım dairesel kavisle sonlanır. Mil üzerindeki yuva standart bir parmak freze çakısı ile daldırılarak açılır. Yuvarlak uçlar kanal içine kendiliğinden merkezlenir ve kamanın eksenel olarak kaymasını engeller. Ancak uç kavisler göbekle temas etmediği için tork taşıyan <strong>etkin boy l<sub>eff</sub> = L - b</strong> formülüyle hesaplanır.
              </p>
            </div>
            <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-4">
              <span className="inline-block rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-800">
                Form B (Düz Uçlu / Square Ends)
              </span>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Her iki ucu da dik açılı düz kesimlidir. Genellikle disk freze çakısı ile boydan boya açılan kanallarda veya kamanın mil omzuna dayandığı montajlarda kullanılır. Kamanın tüm boyu yük taşıdığı için <strong>etkin boy l<sub>eff</sub> = L</strong> olur. Aynı boydaki Form A kamaya kıyasla yaklaşık %15–25 daha yüksek tork kapasitesi sağlar.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 italic">
            * Not: <strong>Form C</strong> ve <strong>Form D</strong> kamalarda, kamanın mil yuvasına cıvatayla sabitlenmesi için gövde üzerinde havşa başlı cıvata delikleri bulunur. Ağır titreşimli konstrüksiyonlarda kamanın yerinden oynamaması için tercih edilir.
          </p>
        </section>

        {/* Bölüm 3: Toleranslar ve Alıştırmalar */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Kama ve Kanal Tolerans Sınıfları (h9, P9, JS9, N9, D10)
          </h2>
          <p className="leading-relaxed text-sm sm:text-base">
            Kama bağlantısının sorunsuz çalışması, ne aşırı sıkı olup parçaları çatlatmasına ne de gevşek olup boşluk (backlash) yapmasına bağlıdır. ISO tolerans sistemi (ISO 286) uyarınca kama gövdesi ve yuvalar için üç farklı montaj tipi tanımlanmıştır:
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Alıştırma Türü</th>
                  <th className="px-4 py-2.5">Kama Genişliği</th>
                  <th className="px-4 py-2.5">Mil Kanalı Eni</th>
                  <th className="px-4 py-2.5">Göbek Kanalı Eni</th>
                  <th className="px-4 py-2.5">Karakteristik Özellik &amp; Kullanım Alanı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">Normal Alıştırma (Standart)</td>
                  <td className="px-4 py-2.5 font-mono">h9</td>
                  <td className="px-4 py-2.5 font-mono text-emerald-700">P9</td>
                  <td className="px-4 py-2.5 font-mono text-blue-700">JS9</td>
                  <td className="px-4 py-2.5">Kama mil yuvasına hafif çakılarak oturur, göbek kama üzerinden rahatça kaydırılarak takılır. En yaygın endüstriyel standarttır.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">Sıkı Alıştırma (Ağır Yük / Darbeli)</td>
                  <td className="px-4 py-2.5 font-mono">h9</td>
                  <td className="px-4 py-2.5 font-mono text-emerald-700">P9</td>
                  <td className="px-4 py-2.5 font-mono text-emerald-700">P9</td>
                  <td className="px-4 py-2.5">Hem mil hem de göbek yuvası negatif toleranslıdır (sıkı geçme). Boşluğu sıfıra indirir; çift yönlü çalışan millerde kullanılır fakat sökme zordur.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">Gevşek Alıştırma (Kayar Göbek)</td>
                  <td className="px-4 py-2.5 font-mono">h9</td>
                  <td className="px-4 py-2.5 font-mono text-amber-700">N9</td>
                  <td className="px-4 py-2.5 font-mono text-amber-700">D10</td>
                  <td className="px-4 py-2.5">Şanzıman vites dişlileri veya kavrama göbeklerinin çalışma sırasında mil üzerinde eksenel kayması istendiğinde uygulanır.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Bölüm 4: Matematiksel Hesap Formülleri ve Çözümlü Mühendislik Örneği */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Tork Kapasitesi Hesap Formülü ve Sayısal Örnek
          </h2>
          <p className="leading-relaxed text-sm sm:text-base">
            Paralel kama mukavemetinde iki bağımsız hasar kriteri kontrol edilir: <strong>kamanın kesilmesi</strong> ve <strong>kama yan yüzeyinde oluşan yüzey basıncı (ezilme gerilmesi)</strong>.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="font-bold text-slate-900 text-sm">1. Yüzey Basıncı (Ezilme) Kriteri:</p>
              <div className="my-2 rounded-lg bg-white p-2.5 font-mono text-center text-sm border border-slate-200">
                p = (2 · T) / (d · t₂ · l<sub>eff</sub>) ≤ p<sub>em</sub>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Genellikle göbek malzemesi milden ve kamadan daha yumuşaktır (özellikle pik veya sfero döküm göbeklerde). Bu nedenle ezilme kontrolü daima göbek kanal derinliği <strong>t₂</strong> üzerinden yapılır.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="font-bold text-slate-900 text-sm">2. Kama Kesme (Kayma) Kriteri:</p>
              <div className="my-2 rounded-lg bg-white p-2.5 font-mono text-center text-sm border border-slate-200">
                τ = (2 · T) / (d · b · l<sub>eff</sub>) ≤ τ<sub>em</sub>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kamanın kesme emniyeti C45E ıslah çeliği için yaklaşık <strong>τ<sub>em</sub> ≈ 148 MPa</strong> seviyesindedir. Standart geometride yüzey basıncı kesme dayanımından önce sınıra ulaştığından boyutlandırmayı daima ezilme gerilmesi belirler.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-3">
            <h3 className="font-bold text-emerald-950 text-base">Çözümlü Mühendislik Örneği</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong>Verilenler:</strong> Bir redüktör çıkış mili çapı <strong>d = 40 mm</strong>&apos;dir. Göbek malzemesi dökme çeliktir (<strong>p<sub>em</sub> = 100 MPa</strong>). Montajda <strong>DIN 6885-1 Form A 12 × 8 × 56 mm</strong> standart kama kullanılmıştır.
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-slate-800">
              <li>
                <strong>Standart Geometri Tespiti:</strong> Tablodan d = 38–44 mm kademesi için <strong>b = 12 mm</strong>, <strong>h = 8 mm</strong>, <strong>t₁ = 5.0 mm</strong>, <strong>t₂ = 3.3 mm</strong>.
              </li>
              <li>
                <strong>Etkin Boy Hesabı (Form A):</strong> l<sub>eff</sub> = L - b = 56 - 12 = <strong>44 mm</strong>.
              </li>
              <li>
                <strong>Maksimum İzin Verilen Tork:</strong>
                <br />
                T<sub>max</sub> = (p<sub>em</sub> · t₂ · l<sub>eff</sub> · d) / 2000 = (100 · 3.3 · 44 · 40) / 2000 = <strong>290.4 N·m</strong>.
              </li>
              <li>
                <strong>Kama Kesme Emniyeti Kontrolü:</strong>
                <br />
                T<sub>kesme</sub> = (148 · 12 · 44 · 40) / 2000 = <strong>1562.88 N·m</strong>. (Ezilme emniyeti 290.4 N·m ile kesin belirleyicidir.)
              </li>
            </ol>
            <p className="text-xs text-emerald-900 font-semibold">
              Sonuç: Bu mil-göbek bağlantısı kalıcı plastik deformasyona uğramadan güvenle en fazla <strong>290.4 N·m</strong> tork taşıyabilir.
            </p>
          </div>
        </section>

        {/* Bölüm 5: 5 Kritik Mühendislik Hatası */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Kama Tasarımında Yapılan 5 Kritik Mühendislik Hatası
          </h2>
          <div className="space-y-3">
            <div className="rounded-xl border-l-4 border-rose-500 bg-rose-50/40 p-4 text-xs sm:text-sm">
              <p className="font-bold text-rose-950">1. Hata: Form A Kamada Toplam Boyu Taşıyıcı Kabul Etmek</p>
              <p className="mt-1 text-slate-700 leading-relaxed">
                Yuvarlak uçlu Form A kamalarda uç kavisler göbek kanalına temas etmez. Etkin taşıyıcı boy <strong>l<sub>eff</sub> = L - b</strong> formülü ile hesaplanmalıdır. 12×8×32 mm bir kamada boyu 32 mm almak ezilme gerilmesini yaklaşık %37 oranında eksik tahmin etmeye yol açar!
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/40 p-4 text-xs sm:text-sm">
              <p className="font-bold text-amber-950">2. Hata: Göbek Malzemesinin Ezilme Dayanımını Aşmak</p>
              <p className="mt-1 text-slate-700 leading-relaxed">
                Mil genellikle ıslah çeliği (C45, 42CrMo4) iken göbek pik döküm (GG-20 / GG-25) olabilir. Pik dökümün izin verilen ezilme sınırı yalnızca <strong>60 MPa</strong>&apos;dır. Çelik için geçerli 100–120 MPa değeri baz alınırsa göbek kama yuvası hızla deforme olur ve boşluk yapar.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/40 p-4 text-xs sm:text-sm">
              <p className="font-bold text-amber-950">3. Hata: Mildeki Çentik Etkisini (Kt ≈ 2.5–3.2) İhmal Etmek</p>
              <p className="mt-1 text-slate-700 leading-relaxed">
                Milde frezelenen kama yuvası, özellikle eğilme ve değişken burulma yükleri altında çok şiddetli gerilme yığılması oluşturur. Keskin köşe yarıçapı olan kanallar milin yorulma ömrünü %50&apos;den fazla azaltabilir. Köşe kavis yarıçapı mutlaka standart pah değerine uygun olmalıdır.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-rose-500 bg-rose-50/40 p-4 text-xs sm:text-sm">
              <p className="font-bold text-rose-950">4. Hata: Kamayı Eksenel Sabitleme Elemanı Sanmak</p>
              <p className="mt-1 text-slate-700 leading-relaxed">
                Paralel kama sadece teğetsel tork iletir; göbeğin mil üzerinde eksenel olarak kaymasını engelleyemez. Eksenel konumlandırma için mil faturası, segman (DIN 471), setskur veya sıkma bileziği gibi ek kilit mekanizmaları zorunludur.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-rose-500 bg-rose-50/40 p-4 text-xs sm:text-sm">
              <p className="font-bold text-rose-950">5. Hata: Darbeli ve Çift Yönlü Yüklerde Paralel Kama Kullanmak</p>
              <p className="mt-1 text-slate-700 leading-relaxed">
                Servo motorlar, presler ve tersinir çalışan tahrik sistemlerinde tork yön değiştirdikçe kama kanalda mikroskobik vuruntu yapar. Bu durum hızla <strong>fretting korozyonuna</strong> ve yuva genişlemesine neden olur. Çift yönlü dinamik sistemlerde konik burç (taper-lock), sıkı geçme veya evolvent freze tercih edilmelidir.
              </p>
            </div>
          </div>
        </section>

        {/* Bölüm 6: İlgili Mühendislik Araçları ve Rehberler */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            İlgili Mühendislik Hesaplayıcıları ve Standart Rehberleri
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href={withLocalePrefix("/guides/kama-tasarimi-101", locale)}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition group"
            >
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Tasarım Rehberi</span>
              <h3 className="mt-1 font-bold text-slate-900 text-sm group-hover:text-emerald-700">Kama Tasarımı 101</h3>
              <p className="mt-1 text-xs text-slate-500">Paralel feder mukavemeti, sürtünme açısı ve gerilme analizi rehberi.</p>
            </Link>

            <Link
              href={withLocalePrefix("/tools/shaft-torsion", locale)}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition group"
            >
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Hesaplayıcı</span>
              <h3 className="mt-1 font-bold text-slate-900 text-sm group-hover:text-emerald-700">Mil Burulma Hesabı</h3>
              <p className="mt-1 text-xs text-slate-500">Mil burulma gerilmesi, burulma açısı ve kama kanalı çentik kontrolü.</p>
            </Link>

            <Link
              href={withLocalePrefix("/tools/torque-power", locale)}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition group"
            >
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Hesaplayıcı</span>
              <h3 className="mt-1 font-bold text-slate-900 text-sm group-hover:text-emerald-700">Tork &amp; Güç Analizi</h3>
              <p className="mt-1 text-xs text-slate-500">Devir sayısı, motor gücü ve aktarılan nominal tork hesabı.</p>
            </Link>

            <Link
              href={withLocalePrefix("/blog/mil-gobek-baglantisi-kamali-flansli-gecme-cakma", locale)}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition group"
            >
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Teknik Makale</span>
              <h3 className="mt-1 font-bold text-slate-900 text-sm group-hover:text-emerald-700">Mil-Göbek Karşılaştırması</h3>
              <p className="mt-1 text-xs text-slate-500">Kamalı, flanşlı ve sıkı geçme bağlantıların mühendislik kıyaslaması.</p>
            </Link>
          </div>
        </section>
      </article>
    );
  }

  // English version
  return (
    <article className="prose prose-slate max-w-none space-y-10 text-slate-700">
      {/* Section 1: DIN 6885-1 and ISO 773 Principles */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          DIN 6885-1 and ISO 773 Parallel Key Sizing Principles
        </h2>
        <p className="leading-relaxed text-sm sm:text-base">
          In mechanical power transmission, connecting a rotating shaft to a gear, pulley, flywheel, or flexible coupling using <strong>DIN 6885-1 (ISO 773) parallel keys (drive feathers)</strong> remains the industry benchmark for dismountable, positive-locking shaft-to-hub joints. Unlike taper keys (DIN 6886 / DIN 6887), parallel keys do not induce radial pre-stress or runout; torque is transmitted purely through tangential contact pressure between the vertical flank surfaces of the key, shaft seat, and hub keyway.
        </p>
        <p className="leading-relaxed text-sm sm:text-base">
          Under DIN 6885-1, the key cross-section (width <strong>b</strong> and height <strong>h</strong>) is strictly standardized based on the nominal shaft diameter (<strong>d</strong>). Design engineers cannot pick arbitrary cross-sectional dimensions; they must strictly follow the tabulated steps. For example, any shaft diameter between 38 mm and 44 mm strictly mandates a <strong>12 × 8 mm</strong> parallel key cross-section.
        </p>
        <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50/50 p-4 text-xs sm:text-sm text-slate-700">
          <p className="font-semibold text-emerald-950">Fundamental Geometric Rule: Radial Key Clearance</p>
          <p className="mt-1 leading-relaxed">
            In standard DIN 6885-1 keyways, the sum of shaft keyway depth <strong>t₁</strong> and hub keyway depth <strong>t₂</strong> is slightly larger than the nominal key height <strong>h</strong> (<strong>t₁ + t₂ &gt; h</strong>). This intentional radial gap (typically 0.1 to 0.3 mm) guarantees that the top face of the key never contacts the bottom of the hub groove. This prevents radial wedging, eliminates runout errors, and ensures that 100% of the driving load is transferred through the side flanks.
          </p>
        </div>
      </section>

      {/* Section 2: Form A vs Form B vs Form C */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Key Shape Variations: Form A (Round Ends) vs. Form B (Square Ends)
        </h2>
        <p className="leading-relaxed text-sm sm:text-base">
          DIN 6885 specifies several end configurations depending on manufacturing methods and axial retention requirements. The two dominant forms in machinery are Form A and Form B:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
            <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
              Form A (Round Ends / Semicircular Radii)
            </span>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Both longitudinal ends are rounded with a radius of <strong>r = b / 2</strong>. The shaft keyway is machined using a standard slot end mill plunged into the shaft. The rounded ends automatically self-center within the pocket and prevent axial migration of the key. However, because the semicircular tips do not engage with the hub flank, the load-bearing <strong>effective length is l<sub>eff</sub> = L - b</strong>.
            </p>
          </div>
          <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-4">
            <span className="inline-block rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-800">
              Form B (Square Ends / Flat Cut)
            </span>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Both ends are squared off at 90 degrees. Commonly machined using a side-and-face disk milling cutter or positioned against a shaft shoulder. Because the entire rectangular flank contacts the hub keyway, the <strong>effective length is l<sub>eff</sub> = L</strong>. For a given total length, Form B provides approximately 15% to 25% higher torque capacity than Form A.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500 italic">
          * Note: <strong>Form C</strong> and <strong>Form D</strong> keys feature counterbored screw holes along their centerline to fasten the key into the shaft keyway, preventing key lifting under severe vibration and dynamic reversals.
        </p>
      </section>

      {/* Section 3: Tolerances & Fits */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Keyway Fit and Tolerance Classes (h9, P9, JS9, N9, D10)
        </h2>
        <p className="leading-relaxed text-sm sm:text-base">
          Reliable key operation requires exact control of flank clearances. Excessive clearance causes backlash and impact peening under cyclic loads, while over-tight fits cause hub cracking during assembly. ISO 286 defines three standard fit classes:
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Fit Classification</th>
                <th className="px-4 py-2.5">Key Width</th>
                <th className="px-4 py-2.5">Shaft Keyway Width</th>
                <th className="px-4 py-2.5">Hub Keyway Width</th>
                <th className="px-4 py-2.5">Application &amp; Assembly Behavior</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-2.5 font-semibold text-slate-900">Standard Fit (Normal Assembly)</td>
                <td className="px-4 py-2.5 font-mono">h9</td>
                <td className="px-4 py-2.5 font-mono text-emerald-700">P9</td>
                <td className="px-4 py-2.5 font-mono text-blue-700">JS9</td>
                <td className="px-4 py-2.5">Key is lightly tapped into the shaft seat (transition fit), while the hub slides smoothly over the key with minimal clearance. Most common industrial configuration.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-semibold text-slate-900">Tight Fit (Severe / Reversing Loads)</td>
                <td className="px-4 py-2.5 font-mono">h9</td>
                <td className="px-4 py-2.5 font-mono text-emerald-700">P9</td>
                <td className="px-4 py-2.5 font-mono text-emerald-700">P9</td>
                <td className="px-4 py-2.5">Both shaft and hub grooves are machined with negative tolerance (interference). Eliminates backlash completely for bi-directional torque, but disassembly requires a puller.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-semibold text-slate-900">Loose Fit (Sliding Hubs)</td>
                <td className="px-4 py-2.5 font-mono">h9</td>
                <td className="px-4 py-2.5 font-mono text-amber-700">N9</td>
                <td className="px-4 py-2.5 font-mono text-amber-700">D10</td>
                <td className="px-4 py-2.5">Permits axial sliding of clutch hubs or shifting gear clusters along the shaft while transmitting driving torque.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Mathematical Derivation & Worked Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Torque Capacity Calculations and Numerical Worked Example
        </h2>
        <p className="leading-relaxed text-sm sm:text-base">
          Parallel key sizing must verify two independent structural stress checks: <strong>hub flank surface pressure (crushing)</strong> and <strong>key shank shear stress</strong>.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="font-bold text-slate-900 text-sm">1. Surface Pressure (Bearing Stress) Check:</p>
            <div className="my-2 rounded-lg bg-white p-2.5 font-mono text-center text-sm border border-slate-200">
              p = (2 · T) / (d · t₂ · l<sub>eff</sub>) ≤ p<sub>em</sub>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Because the hub is typically made of a softer material than the shaft or the heat-treated key steel, bearing pressure is verified against the hub keyway depth <strong>t₂</strong>.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="font-bold text-slate-900 text-sm">2. Key Shank Shear Stress Check:</p>
            <div className="my-2 rounded-lg bg-white p-2.5 font-mono text-center text-sm border border-slate-200">
              τ = (2 · T) / (d · b · l<sub>eff</sub>) ≤ τ<sub>em</sub>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Allowable shear stress for normalized C45E key steel is approximately <strong>τ<sub>em</sub> ≈ 148 MPa</strong>. In standard key geometries, surface pressure reaches its limit well before shear, making bearing pressure the primary constraint.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-3">
          <h3 className="font-bold text-emerald-950 text-base">Worked Engineering Example</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong>Given Parameters:</strong> A gearbox output shaft has diameter <strong>d = 40 mm</strong>. The mating hub is cast steel with allowable pressure <strong>p<sub>em</sub> = 100 MPa</strong>. A standard <strong>DIN 6885-1 Form A 12 × 8 × 56 mm</strong> key is specified.
          </p>
          <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-slate-800">
            <li>
              <strong>Standard Geometry Lookup:</strong> For shaft diameter range 38–44 mm: <strong>b = 12 mm</strong>, <strong>h = 8 mm</strong>, <strong>t₁ = 5.0 mm</strong>, <strong>t₂ = 3.3 mm</strong>.
            </li>
            <li>
              <strong>Effective Length Determination (Form A):</strong> l<sub>eff</sub> = L - b = 56 - 12 = <strong>44 mm</strong>.
            </li>
            <li>
              <strong>Maximum Transmissible Torque:</strong>
              <br />
              T<sub>max</sub> = (p<sub>em</sub> · t₂ · l<sub>eff</sub> · d) / 2000 = (100 · 3.3 · 44 · 40) / 2000 = <strong>290.4 N·m</strong>.
            </li>
            <li>
              <strong>Key Shear Stress Verification:</strong>
              <br />
              T<sub>shear</sub> = (148 · 12 · 44 · 40) / 2000 = <strong>1562.88 N·m</strong>. (Bearing capacity of 290.4 N·m is the governing threshold.)
            </li>
          </ol>
          <p className="text-xs text-emerald-900 font-semibold">
            Result: This shaft-hub joint safely transmits up to <strong>290.4 N·m</strong> without plastic yielding or flank deformation.
          </p>
        </div>
      </section>

      {/* Section 5: 5 Common Engineering Pitfalls */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          5 Critical Engineering Pitfalls in Parallel Key Design
        </h2>
        <div className="space-y-3">
          <div className="rounded-xl border-l-4 border-rose-500 bg-rose-50/40 p-4 text-xs sm:text-sm">
            <p className="font-bold text-rose-950">1. Pitfall: Treating Total Length as Effective Length in Form A</p>
            <p className="mt-1 text-slate-700 leading-relaxed">
              In rounded-end Form A keys, the semicircular ends do not engage the hub keyway. The active bearing length is strictly <strong>l<sub>eff</sub> = L - b</strong>. Assuming total length L = 32 mm for a 12×8 mm key underestimates surface pressure by approximately 37%, risking hub brinelling!
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/40 p-4 text-xs sm:text-sm">
            <p className="font-bold text-amber-950">2. Pitfall: Overlooking Cast Iron Hub Surface Strength</p>
            <p className="mt-1 text-slate-700 leading-relaxed">
              While shafts are made of hardened steel (C45, 42CrMo4), hubs are frequently cast iron (GG-20 / GG-25) where permissible pressure is only <strong>60 MPa</strong>. Designing for 100–120 MPa steel limits will cause the cast iron hub keyway to peen open, generating severe backlash.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/40 p-4 text-xs sm:text-sm">
            <p className="font-bold text-amber-950">3. Pitfall: Neglecting Keyway Stress Concentration (Kt ≈ 2.5–3.2)</p>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Milling a keyway creates severe stress risers under rotating bending and cyclic torsion. Keyway corners must maintain standard fillet radii (r ≥ 0.5–1.0 mm) to avoid fatigue cracking under operational cyclic bending moments.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-rose-500 bg-rose-50/40 p-4 text-xs sm:text-sm">
            <p className="font-bold text-rose-950">4. Pitfall: Assuming Parallel Keys Provide Axial Retention</p>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Parallel keys only transmit tangential torque; they provide zero axial constraint. Auxiliary retention devices (shaft shoulders, retaining snap rings per DIN 471, shaft clamping collars, or end-plates) are mandatory to prevent hub walk.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-rose-500 bg-rose-50/40 p-4 text-xs sm:text-sm">
            <p className="font-bold text-rose-950">5. Pitfall: Using Parallel Keys for Reversing or Shock Loads</p>
            <p className="mt-1 text-slate-700 leading-relaxed">
              Under frequent start-stop cycles or bi-directional torque reversals (e.g. servo drives), micro-slip creates <strong>fretting corrosion</strong> and widens the keyway through hammering. For dynamic reversing applications, specify involute splines (DIN 5480) or frictional locking assemblies (shrink discs).
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Related Engineering Links */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Related Engineering Calculators &amp; Technical Standards
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href={withLocalePrefix("/guides/kama-tasarimi-101", locale)}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition group"
          >
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Design Guide</span>
            <h3 className="mt-1 font-bold text-slate-900 text-sm group-hover:text-emerald-700">Keyway Design 101</h3>
            <p className="mt-1 text-xs text-slate-500">Parallel feather shear, friction angles, and structural stress guide.</p>
          </Link>

          <Link
            href={withLocalePrefix("/tools/shaft-torsion", locale)}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition group"
          >
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Calculator</span>
            <h3 className="mt-1 font-bold text-slate-900 text-sm group-hover:text-emerald-700">Shaft Torsion Tool</h3>
            <p className="mt-1 text-xs text-slate-500">Shaft torsional shear stress, twist angle, and keyway notch factors.</p>
          </Link>

          <Link
            href={withLocalePrefix("/tools/torque-power", locale)}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition group"
          >
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Calculator</span>
            <h3 className="mt-1 font-bold text-slate-900 text-sm group-hover:text-emerald-700">Torque &amp; Power Tool</h3>
            <p className="mt-1 text-xs text-slate-500">Compute rotational speed, mechanical power, and driving torque.</p>
          </Link>

          <Link
            href={withLocalePrefix("/blog/mil-gobek-baglantisi-kamali-flansli-gecme-cakma", locale)}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition group"
          >
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Technical Article</span>
            <h3 className="mt-1 font-bold text-slate-900 text-sm group-hover:text-emerald-700">Shaft-Hub Connections</h3>
            <p className="mt-1 text-xs text-slate-500">Detailed comparison of keyed, flanged, and interference fit joints.</p>
          </Link>
        </div>
      </section>
    </article>
  );
}
