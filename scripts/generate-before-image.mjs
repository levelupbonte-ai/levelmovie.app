import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/assets/img');

async function createBeforeImage() {
  const width = 1000;
  const height = 625;

  const svgBefore = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <!-- Background: outdated beige/off-white corporate template -->
    <rect width="${width}" height="${height}" fill="#ECE7DE"/>

    <!-- Insecure Browser Bar -->
    <rect width="${width}" height="36" fill="#D1CCC2"/>
    <circle cx="20" cy="18" r="5" fill="#EF4444"/>
    <circle cx="36" cy="18" r="5" fill="#F59E0B"/>
    <circle cx="52" cy="18" r="5" fill="#10B981"/>
    <rect x="80" y="8" width="380" height="20" rx="4" fill="#FFFFFF"/>
    <text x="96" y="22" font-family="system-ui, sans-serif" font-size="11" fill="#DC2626">⚠️ Not Secure — http://finalstop-old.barbershop.com</text>

    <!-- Outdated Header Banner -->
    <rect y="36" width="${width}" height="32" fill="#854D0E"/>
    <text x="${width/2}" y="57" font-family="serif" font-size="12" font-weight="bold" fill="#FEF08A" text-anchor="middle">⚠️ APPOINTMENTS BY PHONE ONLY: CALL (619) 555-0142 DURING SHOP HOURS</text>

    <!-- Outdated Navigation -->
    <rect y="68" width="${width}" height="56" fill="#FFFFFF" stroke="#E5E7EB"/>
    <text x="50" y="103" font-family="serif" font-size="22" font-weight="bold" fill="#1F2937">FINAL STOP BARBERSHOP</text>
    <text x="450" y="102" font-family="sans-serif" font-size="13" fill="#4B5563">Home   About   Services   Gallery   Contact   Testimonials   Links</text>

    <!-- Hero area: cluttered old template -->
    <rect x="50" y="144" width="900" height="340" fill="#374151" rx="8"/>
    <!-- Simulated low-res image background -->
    <rect x="50" y="144" width="900" height="340" fill="#1E293B" opacity="0.9"/>
    <text x="100" y="230" font-family="serif" font-size="34" font-weight="bold" fill="#F3F4F6">Welcome To Final Stop Barber Shop</text>
    <text x="100" y="275" font-family="sans-serif" font-size="15" fill="#9CA3AF">Quality haircuts and beard trims since 2018 in San Diego.</text>
    <text x="100" y="305" font-family="sans-serif" font-size="14" fill="#9CA3AF">Please call our front desk during open hours to check if a chair is open.</text>

    <!-- Clunky Call-To-Action Button -->
    <rect x="100" y="340" width="220" height="48" rx="4" fill="#CA8A04"/>
    <text x="210" y="370" font-family="sans-serif" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">📞 Call For Appointment</text>

    <rect x="340" y="340" width="180" height="48" rx="4" fill="#4B5563"/>
    <text x="430" y="370" font-family="sans-serif" font-size="14" font-weight="normal" fill="#FFFFFF" text-anchor="middle">View PDF Price List</text>

    <!-- Benchmark watermark -->
    <rect x="50" y="504" width="900" height="96" fill="#FFFFFF" stroke="#E5E7EB" rx="8"/>
    <circle cx="80" cy="552" r="16" fill="#FEE2E2"/>
    <text x="80" y="557" font-family="sans-serif" font-size="12" font-weight="bold" fill="#DC2626" text-anchor="middle">✕</text>
    <text x="110" y="542" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1F2937">Old Website Bottlenecks:</text>
    <text x="110" y="565" font-family="sans-serif" font-size="12" fill="#6B7280">No online scheduling • Phone line frequently busy • 5.8s mobile load time • Not mobile responsive</text>
  </svg>`;

  await sharp(Buffer.from(svgBefore))
    .webp({ quality: 80 })
    .toFile(path.join(outDir, 'finalstop-before.webp'));

  await sharp(Buffer.from(svgBefore))
    .jpeg({ quality: 80 })
    .toFile(path.join(outDir, 'finalstop-before.jpg'));

  console.log('Created finalstop-before.webp and finalstop-before.jpg');
}

createBeforeImage().catch(console.error);
