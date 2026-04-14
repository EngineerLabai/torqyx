/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const projectRoot = path.join(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const input = path.join(publicDir, "images", "logo.png");

const outputs = [
  { size: 16, filename: "favicon-16x16.png" },
  { size: 32, filename: "favicon-32x32.png" },
  { size: 180, filename: "apple-touch-icon.png" },
  { size: 192, filename: "icon-192.png" },
  { size: 512, filename: "icon-512.png" },
];

async function generate() {
  for (const { size, filename } of outputs) {
    const destination = path.join(publicDir, filename);
    await sharp(input)
      .resize(size, size, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(destination);
    console.log(`✓ ${filename} oluşturuldu (${size}x${size})`);
  }

  const appFaviconPath = path.join(projectRoot, "app", "favicon.ico");
  const publicFaviconPath = path.join(publicDir, "favicon.ico");

  try {
    await fs.copyFile(appFaviconPath, publicFaviconPath);
    console.log("✓ favicon.ico app/favicon.ico dosyasından kopyalandı");
  } catch {
    // Fallback: at least keep a favicon file in place if app/favicon.ico does not exist.
    await fs.copyFile(path.join(publicDir, "favicon-32x32.png"), publicFaviconPath);
    console.log("✓ favicon.ico fallback olarak favicon-32x32.png dosyasından oluşturuldu");
  }
}

generate().catch((error) => {
  console.error("Favicon üretimi başarısız:", error);
  process.exit(1);
});
