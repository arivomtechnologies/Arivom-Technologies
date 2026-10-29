const fs = require('fs');
const sharp = require('sharp');

const LOCKUP_PATH = '/Users/adsadmin/.gemini/antigravity/brain/5c5f9455-1202-4468-ae4a-bb63ec95e7d2/.user_uploaded/media_1793255124897_47ff78ad.png';
const EMBLEM_PATH = '/Users/adsadmin/.gemini/antigravity/brain/5c5f9455-1202-4468-ae4a-bb63ec95e7d2/.user_uploaded/media_1793255237937_a30eb46c.png';

async function generateBanner() {
  console.log('Generating redesigned share banner (1200x630)...');
  const W = 1200, H = 630;

  // Prepare the full lockup image — trimmed, scaled to fit ~480px wide
  const lockupTrimmed = await sharp(LOCKUP_PATH).trim().toBuffer();
  const lockupScaled = await sharp(lockupTrimmed)
    .resize(460, null, { fit: 'inside' })
    .png()
    .toBuffer();
  const lockupMeta = await sharp(lockupScaled).metadata();

  // Prepare emblem for the bottom-right watermark area — scaled small
  const emblemTrimmed = await sharp(EMBLEM_PATH).trim().toBuffer();
  const emblemSmall = await sharp(emblemTrimmed)
    .resize(null, 90, { fit: 'inside' })
    .ensureAlpha(0.08)
    .png()
    .toBuffer();
  const emblemSmallMeta = await sharp(emblemSmall).metadata();

  // Build the base canvas: Deep Navy #0B1437 background
  // with a subtle lighter gradient patch on the left
  const bgSvg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Base deep navy gradient -->
    <linearGradient id="bg-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1A42"/>
      <stop offset="50%" stop-color="#0B1437"/>
      <stop offset="100%" stop-color="#080E2A"/>
    </linearGradient>
    <!-- Warm orange glow top-left -->
    <radialGradient id="glow-tl" cx="10%" cy="15%" r="45%">
      <stop offset="0%" stop-color="#FF6B00" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#FF6B00" stop-opacity="0"/>
    </radialGradient>
    <!-- Subtle glow bottom-right -->
    <radialGradient id="glow-br" cx="90%" cy="85%" r="40%">
      <stop offset="0%" stop-color="#FF6B00" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#FF6B00" stop-opacity="0"/>
    </radialGradient>
    <!-- Subtle grid pattern -->
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FFFFFF" stroke-width="0.4" stroke-opacity="0.04"/>
    </pattern>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg-main)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect width="100%" height="100%" fill="url(#glow-tl)"/>
  <rect width="100%" height="100%" fill="url(#glow-br)"/>

  <!-- Top accent line: thin orange stripe -->
  <rect x="0" y="0" width="100%" height="4" fill="#FF6B00"/>

  <!-- Tagline pill: Light Orange #FFF4E8 border -->
  <rect x="80" y="270" width="200" height="34" rx="17" fill="none" stroke="#FF6B00" stroke-opacity="0.5" stroke-width="1.5"/>
  <text x="180" y="292" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#FF6B00" text-anchor="middle" letter-spacing="2">INNOVATE • BUILD • GROW</text>

  <!-- Main headline -->
  <text x="80" y="350" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5">Software &amp; Web</text>
  <text x="80" y="398" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5">Development Company</text>

  <!-- Subtitle in slate -->
  <text x="80" y="435" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#94A3B8">Custom software, business websites, mobile apps &amp; enterprise microservices.</text>

  <!-- Four service pills at bottom -->
  <g transform="translate(80, 475)">
    <!-- Pill 1 -->
    <rect width="140" height="30" rx="15" fill="#FF6B00" fill-opacity="0.15"/>
    <text x="70" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#FF6B00" text-anchor="middle">Web Applications</text>
    <!-- Pill 2 -->
    <rect x="152" width="120" height="30" rx="15" fill="#FF6B00" fill-opacity="0.15"/>
    <text x="212" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#FF6B00" text-anchor="middle">Mobile Apps</text>
    <!-- Pill 3 -->
    <rect x="284" width="160" height="30" rx="15" fill="#FF6B00" fill-opacity="0.15"/>
    <text x="364" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#FF6B00" text-anchor="middle">Cloud Microservices</text>
    <!-- Pill 4 -->
    <rect x="456" width="160" height="30" rx="15" fill="#FF6B00" fill-opacity="0.15"/>
    <text x="536" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#FF6B00" text-anchor="middle">Business Websites</text>
  </g>

  <!-- Bottom bar -->
  <g transform="translate(80, 540)">
    <text x="0" y="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#64748B">
      <tspan fill="#FF6B00">✓</tspan> Fixed INR Milestones
      <tspan dx="12" fill="#FF6B00">✓</tspan> 100% Code Handover
      <tspan dx="12" fill="#FF6B00">✓</tspan> Zero Hidden Costs
      <tspan dx="12" fill="#FF6B00">✓</tspan> Post-Launch Warranty
    </text>
  </g>

  <!-- CTA pill bottom-right -->
  <g transform="translate(900, 560)">
    <rect width="230" height="42" rx="21" fill="#FF6B00"/>
    <text x="115" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">arivomtechnologies.com</text>
  </g>

  <!-- Star trust badge top-right -->
  <g transform="translate(920, 80)">
    <rect width="210" height="48" rx="24" fill="#FFFFFF" fill-opacity="0.08" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1"/>
    <circle cx="28" cy="24" r="14" fill="#FFF4E8" fill-opacity="0.2"/>
    <text x="28" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#FF6B00" text-anchor="middle">★</text>
    <text x="54" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#FFFFFF">5.0 Star Client Trust</text>
    <text x="54" y="37" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#94A3B8">Chennai, India • Global SLA</text>
  </g>

  <!-- Pricing badge -->
  <g transform="translate(920, 144)">
    <rect width="210" height="40" rx="20" fill="#059669" fill-opacity="0.15" stroke="#059669" stroke-opacity="0.3" stroke-width="1"/>
    <text x="105" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#34D399" text-anchor="middle">Packages from ₹10K–₹15K</text>
  </g>
</svg>`;

  const bgBuffer = await sharp(Buffer.from(bgSvg)).png().toBuffer();

  // Composite: background + lockup logo (top-left area) + subtle watermark emblem
  const result = await sharp(bgBuffer)
    .composite([
      // Full lockup in the upper-left — the hero branding
      {
        input: lockupScaled,
        left: 80,
        top: Math.round(80),
      },
      // Subtle large watermark emblem on the right side — 10% opacity
      {
        input: await (async () => {
          const resized = await sharp(emblemTrimmed)
            .resize(null, 280, { fit: 'inside' })
            .raw()
            .toBuffer({ resolveWithObject: true });
          // Manually reduce alpha channel to ~10%
          const { data, info } = resized;
          for (let i = 3; i < data.length; i += 4) {
            data[i] = Math.round(data[i] * 0.10);
          }
          return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
            .png()
            .toBuffer();
        })(),
        left: 850,
        top: 250,
      },
    ])
    .jpeg({ quality: 93, chromaSubsampling: '4:4:4' })
    .toFile('public/images/arivom-share-banner.jpg');

  console.log('✓ Saved public/images/arivom-share-banner.jpg (1200x630)');
}

async function generateSquare() {
  console.log('Generating redesigned share square (600x600)...');
  const S = 600;

  // Prepare emblem — trimmed, scaled to fit prominently
  const emblemTrimmed = await sharp(EMBLEM_PATH).trim().toBuffer();
  const emblemScaled = await sharp(emblemTrimmed)
    .resize(200, null, { fit: 'inside' })
    .png()
    .toBuffer();
  const emblemMeta = await sharp(emblemScaled).metadata();

  const bgSvg = `
<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sq-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1A42"/>
      <stop offset="50%" stop-color="#0B1437"/>
      <stop offset="100%" stop-color="#080E2A"/>
    </linearGradient>
    <radialGradient id="sq-glow" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#FF6B00" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#FF6B00" stop-opacity="0"/>
    </radialGradient>
    <pattern id="sq-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" stroke-width="0.4" stroke-opacity="0.04"/>
    </pattern>
  </defs>

  <rect width="100%" height="100%" fill="url(#sq-bg)"/>
  <rect width="100%" height="100%" fill="url(#sq-grid)"/>
  <rect width="100%" height="100%" fill="url(#sq-glow)"/>

  <!-- Top accent line -->
  <rect x="0" y="0" width="100%" height="4" fill="#FF6B00"/>

  <!-- Subtle accent line behind emblem area -->
  <line x1="200" y1="270" x2="400" y2="270" stroke="#FF6B00" stroke-opacity="0.15" stroke-width="1"/>

  <!-- Brand name -->
  <text x="300" y="320" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">ARIVOM</text>
  <text x="300" y="350" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#64748B" text-anchor="middle" letter-spacing="7">TECHNOLOGIES</text>

  <!-- Tagline pill -->
  <rect x="175" y="375" width="250" height="34" rx="17" fill="none" stroke="#FF6B00" stroke-opacity="0.5" stroke-width="1.2"/>
  <text x="300" y="397" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10.5" font-weight="800" fill="#FF6B00" text-anchor="middle" letter-spacing="1.8">INNOVATE • BUILD • GROW</text>

  <!-- Service line -->
  <text x="300" y="442" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#E2E8F0" text-anchor="middle">Software &amp; Web Development Studio</text>
  <text x="300" y="465" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="500" fill="#94A3B8" text-anchor="middle">Angular 19 • Spring Boot 3 • React Native • Cloud</text>

  <!-- Pricing badge -->
  <rect x="165" y="486" width="270" height="30" rx="15" fill="#059669" fill-opacity="0.15" stroke="#059669" stroke-opacity="0.3" stroke-width="1"/>
  <text x="300" y="506" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#34D399" text-anchor="middle">Starter Websites ₹10K–₹15K • 100% Code Handover</text>

  <!-- Bottom URL bar -->
  <rect x="150" y="540" width="300" height="36" rx="18" fill="#FF6B00"/>
  <text x="300" y="563" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">arivomtechnologies.com</text>
</svg>`;

  const bgBuffer = await sharp(Buffer.from(bgSvg)).png().toBuffer();

  // Center the emblem in the top portion
  const emblemLeft = Math.round((S - emblemMeta.width) / 2);

  const result = await sharp(bgBuffer)
    .composite([
      {
        input: emblemScaled,
        left: emblemLeft,
        top: 75,
      },
    ])
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile('public/images/arivom-share-square.jpg');

  console.log('✓ Saved public/images/arivom-share-square.jpg (600x600)');
}

async function main() {
  await generateBanner();
  await generateSquare();
  console.log('Done! Both share images redesigned.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
