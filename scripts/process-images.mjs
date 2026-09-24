import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/assets/img');
const iconsDir = path.resolve('public/assets/img/icons');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// 1. Create the 6 Faceted Purple SVG Icons (same palette, top-left lighting, 100x100 viewBox)
const icons = {
  'local-business.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <!-- Faceted Storefront / Local Building -->
    <!-- Roof Peak & Left Awning Facet (Top-Left Light: #DDD6FE, #A78BFA) -->
    <polygon points="50,12 20,34 50,42" fill="#DDD6FE" />
    <polygon points="50,12 50,42 80,34" fill="#8B5CF6" />
    <polygon points="20,34 10,48 50,42" fill="#A78BFA" />
    <polygon points="80,34 50,42 90,48" fill="#6D28D9" />
    <!-- Awning under-facets -->
    <polygon points="10,48 26,48 30,58 14,58" fill="#7C3AED" />
    <polygon points="26,48 42,48 46,58 30,58" fill="#6D28D9" />
    <polygon points="42,48 58,48 62,58 46,58" fill="#581C87" />
    <polygon points="58,48 74,48 78,58 62,58" fill="#4C1D95" />
    <polygon points="74,48 90,48 86,58 78,58" fill="#3B0764" />
    <!-- Faceted Columns & Body -->
    <polygon points="16,58 32,58 30,88 18,88" fill="#8B5CF6" />
    <polygon points="32,58 48,58 48,70 32,70" fill="#DDD6FE" />
    <polygon points="32,70 48,70 46,88 30,88" fill="#7C3AED" />
    <!-- Door / Center Entrance -->
    <polygon points="48,58 68,58 66,88 48,88" fill="#581C87" />
    <polygon points="52,62 64,62 62,84 52,84" fill="#3B0764" />
    <!-- Right Column (Shadowed: #4C1D95, #3B0764) -->
    <polygon points="68,58 84,58 82,88 66,88" fill="#4C1D95" />
    <!-- Base step -->
    <polygon points="12,88 88,88 84,94 16,94" fill="#3B0764" />
  </svg>`,

  'creator-sites.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <!-- Faceted Creator Diamond Sparkle / Camera Lens -->
    <!-- Top-left highlight diamond -->
    <polygon points="50,8 35,35 50,45" fill="#DDD6FE" />
    <polygon points="50,8 50,45 65,35" fill="#C4B5FD" />
    <!-- Center faceted jewel / lens ring -->
    <polygon points="35,35 15,50 35,65" fill="#A78BFA" />
    <polygon points="35,35 50,45 35,65" fill="#8B5CF6" />
    <polygon points="65,35 50,45 65,65" fill="#7C3AED" />
    <polygon points="65,35 85,50 65,65" fill="#6D28D9" />
    <!-- Inner glowing facet -->
    <polygon points="50,45 35,65 50,75" fill="#7C3AED" />
    <polygon points="50,45 65,65 50,75" fill="#581C87" />
    <!-- Bottom star tip facets -->
    <polygon points="35,65 50,75 50,92" fill="#581C87" />
    <polygon points="65,65 50,75 50,92" fill="#4C1D95" />
    <!-- Top-left sparkle facet -->
    <polygon points="18,18 26,12 28,24" fill="#DDD6FE" />
    <polygon points="18,18 28,24 22,30" fill="#A78BFA" />
    <!-- Bottom-right micro sparkle -->
    <polygon points="80,74 88,78 82,86" fill="#7C3AED" />
    <polygon points="80,74 82,86 76,82" fill="#4C1D95" />
  </svg>`,

  'portfolios.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <!-- Faceted Portfolio Showcase / Gallery Canvas -->
    <!-- Frame Top & Left (lit from top-left) -->
    <polygon points="14,16 86,16 78,26 24,26" fill="#DDD6FE" />
    <polygon points="14,16 24,26 24,76 14,84" fill="#C4B5FD" />
    <!-- Frame Right & Bottom (in shadow) -->
    <polygon points="86,16 86,84 76,76 78,26" fill="#6D28D9" />
    <polygon points="14,84 86,84 76,76 24,76" fill="#4C1D95" />
    <!-- Inner Faceted Artwork: Mountain & Sun -->
    <!-- Sun -->
    <polygon points="38,34 46,30 50,38 42,42" fill="#DDD6FE" />
    <polygon points="46,30 54,34 50,38" fill="#A78BFA" />
    <!-- Main Faceted Peak -->
    <polygon points="44,40 28,72 48,64" fill="#A78BFA" />
    <polygon points="44,40 48,64 62,72" fill="#7C3AED" />
    <!-- Secondary Peak -->
    <polygon points="60,48 50,66 66,62" fill="#8B5CF6" />
    <polygon points="60,48 66,62 74,72" fill="#581C87" />
    <!-- Base Ground facets -->
    <polygon points="24,72 48,64 74,72 24,76" fill="#3B0764" />
  </svg>`,

  'online-stores.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <!-- Faceted Shopping Bag / E-Commerce Cart -->
    <!-- Handles (Faceted arch) -->
    <polygon points="40,12 50,10 50,22 42,22" fill="#DDD6FE" />
    <polygon points="50,10 60,12 58,22 50,22" fill="#C4B5FD" />
    <polygon points="34,22 42,22 40,32 32,32" fill="#A78BFA" />
    <polygon points="60,12 68,22 60,32 58,22" fill="#7C3AED" />
    <!-- Bag Front Facets (Top-Left Lit) -->
    <!-- Top folded edge -->
    <polygon points="22,32 50,28 50,38 24,40" fill="#DDD6FE" />
    <polygon points="50,28 78,32 76,40 50,38" fill="#8B5CF6" />
    <!-- Front Upper-Left Diamond -->
    <polygon points="24,40 50,38 46,62 26,62" fill="#A78BFA" />
    <polygon points="50,38 76,40 74,62 46,62" fill="#7C3AED" />
    <!-- Lower Bag Facets -->
    <polygon points="26,62 46,62 42,88 28,88" fill="#7C3AED" />
    <polygon points="46,62 74,62 72,88 42,88" fill="#581C87" />
    <!-- Side depth facet -->
    <polygon points="76,40 84,36 82,82 72,88" fill="#4C1D95" />
    <polygon points="78,32 84,36 76,40" fill="#6D28D9" />
    <!-- Base shadow -->
    <polygon points="28,88 72,88 76,92 24,92" fill="#3B0764" />
  </svg>`,

  'security-check.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <!-- Faceted Security Shield with Center Ridge -->
    <!-- Top-left rim -->
    <polygon points="50,8 18,22 50,34" fill="#DDD6FE" />
    <polygon points="50,8 50,34 82,22" fill="#A78BFA" />
    <!-- Upper Shield Facets -->
    <polygon points="18,22 18,52 50,58 50,34" fill="#8B5CF6" />
    <polygon points="82,22 50,34 50,58 82,52" fill="#6D28D9" />
    <!-- Lower Shield Facets meeting at bottom tip -->
    <polygon points="18,52 34,76 50,92 50,58" fill="#7C3AED" />
    <polygon points="82,52 50,58 50,92 66,76" fill="#4C1D95" />
    <!-- Raised Center Keyhole / Check Emblem -->
    <polygon points="50,38 42,48 50,54" fill="#DDD6FE" />
    <polygon points="50,38 50,54 58,48" fill="#C4B5FD" />
    <polygon points="42,48 46,68 50,68 50,54" fill="#8B5CF6" />
    <polygon points="58,48 50,54 50,68 54,68" fill="#581C87" />
  </svg>`,

  'care-plans.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <!-- Faceted Care & Maintenance: Protective Crystal Heart / Gear Gem -->
    <!-- Left lobe (lit from top-left) -->
    <polygon points="50,32 30,14 16,28 32,46" fill="#DDD6FE" />
    <polygon points="30,14 42,14 50,32" fill="#C4B5FD" />
    <polygon points="16,28 16,46 32,58 32,46" fill="#A78BFA" />
    <!-- Right lobe (darker purple shades) -->
    <polygon points="50,32 58,14 70,14" fill="#8B5CF6" />
    <polygon points="50,32 70,14 84,28 68,46" fill="#7C3AED" />
    <polygon points="84,28 84,46 68,58 68,46" fill="#6D28D9" />
    <!-- Center jewel facet -->
    <polygon points="50,32 32,46 50,62" fill="#8B5CF6" />
    <polygon points="50,32 50,62 68,46" fill="#6D28D9" />
    <!-- Bottom tapered heart facets -->
    <polygon points="32,58 50,62 50,88" fill="#7C3AED" />
    <polygon points="68,58 50,62 50,88" fill="#4C1D95" />
    <!-- Outer orbiting faceted sync dots / care pulse -->
    <polygon points="10,64 16,60 18,68 12,70" fill="#DDD6FE" />
    <polygon points="86,66 92,62 90,72 84,70" fill="#8B5CF6" />
  </svg>`,
};

for (const [filename, svg] of Object.entries(icons)) {
  fs.writeFileSync(path.join(iconsDir, filename), svg.trim(), 'utf-8');
}
console.log('Faceted SVG icons written to public/assets/img/icons/');

// 2. Generate 1200x630 Open Graph Image (PNG + WebP)
async function generateOGImage() {
  const ogSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGlow" cx="20%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.25"/>
        <stop offset="60%" stop-color="#14141F" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#0B0B14" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="purpleText" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="60%" stop-color="#DDD6FE"/>
        <stop offset="100%" stop-color="#A78BFA"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="#0B0B14"/>
    <rect width="1200" height="630" fill="url(#bgGlow)"/>

    <!-- Subtle border frame -->
    <rect x="30" y="30" width="1140" height="570" rx="24" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>

    <!-- LevelUp Faceted 5-point Star (120x120 at x=100, y=90) -->
    <g transform="translate(100, 90) scale(1.4)">
      <!-- Arm 0: Top -->
      <polygon points="50,50 39.42,35.44 50,6" fill="#DDD6FE" />
      <polygon points="50,50 50,6 60.58,35.44" fill="#8B5CF6" />
      <!-- Arm 1: Right -->
      <polygon points="50,50 60.58,35.44 91.85,36.4" fill="#7C3AED" />
      <polygon points="50,50 91.85,36.4 67.12,55.56" fill="#581C87" />
      <!-- Arm 2: Bottom-Right -->
      <polygon points="50,50 67.12,55.56 75.86,85.6" fill="#4C1D95" />
      <polygon points="50,50 75.86,85.6 50,68" fill="#3B0764" />
      <!-- Arm 3: Bottom-Left -->
      <polygon points="50,50 50,68 24.14,85.6" fill="#581C87" />
      <polygon points="50,50 24.14,85.6 32.88,55.56" fill="#7C3AED" />
      <!-- Arm 4: Left -->
      <polygon points="50,50 32.88,55.56 8.15,36.4" fill="#8B5CF6" />
      <polygon points="50,50 8.15,36.4 39.42,35.44" fill="#C4B5FD" />
    </g>

    <!-- Studio Brand Wordmark -->
    <text x="270" y="155" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="800" fill="#FFFFFF" letter-spacing="-0.5">LevelUp Ecosystem</text>
    <text x="270" y="195" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#A78BFA" letter-spacing="1.5">WEB STUDIO &amp; SECURITY INFRASTRUCTURE</text>

    <!-- Main Headline -->
    <text x="100" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="800" fill="url(#purpleText)" letter-spacing="-1">Fast, professional websites</text>
    <text x="100" y="385" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="800" fill="#FFFFFF" letter-spacing="-1">with booking &amp; security built in.</text>

    <!-- Subtitle / Value Proposition -->
    <text x="100" y="450" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400" fill="#A1A1B5">For local businesses, creators &amp; portfolios • Built in San Diego, CA</text>

    <!-- Badges / Pill Tags at bottom -->
    <g transform="translate(100, 500)">
      <!-- Badge 1: Online Booking -->
      <rect x="0" y="0" width="220" height="44" rx="22" fill="#14141F" stroke="#7C3AED" stroke-opacity="0.4" stroke-width="1.5"/>
      <circle cx="24" cy="22" r="6" fill="#10B981"/>
      <text x="42" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#FFFFFF">Online Booking 24/7</text>

      <!-- Badge 2: Security Checked -->
      <rect x="240" y="0" width="230" height="44" rx="22" fill="#14141F" stroke="#7C3AED" stroke-opacity="0.4" stroke-width="1.5"/>
      <circle cx="264" cy="22" r="6" fill="#8B5CF6"/>
      <text x="282" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#FFFFFF">Security Audit Passed</text>

      <!-- Badge 3: Free Preview -->
      <rect x="490" y="0" width="210" height="44" rx="22" fill="#7C3AED" />
      <text x="532" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#FFFFFF">Free Site Preview →</text>
    </g>

    <!-- Right side decorative mini faceted star -->
    <g transform="translate(1030, 260) scale(0.9) rotate(15)">
      <polygon points="50,6 60.58,35.44 91.85,36.4 67.12,55.56 75.86,85.6 50,68 24.14,85.6 32.88,55.56 8.15,36.4 39.42,35.44" stroke="#7C3AED" stroke-width="2" fill="none" opacity="0.35"/>
    </g>
  </svg>`;

  await sharp(Buffer.from(ogSvg))
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(path.join(outDir, 'og-image.png'));

  await sharp(Buffer.from(ogSvg))
    .webp({ quality: 88 })
    .toFile(path.join(outDir, 'og-image.webp'));

  console.log('OG image created: 1200x630 PNG and WebP');
}

// 3. Process Real Project & Hero Screenshots
async function processScreenshots() {
  const laptopHeroPath = path.resolve('public/laptop-hero.jpg');
  const finalStopPath = path.resolve('public/finalstop-preview.jpg');

  // Hero Image (under 150 KB budget)
  // Responsive sizes: 1200w, 800w
  await sharp(laptopHeroPath)
    .resize(1200, 750, { fit: 'cover' })
    .avif({ quality: 75 })
    .toFile(path.join(outDir, 'laptop-hero-1200.avif'));

  await sharp(laptopHeroPath)
    .resize(1200, 750, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(path.join(outDir, 'laptop-hero-1200.webp'));

  await sharp(laptopHeroPath)
    .resize(800, 500, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(path.join(outDir, 'laptop-hero-800.webp'));

  await sharp(laptopHeroPath)
    .resize(1200, 750, { fit: 'cover' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(outDir, 'laptop-hero-1200.jpg'));

  await sharp(laptopHeroPath)
    .resize(800, 500, { fit: 'cover' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(outDir, 'laptop-hero-800.jpg'));

  // Final Stop Desktop Screenshot inside Clean Desktop Browser Frame
  // Size: 1000 x 625
  const desktopWidth = 1000;
  const desktopHeight = 625;
  const chromeHeaderHeight = 36;
  const contentHeight = desktopHeight - chromeHeaderHeight;

  const croppedDesktop = await sharp(finalStopPath)
    .resize(desktopWidth, contentHeight, { fit: 'cover', position: 'top' })
    .toBuffer();

  const desktopBrowserChromeSvg = `<svg width="${desktopWidth}" height="${desktopHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${desktopWidth}" height="${desktopHeight}" rx="12" fill="#14141F" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
    <!-- Window controls -->
    <circle cx="20" cy="18" r="5" fill="#EF4444"/>
    <circle cx="36" cy="18" r="5" fill="#F59E0B"/>
    <circle cx="52" cy="18" r="5" fill="#10B981"/>
    <!-- URL Bar -->
    <rect x="80" y="8" width="340" height="20" rx="5" fill="#0B0B14" stroke="rgba(255,255,255,0.08)"/>
    <text x="96" y="22" font-family="system-ui, sans-serif" font-size="11" fill="#A1A1B5">🔒 finalstop.org (Live Client Site)</text>
    <!-- Right status dot -->
    <circle cx="${desktopWidth - 24}" cy="18" r="4" fill="#7C3AED"/>
  </svg>`;

  const desktopFrameBuffer = await sharp(Buffer.from(desktopBrowserChromeSvg))
    .composite([
      {
        input: croppedDesktop,
        top: chromeHeaderHeight,
        left: 0,
      }
    ])
    .png()
    .toBuffer();

  // Save Desktop Frame versions (budget under 100 KB)
  await sharp(desktopFrameBuffer)
    .resize(1000, 625)
    .avif({ quality: 70 })
    .toFile(path.join(outDir, 'finalstop-desktop.avif'));

  await sharp(desktopFrameBuffer)
    .resize(1000, 625)
    .webp({ quality: 80 })
    .toFile(path.join(outDir, 'finalstop-desktop.webp'));

  await sharp(desktopFrameBuffer)
    .resize(700, 438)
    .webp({ quality: 78 })
    .toFile(path.join(outDir, 'finalstop-desktop-700.webp'));

  await sharp(desktopFrameBuffer)
    .resize(1000, 625)
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(outDir, 'finalstop-desktop.jpg'));

  // Final Stop Mobile Frame (Phone mockup: 380 x 780)
  // Let's crop a vertical segment of the booking/service part of finalstop
  const mobileWidth = 380;
  const mobileHeight = 780;
  const mobileHeader = 40;
  const mobileContentHeight = mobileHeight - mobileHeader - 24;

  const croppedMobile = await sharp(finalStopPath)
    .extract({ left: 180, top: 0, width: 640, height: 768 })
    .resize(mobileWidth - 16, mobileContentHeight, { fit: 'cover' })
    .toBuffer();

  const phoneChromeSvg = `<svg width="${mobileWidth}" height="${mobileHeight}" xmlns="http://www.w3.org/2000/svg">
    <!-- Phone body -->
    <rect width="${mobileWidth}" height="${mobileHeight}" rx="38" fill="#14141F" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
    <!-- Phone Island / speaker -->
    <rect x="${mobileWidth/2 - 45}" y="12" width="90" height="20" rx="10" fill="#0B0B14"/>
    <circle cx="${mobileWidth/2 + 25}" cy="22" r="3.5" fill="#1E1E2E"/>
    <!-- Bottom home bar -->
    <rect x="${mobileWidth/2 - 40}" y="${mobileHeight - 14}" width="80" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
  </svg>`;

  const mobileFrameBuffer = await sharp(Buffer.from(phoneChromeSvg))
    .composite([
      {
        input: croppedMobile,
        top: mobileHeader,
        left: 8,
      }
    ])
    .png()
    .toBuffer();

  await sharp(mobileFrameBuffer)
    .resize(380, 780)
    .avif({ quality: 70 })
    .toFile(path.join(outDir, 'finalstop-mobile.avif'));

  await sharp(mobileFrameBuffer)
    .resize(380, 780)
    .webp({ quality: 80 })
    .toFile(path.join(outDir, 'finalstop-mobile.webp'));

  await sharp(mobileFrameBuffer)
    .resize(380, 780)
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(outDir, 'finalstop-mobile.jpg'));

  console.log('Processed screenshots into AVIF, WebP, JPG');
}

async function run() {
  await generateOGImage();
  await processScreenshots();

  // Print file sizes
  const files = fs.readdirSync(outDir).filter(f => !fs.statSync(path.join(outDir, f)).isDirectory());
  for (const f of files) {
    const sz = fs.statSync(path.join(outDir, f)).size;
    console.log(`- ${f}: ${(sz / 1024).toFixed(1)} KB`);
  }
}

run().catch(console.error);
