import fs from 'fs';
import path from 'path';

// Taranacak ana klasörler (Gereksiz node_modules vb. atlanır)
const DIRECTORIES_TO_SCAN = ['./app', './components', './config', './lib', './messages', './utils'];
const SEARCH_STRING = "AI Engineers Lab";
const REPLACE_STRING = "TORQYX";

function scanAndReplace(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanAndReplace(fullPath);
    } else if (fullPath.match(/\.(tsx|ts|js|mjs|json|md)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes(SEARCH_STRING)) {
        // Global olarak tüm eşleşmeleri değiştir
        content = content.replaceAll(SEARCH_STRING, REPLACE_STRING);
        // AI Engineers Lab'in tek tırnaklı vb varyasyonları varsa diye ekstra güvenlik
        content = content.replaceAll("AI Engineers Lab'in", "TORQYX'in");
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Güncellendi: ${fullPath}`);
      }
    }
  }
}

console.log(`🔍 "${SEARCH_STRING}" aranıyor ve "${REPLACE_STRING}" ile değiştiriliyor...`);
DIRECTORIES_TO_SCAN.forEach(dir => scanAndReplace(dir));
console.log("🎉 Marka ismi değiştirme işlemi tüm projede başarıyla tamamlandı!");