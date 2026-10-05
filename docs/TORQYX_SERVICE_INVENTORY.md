# TORQYX — Servis, Yayın ve Entegrasyon Envanteri

Son doğrulama: 5 Ekim 2026 (Europe/Istanbul)  
Amaç: TORQYX'in hangi harici servisleri kullandığını, hangilerinin canlı olarak doğrulandığını ve hangi hesapların yönetilmesi gerektiğini tek yerde tutmak.

## Statü anahtarı

| Statü | Anlamı |
| --- | --- |
| **Canlı doğrulandı** | Üretim alan adı, sağlayıcı yanıtı veya sağlayıcı paneliyle doğrulandı. |
| **Kodda yapılandırılmış** | Repository'de entegrasyon var; üretim ortam değişkeninin veya hesabın etkinliği ayrıca doğrulanmadı. |
| **Eski / alternatif** | Repository'de iz var ama mevcut canlı yayın zincirinde kullanılmıyor. |
| **Bilinmiyor** | Repository veya canlı DNS bilgisi bu detayı göstermiyor; tahmin edilmemeli. |

## 1. Canlı yayın zinciri

```text
Yerel çalışma dizini
        ↓ git push
GitHub: EngineerLabai/torqyx (main)
        ↓ otomatik production deployment
Vercel: aiengineerlabs-projects/torqyx
        ↓
torqyx.com
```

| Servis | Statü | Görevi | Doğrulama / önemli bilgi |
| --- | --- | --- | --- |
| **GitHub** | Canlı doğrulandı | Kaynak kod, commit geçmişi ve CI | Uzak repo: `https://github.com/EngineerLabai/torqyx.git`; ana branch: `main`. |
| **GitHub Actions** | Kodda yapılandırılmış | Push/PR kalite kontrolleri | `.github/workflows/quality-gates.yml`: lint, type-check, test, link/AdSense denetimi, build, E2E ve Lighthouse CI. Workflow çalıştırma geçmişi GitHub Actions panelinden izlenir. |
| **Vercel** | Canlı doğrulandı | Next.js hosting, production deployment, HTTPS/CDN ve serverless/route runtime | Proje: `aiengineerlabs-projects/torqyx`; proje ID: `prj_ZpDrA3CKpscYkSPkRlkDejrtFVV7`; production alan adı Vercel alias'ına bağlıdır. |
| **Vercel DNS** | Canlı doğrulandı | `torqyx.com` için authoritative DNS | NS kayıtları: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`. DNS yönetimi Vercel'de görünür. Bu, domainin Vercel'de kayıtlı olduğu anlamına gelmez. |
| **Domain registrar** | Bilinmiyor | `torqyx.com` alan adı yenileme/sahiplik | DNS nameserver'ları registrar'ı göstermez. Yenileme yapılan registrar hesabı ayrıca kayda alınmalıdır. |
| **Cloudflare** | Kullanım kanıtı yok | - | Canlı yanıtlarda `Server: Vercel` / `X-Vercel-Id` görülüyor; Cloudflare nameserver veya `cf-*` header'ı yok. Şu an Cloudflare dashboardunda işlem yapılması gereken bir TORQYX yapılandırması doğrulanmadı. |

### Canlı URL'ler ve yönlendirme notu

- Ana canonical alan adı: `https://torqyx.com`
- Vercel production URL'leri ve `*.vercel.app` hostları canonical domaine yönlendirilir.
- Vercel'de ayrıca `torqyx.xyz` alias'ı görülüyor. Canonical/SEO sinyalleri `torqyx.com` üzerinde tutulmalıdır.
- HTTPS, HSTS ve temel güvenlik header'ları Vercel üzerinden canlıdır.

## 2. Google servisleri

| Servis | Statü | Görevi | Yönetim notu |
| --- | --- | --- | --- |
| **Google AdSense** | Canlı doğrulandı | Site incelemesi ve reklam yayını | Publisher: `ca-pub-8444187117761223`; AdSense hesabında `torqyx.com` mevcut. Reklam kodu özellik bayrağıyla kapalı tutulur; onay/kararlı rıza akışı olmadan açılmaz. |
| **ads.txt** | Canlı doğrulandı | AdSense satıcı yetkilendirmesi | `https://torqyx.com/ads.txt` HTTP 200 döner ve publisher kaydıyla eşleşir. |
| **Google CMP / Privacy & Messaging** | Canlı doğrulandı | AEA, Birleşik Krallık ve İsviçre için Google rıza mesajı | AdSense panelinde `torqyx.com` için yayınlanmış Avrupa düzenlemeleri mesajı vardır. Mesaj/cookie ayarları AdSense > Gizlilik ve mesajlaşma üzerinden değiştirilir. |
| **Google Analytics 4** | Kodda yapılandırılmış | Rıza sonrası kullanım ölçümü | Ölçüm kimliği kodda tanımlı; tag yalnız analitik rızası sonrası yüklenir. GA4 mülkü ve kullanıcı erişimleri Google Analytics panelinden yönetilir. |
| **Google Search Console** | Kodda yapılandırılmış | İndeksleme, sitemap, URL denetimi | Site doğrulama meta etiketi canlı kodda vardır. Property'ye hangi Google hesabının eriştiği ayrı bir hesap/yetki konusudur. |
| **Google OAuth** | Kodda yapılandırılmış (koşullu) | NextAuth ile Google ile giriş | Sadece `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET` production'da tanımlıysa etkinleşir. OAuth consent screen/redirect URI Google Cloud Console'da yönetilir. |
| **Gemini API** | Kodda yapılandırılmış (varsayılan) | Araç özeti / AI açıklama servisi | Varsayılan sağlayıcı `gemini`; etkinlik `GEMINI_API_KEY` ile belirlenir. Anahtar asla repository'ye yazılmaz. |

## 3. Uygulama verisi, kimlik doğrulama ve iletişim

| Servis / teknoloji | Statü | Görevi | Yönetim notu |
| --- | --- | --- | --- |
| **PostgreSQL + Prisma** | Kodda yapılandırılmış | Kullanıcılar, hesaplamalar, favoriler, paylaşım kayıtları ve Auth.js tabloları | Prisma sağlayıcısı PostgreSQL. Gerçek database sağlayıcısının adı/hesabı `DATABASE_URL` içinde olabilir; bu dokümanda ve Git'te saklanmaz. |
| **Auth.js / NextAuth** | Kodda yapılandırılmış | E-posta/parola ile oturum, opsiyonel Google OAuth | Prisma adapter kullanır. `AUTH_SECRET`/`NEXTAUTH_SECRET` Vercel environment variables içinde tutulmalıdır. |
| **Firebase Authentication** | Kodda yapılandırılmış | İstemci tarafı kullanıcı oturumu / Google ile giriş akışları | Firebase istemcisi env değerleri mevcutsa lazy-load edilir. Production Firebase projesi/authorized domain'ler Firebase Console'dan doğrulanmalıdır. |
| **Cloud Firestore** | Kodda yapılandırılmış | Yorumlar, destek talepleri, RUM ve istemci hata kayıtları | Server route'ları Firebase Admin kimlik bilgisi varsa veri yazar; yoksa bazı telemetry akışları kontrollü biçimde atlanır. |
| **Firebase Storage** | Kodda yapılandırılmış | Destek formu ekleri | İstemci Firebase config'i ve Storage kuralları Firebase Console'da yönetilir. |
| **Firebase Hosting** | Eski / alternatif | Statik hosting için eski yapılandırma | `firebase.json` ve `.firebaserc` vardır; fakat mevcut canlı DNS ve HTTP yanıtı Vercel'i gösterir. Yeni deploy için Firebase Hosting kullanılmamalıdır. |
| **Gmail SMTP + Nodemailer** | Kodda yapılandırılmış | Destek formu e-posta bildirimleri | `infotorqyx@gmail.com` gönderen/alıcı olarak yapılandırılabilir. Gmail app password yalnız Vercel env'de saklanır; Git'e yazılmaz. |

## 4. AI, performans ve gözlemlenebilirlik

| Servis | Statü | Görevi | Yönetim notu |
| --- | --- | --- | --- |
| **OpenAI API** | Kodda yapılandırılmış | `/api/ai/explain-result` ile sonuç açıklama | `OPENAI_API_KEY` varsa çalışır. API anahtarları OpenAI platformunda; Vercel'de environment variable olarak yönetilir. |
| **Groq API** | Kodda yapılandırılmış (alternatif) | Tool-summary için Gemini fallback/alternatif | `GROQ_API_KEY` varsa kullanılabilir. |
| **Vercel Speed Insights** | Kodda yapılandırılmış | Gerçek kullanıcı performans sinyalleri | Production layout'ta yüklenir; veriler Vercel dashboardunda görünür. |
| **Uygulama içi RUM / client error endpointleri** | Kodda yapılandırılmış | Web Vitals, hata ve CSP raporları | `/api/rum`, `/api/client-errors`, `/api/csp-report`; Firebase Admin kimlik bilgileri varsa Firestore'a kalıcı yazım yapabilir. |
| **Lighthouse CI** | Kodda yapılandırılmış | CI performans denetimi | GitHub Actions quality workflow'unda çalışır. |

## 5. Reklam, gizlilik ve güvenlik özellik bayrakları

Bu değerler secrets değildir; fakat production değişikliği kontrollü yapılmalıdır.

| Environment variable | Güvenli varsayılan | Anlamı |
| --- | --- | --- |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | `false` | AdSense reklam script'ini açar/kapatır. Site onayı ve canlı rıza testi olmadan `true` yapılmaz. |
| `NEXT_PUBLIC_ADSENSE_CMP_READY` | `false` | Uygulamanın AdSense yükleme korumasında CMP hazır sinyali. Google CMP panelde yayınlanmış olsa bile, canlı rıza akışı test edilmeden değiştirilmez. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Kod fallback'i var | GA4 ölçüm kimliği. Analitik rızası yokken tag yüklenmez. |
| `SITE_URL` / `NEXT_PUBLIC_SITE_URL` | `https://torqyx.com` | Canonical URL, yönlendirme ve SEO için ana alan adı. |
| `INDEX_SITE` | Production'da doğrulanmalı | İndeksleme davranışını etkiler; yanlışlıkla `false` kalması SEO açısından risklidir. |

## 6. Şu an kullanılmayan veya yalnız şema düzeyinde görünenler

| Öğe | Durum |
| --- | --- |
| **Stripe** | Prisma şemasında `stripeCustomerId` alanı var; projede aktif Stripe SDK/ödeme akışı kanıtı bulunmadı. Aktif ödeme entegrasyonu kabul edilmemeli. |
| **Cloudflare** | Aktif DNS/CDN/WAF kanıtı yok. Vercel DNS ve Vercel edge/hosting kullanılıyor. |
| **Firebase Hosting** | Konfigürasyon izi var fakat canlı yayın platformu değil. |

## 7. Hesap erişimi ve operasyon sorumluluğu

| İş | Birincil yer |
| --- | --- |
| Kod geliştirme, branch/PR, Actions | GitHub `EngineerLabai/torqyx` |
| Production deploy, environment variables, domain/DNS, Speed Insights | Vercel `torqyx` projesi |
| AdSense site durumu, CMP, ads.txt taraması | AdSense publisher hesabı |
| İndeksleme, sitemap, URL Inspection | Google Search Console `torqyx.com` property |
| GA4 raporları | Google Analytics property |
| Firebase Auth / Firestore / Storage / authorized domains | Firebase Console |
| PostgreSQL bağlantısı ve yedekleri | `DATABASE_URL` ile işaret edilen gerçek database sağlayıcısı |
| Gmail SMTP app password / güvenlik | `infotorqyx@gmail.com` Google hesabı |
| OpenAI, Gemini, Groq API anahtarları | İlgili sağlayıcı dashboardu + Vercel environment variables |
| Domain yenileme / registrar | Henüz belirlenmedi; registrar hesabı bulunup buraya eklenmeli |

## 8. Güvenli çalışma akışı

1. Geliştirmeye başlamadan önce: `git pull`.
2. Yerelde test/build çalıştırılır.
3. `main` branch'ine push yapılır.
4. GitHub Actions ve Vercel deploy sonucu kontrol edilir.
5. `https://torqyx.com` üzerinden canlı doğrulama yapılır.
6. API anahtarları, SMTP şifreleri, database URL'si, Firebase Admin JSON'u veya Vercel token'ı kesinlikle commit edilmez.

## 9. Bu envanteri güncelleme tetikleyicileri

Şunlardan biri değişirse bu dosya da güncellenmelidir:

- Hosting/DNS/registrar sağlayıcısının değişmesi
- Yeni ödeme sağlayıcısı veya yeni AI sağlayıcısının production'a açılması
- Firebase'in kaldırılması ya da production kullanımının doğrulanması
- AdSense reklamlarının açılması veya CMP tasarımının değiştirilmesi
- Database sağlayıcısının belirlenmesi/değişmesi
- Search Console, Analytics veya Vercel hesap sahipliği/erişiminin değişmesi
