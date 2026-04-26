/**
 * Secant Metodu kullanılarak Hedef Arama (Goal Seek) fonksiyonu.
 * 
 * @param func Çözümlenecek matematiksel fonksiyon (Örn: girdi değişkeni alıp sonucu dönen bir hesaplayıcı)
 * @param target Ulaşılmak istenen hedef değer
 * @param guess1 Algoritmanın başlaması için 1. tahmini değer
 * @param guess2 Algoritmanın başlaması için 2. tahmini değer (Genelde guess1 * 1.1)
 * @param maxIter Maksimum iterasyon (Sonsuz döngüyü önlemek için)
 * @param tolerance Kabul edilebilir hata payı
 * @returns Hedefe ulaşmak için gereken X değeri veya bulunamazsa null
 */
export function goalSeek(
  func: (x: number) => number,
  target: number,
  guess1: number,
  guess2: number,
  maxIter: number = 100,
  tolerance: number = 1e-5
): number | null {
  let x0 = guess1;
  let x1 = guess2;

  for (let i = 0; i < maxIter; i++) {
    const f0 = func(x0) - target;
    const f1 = func(x1) - target;

    if (Math.abs(f1) < tolerance) {
      return x1; // Hedef değere yeterince yaklaştık
    }

    // Sıfıra bölme hatasını engelle
    if (f1 - f0 === 0) {
      return null;
    }

    // Secant (Kesen) formülü
    const x2 = x1 - f1 * ((x1 - x0) / (f1 - f0));

    // Değerleri kaydır
    x0 = x1;
    x1 = x2;
  }

  // Maksimum iterasyona ulaşıldı ama tolerans sağlanamadı
  // (Bu durumda denklem hedef değere yakınsamamış demektir)
  return null;
}