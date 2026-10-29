const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadedEmblem = '/Users/adsadmin/.gemini/antigravity/brain/5c5f9455-1202-4468-ae4a-bb63ec95e7d2/.user_uploaded/media_1793255237937_a30eb46c.png';
const uploadedLockup = '/Users/adsadmin/.gemini/antigravity/brain/5c5f9455-1202-4468-ae4a-bb63ec95e7d2/.user_uploaded/media_1793255124897_47ff78ad.png';

// Palette definitions matching user exact guidelines
const PALETTE = {
  primaryOrange: '#FF6B00',
  deepNavy: '#0B1437',
  pureWhite: '#FFFFFF',
  lightOrange: '#FFF4E8',
  slateGray: '#64748B',
  borderOrange: 'rgba(255, 107, 0, 0.3)',
};

async function main() {
  console.log('Generating brand assets with official stylized A emblem and recommended color palette...');

  // 1. Process trimmed emblem and full lockup
  const trimmedEmblemBuf = await sharp(uploadedEmblem)
    .trim()
    .png({ compressionLevel: 9 })
    .toBuffer();
  
  const emblemMeta = await sharp(trimmedEmblemBuf).metadata();
  console.log(`Trimmed emblem: ${emblemMeta.width}x${emblemMeta.height}`);

  fs.writeFileSync('public/images/arivom-growth-emblem.png', trimmedEmblemBuf);
  fs.writeFileSync('public/images/arivom-header-logo.png', trimmedEmblemBuf);

  const trimmedLockupBuf = await sharp(uploadedLockup)
    .trim()
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync('public/images/arivom-full-logo.png', trimmedLockupBuf);

  // Generate SVG version of header logo
  const emblemB64 = trimmedEmblemBuf.toString('base64');
  const headerLogoSvg = `<svg viewBox="0 0 ${emblemMeta.width} ${emblemMeta.height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image width="${emblemMeta.width}" height="${emblemMeta.height}" href="data:image/png;base64,${emblemB64}" />
</svg>`;
  fs.writeFileSync('public/images/arivom-header-logo.svg', headerLogoSvg);
  console.log('✓ Generated public/images/arivom-header-logo.svg and .png');

  // 2. Generate AI Assistant Emblem SVG & PNG
  // Circular badge: Deep Navy #0B1437 base, glowing ring, orbit lines, centered emblem
  const aiSvg = `
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <radialGradient id="ai-bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#121F4E" />
      <stop offset="70%" stop-color="#0B1437" />
      <stop offset="100%" stop-color="#070D24" />
    </radialGradient>
    <linearGradient id="ai-ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B00" />
      <stop offset="50%" stop-color="#FFA84A" />
      <stop offset="100%" stop-color="#FF6B00" />
    </linearGradient>
    <filter id="ai-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Deep Navy Base -->
  <circle cx="100" cy="100" r="96" fill="url(#ai-bg)" />
  
  <!-- Outer Glow Ring -->
  <circle cx="100" cy="100" r="95" stroke="url(#ai-ring)" stroke-width="2.5" />
  
  <!-- Subtle Concentric Orbit Lines -->
  <circle cx="100" cy="100" r="82" stroke="#FF6B00" stroke-opacity="0.3" stroke-width="1" stroke-dasharray="3 4" />
  <circle cx="100" cy="100" r="68" stroke="#38BDF8" stroke-opacity="0.2" stroke-width="1" stroke-dasharray="2 3" />
  
  <!-- Center Ambient Warmth -->
  <circle cx="100" cy="100" r="38" fill="#FF6B00" opacity="0.2" filter="url(#ai-glow)" />

  <!-- Centered Emblem -->
  <g transform="translate(36, 49) scale(0.16)">
    <image width="${emblemMeta.width}" height="${emblemMeta.height}" href="data:image/png;base64,${emblemB64}" />
  </g>
</svg>
`;
  fs.writeFileSync('public/images/arivom-ai-emblem.svg', aiSvg);
  const aiPng = await sharp(Buffer.from(aiSvg)).png().toBuffer();
  fs.writeFileSync('public/images/arivom-ai-emblem.png', aiPng);
  console.log('✓ Generated public/images/arivom-ai-emblem.svg and .png');

  // 3. Generate Square Brand Logo (512x512) for SEO and structured data
  const emblemScaled = await sharp(trimmedEmblemBuf)
    .resize(430, 290, { fit: 'inside' })
    .toBuffer();
  const scaledMeta = await sharp(emblemScaled).metadata();
  const sLeft = Math.round((512 - scaledMeta.width) / 2);
  const sTop = Math.round((512 - scaledMeta.height) / 2);

  const square512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    }
  })
  .composite([{ input: emblemScaled, left: sLeft, top: sTop }])
  .png({ compressionLevel: 9 })
  .toBuffer();
  fs.writeFileSync('public/images/arivom-brand-logo-square.png', square512);
  console.log('✓ Generated public/images/arivom-brand-logo-square.png (512x512)');

  // 4. Generate all Favicons and Apple Touch Icon
  const faviconSizes = [
    { file: 'public/favicon-192x192.png', size: 192 },
    { file: 'public/favicon-144x144.png', size: 144 },
    { file: 'public/favicon-96x96.png', size: 96 },
    { file: 'public/favicon-48x48.png', size: 48 },
    { file: 'public/favicon.png', size: 32 }
  ];

  for (const s of faviconSizes) {
    const resized = await sharp(square512).resize(s.size, s.size).png().toBuffer();
    fs.writeFileSync(s.file, resized);
  }
  const icoBuf = await sharp(square512).resize(48, 48).png().toBuffer();
  fs.writeFileSync('public/favicon.ico', icoBuf);

  // Apple Touch Icon: 180x180 with squircle Deep Navy #0B1437
  const touchEmblem = await sharp(trimmedEmblemBuf)
    .resize(136, 92, { fit: 'inside' })
    .toBuffer();
  const touchMeta = await sharp(touchEmblem).metadata();
  const tLeft = Math.round((180 - touchMeta.width) / 2);
  const tTop = Math.round((180 - touchMeta.height) / 2);

  const appleTouchBuf = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 11, g: 20, b: 55, alpha: 1 } // #0B1437
    }
  })
  .composite([{ input: touchEmblem, left: tLeft, top: tTop }])
  .png()
  .toBuffer();
  fs.writeFileSync('public/apple-touch-icon.png', appleTouchBuf);
  console.log('✓ Generated all favicons and apple-touch-icon.png');

  // 5. Generate Social Share Banner (1200x630) for WhatsApp, LinkedIn, Twitter, Facebook
  const bannerWidth = 1200;
  const bannerHeight = 630;

  // Scale emblem for the banner capsule: height 44px
  const bannerEmblem = await sharp(trimmedEmblemBuf)
    .resize(null, 44)
    .png()
    .toBuffer();
  const bannerEmblemMeta = await sharp(bannerEmblem).metadata();
  const bannerEmblemB64 = bannerEmblem.toString('base64');

  const bannerSvg = `
<svg width="${bannerWidth}" height="${bannerHeight}" viewBox="0 0 ${bannerWidth} ${bannerHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <radialGradient id="glow-orange" cx="15%" cy="20%" r="55%">
      <stop offset="0%" stop-color="#FF6B00" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#FF6B00" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow-amber" cx="85%" cy="80%" r="55%">
      <stop offset="0%" stop-color="#FFA84A" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#FFA84A" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B00" stop-opacity="0.5" />
      <stop offset="50%" stop-color="#CBD5E1" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#FF6B00" stop-opacity="0.4" />
    </linearGradient>
    <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" stroke-width="0.7" stroke-opacity="0.7"/>
    </pattern>
    <linearGradient id="card-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FBFDFF" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="100%" height="100%" fill="#F8FAFC" />
  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
  <rect width="100%" height="100%" fill="url(#glow-orange)" />
  <rect width="100%" height="100%" fill="url(#glow-amber)" />

  <!-- Outer Rounded Border Frame -->
  <rect x="20" y="20" width="1160" height="590" rx="28" fill="none" stroke="url(#border-grad)" stroke-width="2" />

  <!-- Top Floating Capsule Header -->
  <g transform="translate(60, 52)">
    <!-- Capsule Pill -->
    <rect width="520" height="74" rx="37" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
    
    <!-- Official Emblem -->
    <g transform="translate(20, 15)">
      <image width="${bannerEmblemMeta.width}" height="${bannerEmblemMeta.height}" href="data:image/png;base64,${bannerEmblemB64}" />
    </g>

    <!-- Brand Typography in Deep Navy #0B1437 & Slate Gray #64748B -->
    <text x="96" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="25" font-weight="900" fill="#0B1437" letter-spacing="-0.5">ARIVOM</text>
    <text x="96" y="59" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10.5" font-weight="800" fill="#64748B" letter-spacing="4.5">TECHNOLOGIES</text>

    <!-- Tagline Badge in Light Orange #FFF4E8 -->
    <g transform="translate(320, 18)">
      <rect width="176" height="38" rx="19" fill="#FFF4E8" stroke="#FED7AA" stroke-width="1" />
      <text x="88" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" fill="#FF6B00" text-anchor="middle" letter-spacing="1.5">INNOVATE • BUILD • GROW</text>
    </g>
  </g>

  <!-- Top Right Trust Badge -->
  <g transform="translate(860, 60)">
    <rect width="280" height="58" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
    <circle cx="34" cy="29" r="16" fill="#FFF4E8" />
    <text x="34" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" fill="#FF6B00" text-anchor="middle">★</text>
    <text x="64" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#0B1437">5.0 Star Client Trust</text>
    <text x="64" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748B">Chennai, India • Global SLA</text>
  </g>

  <!-- Main Headline Block -->
  <text x="60" y="196" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="#0B1437" letter-spacing="-1">
    Software &amp; Web Development Company
  </text>
  <text x="60" y="238" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="500" fill="#64748B">
    Custom software, business websites, mobile apps, and enterprise microservices.
  </text>

  <!-- 4 Feature Cards with #FFF4E8 accents -->
  <g transform="translate(60, 276)">
    <!-- Card 1: Web Apps -->
    <g transform="translate(0, 0)">
      <rect width="254" height="152" rx="20" fill="url(#card-grad)" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="20" y="20" width="40" height="40" rx="12" fill="#FFF4E8" stroke="#FED7AA" stroke-width="1" />
      <path d="M 34 44 L 28 39 L 34 34 M 46 34 L 52 39 L 46 44 M 42 32 L 38 46" stroke="#FF6B00" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0B1437">Web Applications</text>
      <text x="20" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748B">Angular 19 &amp; Spring Boot 3</text>
      <text x="20" y="132" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#FF6B00">Enterprise SLA Architecture</text>
    </g>

    <!-- Card 2: Mobile Apps -->
    <g transform="translate(274, 0)">
      <rect width="254" height="152" rx="20" fill="url(#card-grad)" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="20" y="20" width="40" height="40" rx="12" fill="#E0F2FE" stroke="#BAE6FD" stroke-width="1" />
      <rect x="32" y="28" width="16" height="24" rx="3" stroke="#0284C7" stroke-width="2" fill="none" />
      <line x1="38" y1="46" x2="42" y2="46" stroke="#0284C7" stroke-width="2" stroke-linecap="round" />
      <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0B1437">Mobile Apps</text>
      <text x="20" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748B">iOS &amp; Android Apps</text>
      <text x="20" y="132" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#0284C7">React Native 60 FPS Native UI</text>
    </g>

    <!-- Card 3: Cloud Microservices -->
    <g transform="translate(548, 0)">
      <rect width="254" height="152" rx="20" fill="url(#card-grad)" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="20" y="20" width="40" height="40" rx="12" fill="#EEF2FF" stroke="#C7D2FE" stroke-width="1" />
      <path d="M 29 44 C 27 44 26 42.5 26 40.5 C 26 38.5 27.5 37 29.5 37 C 29.8 34.5 32 32.5 35 32.5 C 38.2 32.5 40.5 34.8 40.8 37.5 C 41.5 37.2 42.2 37 43 37 C 45.2 37 47 38.8 47 41 C 47 42.8 45.5 44 43.5 44 Z" stroke="#4F46E5" stroke-width="2" stroke-linejoin="round" fill="none" />
      <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0B1437">Cloud Microservices</text>
      <text x="20" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748B">Docker, Kubernetes &amp; APIs</text>
      <text x="20" y="132" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#4F46E5">Fault-Tolerant Scale</text>
    </g>

    <!-- Card 4: Business Websites & Pricing -->
    <g transform="translate(822, 0)">
      <rect width="258" height="152" rx="20" fill="url(#card-grad)" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="20" y="20" width="40" height="40" rx="12" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
      <path d="M 33 30 L 45 30 M 33 35 L 43 35 M 33 46 L 41 38 M 35 30 L 35 38 C 38 38 43 38 43 34 C 43 30 38 30 35 30" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0B1437">Business Websites</text>
      <text x="20" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748B">1–2 Weeks Fast Delivery</text>
      <text x="20" y="132" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#059669">Packages: ₹10K – ₹15K</text>
    </g>
  </g>

  <!-- Bottom Bar: Deep Navy #0B1437 + Primary Orange #FF6B00 -->
  <g transform="translate(60, 480)">
    <rect width="1080" height="74" rx="20" fill="#0B1437" />
    
    <text x="32" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#94A3B8">
      <tspan fill="#FF6B00">✓</tspan> Fixed INR Milestones   
      <tspan dx="16" fill="#FF6B00">✓</tspan> 100% Code Handover   
      <tspan dx="16" fill="#FF6B00">✓</tspan> Zero Hidden Costs   
      <tspan dx="16" fill="#FF6B00">✓</tspan> Full Post-Launch Warranty
    </text>

    <!-- Web URL Button in Primary Orange #FF6B00 -->
    <g transform="translate(820, 16)">
      <rect width="228" height="42" rx="12" fill="#FF6B00" />
      <text x="114" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">arivomtechnologies.com →</text>
    </g>
  </g>
</svg>
`;

  await sharp(Buffer.from(bannerSvg))
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile('public/images/arivom-share-banner.jpg');
  console.log('✓ Generated public/images/arivom-share-banner.jpg (1200x630)');

  // 6. Generate Social Share Square (600x600) for WhatsApp & Telegram links
  const squareEmblem = await sharp(trimmedEmblemBuf)
    .resize(220, 150, { fit: 'inside' })
    .png()
    .toBuffer();
  const squareEmblemMeta = await sharp(squareEmblem).metadata();
  const squareEmblemB64 = squareEmblem.toString('base64');
  const sqOffX = Math.round((504 - squareEmblemMeta.width) / 2);

  const squareSvg = `
<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <radialGradient id="sq-glow-orange" cx="50%" cy="25%" r="50%">
      <stop offset="0%" stop-color="#FF6B00" stop-opacity="0.16" />
      <stop offset="100%" stop-color="#FF6B00" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="sq-glow-amber" cx="50%" cy="85%" r="45%">
      <stop offset="0%" stop-color="#FFA84A" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#FFA84A" stop-opacity="0" />
    </radialGradient>
    <pattern id="sq-grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" stroke-width="0.7" stroke-opacity="0.6"/>
    </pattern>
    <linearGradient id="sq-border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B00" stop-opacity="0.6" />
      <stop offset="50%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#FF6B00" stop-opacity="0.5" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="100%" height="100%" fill="#F8FAFC" />
  <rect width="100%" height="100%" fill="url(#sq-grid)" />
  <rect width="100%" height="100%" fill="url(#sq-glow-orange)" />
  <rect width="100%" height="100%" fill="url(#sq-glow-amber)" />

  <!-- Outer Rounded Border -->
  <rect x="16" y="16" width="568" height="568" rx="32" fill="none" stroke="url(#sq-border)" stroke-width="2" />

  <!-- Central Card Container in Pure White #FFFFFF -->
  <g transform="translate(48, 48)">
    <rect width="504" height="504" rx="28" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
    
    <!-- Large Centered Emblem -->
    <g transform="translate(${sqOffX}, 34)">
      <image width="${squareEmblemMeta.width}" height="${squareEmblemMeta.height}" href="data:image/png;base64,${squareEmblemB64}" />
    </g>

    <!-- Brand Typography in Deep Navy #0B1437 -->
    <text x="252" y="218" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="#0B1437" text-anchor="middle" letter-spacing="-0.5">ARIVOM</text>
    <text x="252" y="246" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#64748B" text-anchor="middle" letter-spacing="7">TECHNOLOGIES</text>

    <!-- Tagline Pill in Light Orange #FFF4E8 -->
    <g transform="translate(142, 268)">
      <rect width="220" height="36" rx="18" fill="#FFF4E8" stroke="#FED7AA" stroke-width="1" />
      <text x="110" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#FF6B00" text-anchor="middle" letter-spacing="1.5">INNOVATE • BUILD • GROW</text>
    </g>

    <!-- Service Title & Subtitle -->
    <text x="252" y="342" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#0B1437" text-anchor="middle">Software &amp; Web Development Studio</text>
    <text x="252" y="368" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#64748B" text-anchor="middle">Angular 19 • Spring Boot 3 • React Native • Cloud</text>

    <!-- INR Packages Highlight Badge -->
    <g transform="translate(102, 396)">
      <rect width="300" height="34" rx="10" fill="#FFF4E8" stroke="#FED7AA" stroke-width="1" />
      <text x="150" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#FF6B00" text-anchor="middle">Starter Websites ₹10K–₹15K • 100% Code Handover</text>
    </g>

    <!-- Footer URL Bar in Deep Navy #0B1437 -->
    <g transform="translate(0, 448)">
      <path d="M 0 0 L 504 0 C 504 0, 504 28, 476 28 L 28 28 C 0 28, 0 0, 0 0 Z" fill="#0B1437" />
      <text x="252" y="19" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#FF6B00" text-anchor="middle" letter-spacing="0.8">arivomtechnologies.com</text>
    </g>
  </g>
</svg>
`;

  await sharp(Buffer.from(squareSvg))
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .toFile('public/images/arivom-share-square.jpg');
  console.log('✓ Generated public/images/arivom-share-square.jpg (600x600)');
  console.log('All brand assets successfully updated!');
}

main().catch(err => {
  console.error('Error during asset generation:', err);
  process.exit(1);
});
