import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconsDir = path.resolve('public/assets/img/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const imagesMap = {
  barbershop: 'src/assets/images/barbershop_icon_1790313794671.jpg',
  salon: 'src/assets/images/salon_icon_1790313811805.jpg',
  store: 'src/assets/images/store_icon_1790313827226.jpg',
  creators: 'src/assets/images/creators_icon_1790313841190.jpg',
  portfolio: 'src/assets/images/portfolio_icon_1790313850468.jpg',
  security: 'src/assets/images/security_icon_1790313865122.jpg',
  booking: 'src/assets/images/booking_icon_1790313876117.jpg',
  care: 'src/assets/images/care_icon_1790313888119.jpg',
};

async function processIcons() {
  for (const [name, imgPath] of Object.entries(imagesMap)) {
    const fullSrc = path.resolve(imgPath);
    if (!fs.existsSync(fullSrc)) {
      console.error(`Source image missing: ${fullSrc}`);
      continue;
    }

    // 512px AVIF
    await sharp(fullSrc)
      .resize(512, 512, { fit: 'cover' })
      .avif({ quality: 65, effort: 4 })
      .toFile(path.join(iconsDir, `${name}.avif`));

    // 512px WebP
    await sharp(fullSrc)
      .resize(512, 512, { fit: 'cover' })
      .webp({ quality: 78, effort: 4 })
      .toFile(path.join(iconsDir, `${name}.webp`));

    // 512px PNG fallback
    await sharp(fullSrc)
      .resize(512, 512, { fit: 'cover' })
      .png({ quality: 75, compressionLevel: 9 })
      .toFile(path.join(iconsDir, `${name}.png`));

    const webpSize = fs.statSync(path.join(iconsDir, `${name}.webp`)).size;
    const avifSize = fs.statSync(path.join(iconsDir, `${name}.avif`)).size;
    const pngSize = fs.statSync(path.join(iconsDir, `${name}.png`)).size;
    console.log(`- ${name}: WebP ${(webpSize/1024).toFixed(1)}KB, AVIF ${(avifSize/1024).toFixed(1)}KB, PNG ${(pngSize/1024).toFixed(1)}KB`);
  }
}

processIcons().catch(console.error);
