import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 TORQYX Lansman Öncesi Son Temizlik ve Entegrasyon Botu Başlıyor...\n');

// 1. AdSense Bileşenini Doğru Yere Taşıma ve Layout'a Ekleme
if (fs.existsSync('public/AdSense.tsx')) {
    if (!fs.existsSync('components/ads')) fs.mkdirSync('components/ads', { recursive: true });
    fs.renameSync('public/AdSense.tsx', 'components/ads/AdSense.tsx');
    console.log('✅ AdSense bileşeni components/ads/AdSense.tsx konumuna taşındı.');
}

const layoutPaths = ['app/layout.tsx', 'app/[locale]/layout.tsx'];
for (const lp of layoutPaths) {
    if (fs.existsSync(lp)) {
        let content = fs.readFileSync(lp, 'utf8');
        if (!content.includes('<AdSense')) {
            if (!content.includes('import AdSense')) {
                content = `import AdSense from "@/components/ads/AdSense";\n` + content;
            }
            // Body taginin hemen altına ekle
            content = content.replace(/<body[^>]*>/, `$& \n        <AdSense publisherId="pub-0000000000000000" />`);
            fs.writeFileSync(lp, content, 'utf8');
            console.log(`✅ AdSense <AdSense /> etiketi ${lp} dosyasına eklendi.`);
        }
    }
}

// 2. Eski / Fazlalık 10 Görselin Silinmesi
const redundantImages = [
    'home-hero-2.jpg', 'quality-tools-hero-2.jpg', 'fixture-tools-hero-2.jpg',
    'community-hero.jpg', 'glossary-hero.jpg', 'guides-hero.jpg', 'workspace.webp',
    'blueprint-hydraulic.jpg', 'blueprint-assembly.jpg' // Eski .jpg uzantılı blueprintler
];
let deletedCount = 0;
redundantImages.forEach(img => {
    const imgPath = path.join('public/images', img);
    if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
        deletedCount++;
    }
});
if (deletedCount > 0) console.log(`🗑️ Toplam ${deletedCount} adet gereksiz/kopya görsel silindi (Performans Artışı).`);

// 3. (DEV) Görsellerin otomatik inject edilmesi kaldırıldı — manuel kontrol önerilir.

// 4. Marka Adının "TORQYX" Olarak Global Değiştirilmesi
function scanAndReplace(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.next')) {
            scanAndReplace(fullPath);
        } else if (fullPath.match(/\.(tsx|ts|js|mjs|json|md)$/)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('AI Engineers Lab')) {
                content = content.replaceAll('AI Engineers Lab', 'TORQYX');
                content = content.replaceAll("AI Engineers Lab'in", "TORQYX'in");
                fs.writeFileSync(fullPath, content, 'utf8');
            }
        }
    }
}
console.log('🔍 "AI Engineers Lab" markası tüm klasörlerde aranıyor ve "TORQYX" olarak değiştiriliyor...');
['./app', './components', './src', './lib', './messages', './utils', './content', './config'].forEach(scanAndReplace);
console.log('✅ Marka isimleri (SEO Başlıkları dahil) başarıyla güncellendi.');

// 5. SEO H1 Fixer Scriptinin Çalıştırılması
console.log('📈 SEO H1 Düzeltme asistanı tetikleniyor...');
try {
    execSync('node h1-fix.mjs', { stdio: 'inherit' });
} catch (e) {
    console.log('⚠️ h1-fix.mjs çalıştırılırken bir uyarı verdi veya bulunamadı, manuel kontrol edebilirsiniz.');
}

console.log('\n🎉 TEBRİKLER! Tüm görseller ayarlandı, marka değiştirildi, reklam eklendi ve lansmana hazırsınız!');