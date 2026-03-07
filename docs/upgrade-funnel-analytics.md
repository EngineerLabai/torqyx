# Upgrade Funnel Analytics

## Enstrümante edilen akış

Mevcut üründe bağımsız bir checkout modal olmadığı için funnel adımları şu bileşenlere bağlandı:

1. `upgrade_click`: Upgrade CTA tıklamaları (`TrackedUpgradeLink`, `PremiumCTA`, `AuthButtons`)
2. `plan_view`: Plan ekranı görüntülenmesi (`/pricing`, `/premium`)
3. `checkout_start`: Support form ile ilk checkout etkileşimi (`SupportForm` ilk input/file/submit etkileşimi)
4. `payment_info_entered`: Support form geçerli submit aşaması (`name+email+message` dolu)
5. `upgrade_success`: Başarı callback parametreleri yakalandığında (`UpgradeSuccessTracker`)

Ek olarak:
- `funnel_abandoned`: `upgrade_click` üzerinden 10 dakika geçtiği halde `upgrade_success` gelmezse atılır.

## Session bazlı funnel state

- Anahtar: `sessionStorage["analytics:upgrade_funnel_state"]`
- Tutulan alanlar: `startedAt`, `funnelStep`, `plan`, `source`, `successAt`, `abandonedAt`
- Step ilerleme sadece ileri yönde yapılır (`upgrade_click -> ... -> upgrade_success`).
- Repeated click durumunda aktif funnel geri sarılmaz.
- Abandonment kontrol penceresi: `10 dakika` (`UPGRADE_FUNNEL_TIMEOUT_MS`).

## Event şeması

- `upgrade_click`: `{ plan, source }`
- `plan_view`: `{ plan, source }`
- `checkout_start`: `{ plan, source }`
- `payment_info_entered`: `{ plan, source }`
- `upgrade_success`: `{ plan, amount }`
- `funnel_abandoned`: `{ plan, source, drop_off_step, elapsed_seconds }`

`drop_off_step` değerleri: `upgrade_click | plan_view | checkout_start | payment_info_entered`

## GA4 funnel raporu kurulumu

1. GA4 > Admin > Custom definitions altında event-scope custom dimension ekle:
   - `plan`
   - `source`
   - `drop_off_step`
   - `elapsed_seconds` (numeric metric olarak da eklenebilir)
2. GA4 > Admin > Events içinde `upgrade_success` event’ini key event (conversion) olarak işaretle.
3. Explore > Funnel exploration oluştur:
   - Step 1: `upgrade_click`
   - Step 2: `plan_view`
   - Step 3: `checkout_start`
   - Step 4: `payment_info_entered`
   - Step 5: `upgrade_success`
4. Breakdown dimension olarak `source` ve `plan` ekle.
5. Drop-off analizi için ayrı tabloda `funnel_abandoned` event’ini `drop_off_step` breakdown ile izle.

## PostHog funnel raporu kurulumu

1. PostHog’da event ingest doğrulaması yap:
   - `upgrade_click`, `plan_view`, `checkout_start`, `payment_info_entered`, `upgrade_success`, `funnel_abandoned`
2. Insights > Funnel oluştur:
   - Aynı 5 step event sırasını kullan.
3. Conversion window’u iş ihtiyacına göre belirle (öneri: `10 dakika - 1 gün` arası test).
4. Breakdown:
   - `source`
   - `plan`
5. Abandonment görünürlüğü için trend insight aç:
   - Event: `funnel_abandoned`
   - Breakdown: `drop_off_step`
   - İsteğe bağlı: `elapsed_seconds` percentile takibi
