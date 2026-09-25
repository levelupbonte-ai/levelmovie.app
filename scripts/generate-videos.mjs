import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const videoDir = path.resolve('public/assets/video');
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

async function generate() {
  const finalStopImg = path.resolve('public/finalstop-preview.jpg');
  const laptopHeroImg = path.resolve('public/laptop-hero.jpg');

  // 1. Prepare vertical tall image of Final Stop for smooth mobile scrolling
  // Phone viewport: 360 x 640
  const tallFinalStop = path.join(videoDir, 'temp-tall-finalstop.png');
  await sharp(finalStopImg)
    .resize(360, 1080, { fit: 'cover', position: 'top' })
    .png()
    .toFile(tallFinalStop);

  // Generate 4s mobile scroll-through MP4 (H.264, muted, no audio)
  const mp4FinalStop = path.join(videoDir, 'finalstop-mobile-scroll.mp4');
  const webmFinalStop = path.join(videoDir, 'finalstop-mobile-scroll.webm');
  
  // y position moves from 0 to 440 and back in 4 seconds
  const filterFinalStop = `crop=360:640:0:'min(440, max(0, 440*sin(PI*t/4)))'`;

  execSync(`ffmpeg -y -loop 1 -i "${tallFinalStop}" -vf "${filterFinalStop},format=yuv420p" -t 4 -r 30 -an -c:v libx264 -pix_fmt yuv420p -b:v 800k "${mp4FinalStop}"`);
  execSync(`ffmpeg -y -loop 1 -i "${tallFinalStop}" -vf "${filterFinalStop}" -t 4 -r 30 -an -c:v libvpx-vp9 -b:v 600k "${webmFinalStop}"`);

  // Final Stop poster
  await sharp(tallFinalStop)
    .extract({ left: 0, top: 0, width: 360, height: 640 })
    .webp({ quality: 80 })
    .toFile(path.join(videoDir, 'finalstop-mobile-poster.webp'));
  await sharp(tallFinalStop)
    .extract({ left: 0, top: 0, width: 360, height: 640 })
    .jpeg({ quality: 80 })
    .toFile(path.join(videoDir, 'finalstop-mobile-poster.jpg'));

  // 2. Studio Demo Video (Desktop viewport 640 x 400)
  const tallStudio = path.join(videoDir, 'temp-tall-studio.png');
  await sharp(laptopHeroImg)
    .resize(640, 600, { fit: 'cover', position: 'top' })
    .png()
    .toFile(tallStudio);

  const mp4Studio = path.join(videoDir, 'studio-demo.mp4');
  const webmStudio = path.join(videoDir, 'studio-demo.webm');
  const filterStudio = `crop=640:400:0:'min(200, max(0, 200*sin(PI*t/4)))'`;

  execSync(`ffmpeg -y -loop 1 -i "${tallStudio}" -vf "${filterStudio},format=yuv420p" -t 4 -r 30 -an -c:v libx264 -pix_fmt yuv420p -b:v 800k "${mp4Studio}"`);
  execSync(`ffmpeg -y -loop 1 -i "${tallStudio}" -vf "${filterStudio}" -t 4 -r 30 -an -c:v libvpx-vp9 -b:v 600k "${webmStudio}"`);

  // Studio demo poster
  await sharp(tallStudio)
    .extract({ left: 0, top: 0, width: 640, height: 400 })
    .webp({ quality: 80 })
    .toFile(path.join(videoDir, 'studio-demo-poster.webp'));
  await sharp(tallStudio)
    .extract({ left: 0, top: 0, width: 640, height: 400 })
    .jpeg({ quality: 80 })
    .toFile(path.join(videoDir, 'studio-demo-poster.jpg'));

  // Clean up temps
  if (fs.existsSync(tallFinalStop)) fs.unlinkSync(tallFinalStop);
  if (fs.existsSync(tallStudio)) fs.unlinkSync(tallStudio);

  console.log('Videos generated successfully:');
  const files = fs.readdirSync(videoDir);
  for (const f of files) {
    const sz = fs.statSync(path.join(videoDir, f)).size;
    console.log(`- ${f}: ${(sz / 1024).toFixed(1)} KB`);
  }
}

generate().catch(console.error);
