const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Exact vector emblem
const EMBLEM_DEFS = `
  <defs>
    <linearGradient id="a-leg-left" x1="18" y1="86" x2="50" y2="10" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E24800" />
      <stop offset="45%" stop-color="#FF5D00" />
      <stop offset="100%" stop-color="#FF7A00" />
    </linearGradient>
    <linearGradient id="a-leg-right" x1="50" y1="10" x2="84" y2="86" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF7A00" />
      <stop offset="55%" stop-color="#FF6200" />
      <stop offset="100%" stop-color="#E24800" />
    </linearGradient>
    <linearGradient id="a-arrow-grad" x1="18" y1="78" x2="98" y2="38" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E24800" />
      <stop offset="30%" stop-color="#FF6A00" />
      <stop offset="70%" stop-color="#FFA800" />
      <stop offset="100%" stop-color="#FFC000" />
    </linearGradient>
    <filter id="arrow-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0.5" dy="1.8" stdDeviation="1.8" flood-color="#551100" flood-opacity="0.32" />
    </filter>
  </defs>
`;

const EMBLEM_PATHS = `
  <path d="M 50 10 C 47.2 10 45.4 11.6 44 14.5 L 16.5 77.5 C 15.2 80.5 17.2 84 20.5 84 L 30 84 C 32.2 84 34 82.6 35 80.5 L 42.8 63 L 50 42 L 50 10 Z" fill="url(#a-leg-left)" />
  <path d="M 50 10 C 52.8 10 54.6 11.6 56 14.5 L 83.5 77.5 C 84.8 80.5 82.8 84 79.5 84 L 70 84 C 67.8 84 66 82.6 65 80.5 L 57.2 63 L 50 42 L 50 10 Z" fill="url(#a-leg-right)" />
  <path filter="url(#arrow-soft-shadow)" d="M 18 73 C 28 61, 51 47, 78 41.5 L 76.5 34 C 76.5 32.8 77.8 32.2 78.6 32.9 L 98.2 39.2 C 99.2 39.5 99.2 41 98.2 41.3 L 79.8 49.6 C 79 50 78 49.4 78 48.5 L 78.5 44 C 53.5 49, 31.5 63, 19.5 80 C 18.5 79 18 75.5 18 73 Z" fill="url(#a-arrow-grad)" />
`;

const EMBLEM_FULL_SVG = `
<svg viewBox="0 0 112 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${EMBLEM_DEFS}
  ${EMBLEM_PATHS}
</svg>
`;

async function generateShareBanner() {
  const width = 1200;
  const height = 630;

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${EMBLEM_DEFS}
    <radialGradient id="glow-orange" cx="15%" cy="20%" r="55%">
      <stop offset="0%" stop-color="#FF6A00" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#FF6A00" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow-amber" cx="85%" cy="80%" r="55%">
      <stop offset="0%" stop-color="#FFB800" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#FFB800" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF8A00" stop-opacity="0.5" />
      <stop offset="50%" stop-color="#CBD5E1" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#FF8A00" stop-opacity="0.4" />
    </linearGradient>
    <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" stroke-width="0.7" stroke-opacity="0.7"/>
    </pattern>
    <linearGradient id="card-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F8FAFC" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="100%" height="100%" fill="#F8FAFC" />
  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
  <rect width="100%" height="100%" fill="url(#glow-orange)" />
  <rect width="100%" height="100%" fill="url(#glow-amber)" />

  <!-- Outer Rounded Border Frame -->
  <rect x="20" y="20" width="1160" height="590" rx="28" fill="none" stroke="url(#border-grad)" stroke-width="2" />

  <!-- Top Floating Capsule Header (Matching Exact Reference Mockup) -->
  <g transform="translate(60, 56)">
    <!-- Capsule Pill -->
    <rect width="520" height="74" rx="37" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
    
    <!-- Growth Emblem -->
    <g transform="translate(24, 11) scale(0.55)">
      ${EMBLEM_PATHS}
    </g>

    <!-- Brand Typography -->
    <text x="96" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="900" fill="#0B1930" letter-spacing="-0.5">ARIVOM</text>
    <text x="96" y="59" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#62748E" letter-spacing="4.5">TECHNOLOGIES</text>

    <!-- Tagline Badge inside Capsule -->
    <g transform="translate(320, 18)">
      <rect width="176" height="38" rx="19" fill="#FFF7ED" stroke="#FED7AA" stroke-width="1" />
      <text x="88" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10.5" font-weight="800" fill="#EA580C" text-anchor="middle" letter-spacing="1.5">INNOVATE • BUILD • GROW</text>
    </g>
  </g>

  <!-- Top Right Trust Badge -->
  <g transform="translate(860, 64)">
    <rect width="280" height="58" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
    <circle cx="34" cy="29" r="16" fill="#FEF3C7" />
    <text x="34" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" fill="#D97706" text-anchor="middle">★</text>
    <text x="64" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#0F172A">5.0 Star Client Trust</text>
    <text x="64" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748B">Chennai, India • Global SLA</text>
  </g>

  <!-- Main Headline Block -->
  <text x="60" y="200" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="#0B1930" letter-spacing="-1">
    Software &amp; Web Development Company
  </text>
  <text x="60" y="242" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="500" fill="#475569">
    Custom software, business websites, mobile apps, and enterprise microservices.
  </text>

  <!-- 4 Feature Cards (With crisp vector SVGs) -->
  <g transform="translate(60, 280)">
    <!-- Card 1: Web Apps -->
    <g transform="translate(0, 0)">
      <rect width="254" height="150" rx="20" fill="url(#card-grad)" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="20" y="20" width="40" height="40" rx="12" fill="#FFF7ED" stroke="#FED7AA" stroke-width="1" />
      <path d="M 34 44 L 28 39 L 34 34 M 46 34 L 52 39 L 46 44 M 42 32 L 38 46" stroke="#EA580C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Web Applications</text>
      <text x="20" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748B">Angular 19 &amp; Spring Boot 3</text>
      <text x="20" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#EA580C">Enterprise SLA Architecture</text>
    </g>

    <!-- Card 2: Mobile Apps -->
    <g transform="translate(274, 0)">
      <rect width="254" height="150" rx="20" fill="url(#card-grad)" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="20" y="20" width="40" height="40" rx="12" fill="#E0F2FE" stroke="#BAE6FD" stroke-width="1" />
      <rect x="32" y="28" width="16" height="24" rx="3" stroke="#0284C7" stroke-width="2" fill="none" />
      <line x1="38" y1="46" x2="42" y2="46" stroke="#0284C7" stroke-width="2" stroke-linecap="round" />
      <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Mobile Apps</text>
      <text x="20" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748B">iOS &amp; Android Apps</text>
      <text x="20" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#0284C7">React Native 60 FPS Native UI</text>
    </g>

    <!-- Card 3: Cloud Microservices -->
    <g transform="translate(548, 0)">
      <rect width="254" height="150" rx="20" fill="url(#card-grad)" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="20" y="20" width="40" height="40" rx="12" fill="#EEF2FF" stroke="#C7D2FE" stroke-width="1" />
      <path d="M 29 44 C 27 44 26 42.5 26 40.5 C 26 38.5 27.5 37 29.5 37 C 29.8 34.5 32 32.5 35 32.5 C 38.2 32.5 40.5 34.8 40.8 37.5 C 41.5 37.2 42.2 37 43 37 C 45.2 37 47 38.8 47 41 C 47 42.8 45.5 44 43.5 44 Z" stroke="#4F46E5" stroke-width="2" stroke-linejoin="round" fill="none" />
      <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Cloud Microservices</text>
      <text x="20" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748B">Docker, Kubernetes &amp; APIs</text>
      <text x="20" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#4F46E5">Fault-Tolerant Scale</text>
    </g>

    <!-- Card 4: Business Websites & Pricing -->
    <g transform="translate(822, 0)">
      <rect width="258" height="150" rx="20" fill="url(#card-grad)" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="20" y="20" width="40" height="40" rx="12" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
      <path d="M 33 30 L 45 30 M 33 35 L 43 35 M 33 46 L 41 38 M 35 30 L 35 38 C 38 38 43 38 43 34 C 43 30 38 30 35 30" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Business Websites</text>
      <text x="20" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748B">1–2 Weeks Fast Delivery</text>
      <text x="20" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#059669">Packages: ₹10K – ₹15K</text>
    </g>
  </g>

  <!-- Bottom Bar: Verified Features + Web Address -->
  <g transform="translate(60, 480)">
    <rect width="1080" height="74" rx="20" fill="#0B1930" />
    
    <text x="32" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#94A3B8">
      <tspan fill="#FF8A00">✓</tspan> Fixed INR Milestones   
      <tspan dx="16" fill="#FF8A00">✓</tspan> 100% Code Handover   
      <tspan dx="16" fill="#FF8A00">✓</tspan> Zero Hidden Costs   
      <tspan dx="16" fill="#FF8A00">✓</tspan> Full Post-Launch Warranty
    </text>

    <!-- Web URL Button -->
    <g transform="translate(820, 16)">
      <rect width="228" height="42" rx="12" fill="#FF6A00" />
      <text x="114" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">arivomtechnologies.com →</text>
    </g>
  </g>
</svg>
`;

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile('public/images/arivom-share-banner.jpg');
  console.log('✓ Generated public/images/arivom-share-banner.jpg (1200x630)');
}

async function generateShareSquare() {
  const size = 600;

  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${EMBLEM_DEFS}
    <radialGradient id="sq-glow-orange" cx="50%" cy="25%" r="50%">
      <stop offset="0%" stop-color="#FF6A00" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#FF6A00" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="sq-glow-amber" cx="50%" cy="85%" r="45%">
      <stop offset="0%" stop-color="#FFB800" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#FFB800" stop-opacity="0" />
    </radialGradient>
    <pattern id="sq-grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" stroke-width="0.7" stroke-opacity="0.6"/>
    </pattern>
    <linearGradient id="sq-border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF8A00" stop-opacity="0.6" />
      <stop offset="50%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#FF8A00" stop-opacity="0.5" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="100%" height="100%" fill="#F8FAFC" />
  <rect width="100%" height="100%" fill="url(#sq-grid)" />
  <rect width="100%" height="100%" fill="url(#sq-glow-orange)" />
  <rect width="100%" height="100%" fill="url(#sq-glow-amber)" />

  <!-- Outer Rounded Border -->
  <rect x="16" y="16" width="568" height="568" rx="32" fill="none" stroke="url(#sq-border)" stroke-width="2" />

  <!-- Central Card Container -->
  <g transform="translate(48, 48)">
    <rect width="504" height="504" rx="28" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
    
    <!-- Large Centered Growth Arrow Logo -->
    <g transform="translate(172, 36) scale(1.42)">
      ${EMBLEM_PATHS}
    </g>

    <!-- Brand Typography -->
    <text x="252" y="218" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="#0B1930" text-anchor="middle" letter-spacing="-0.5">ARIVOM</text>
    <text x="252" y="246" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#62748E" text-anchor="middle" letter-spacing="7">TECHNOLOGIES</text>

    <!-- Tagline Pill -->
    <g transform="translate(142, 268)">
      <rect width="220" height="36" rx="18" fill="#FFF7ED" stroke="#FED7AA" stroke-width="1" />
      <text x="110" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#EA580C" text-anchor="middle" letter-spacing="1.5">INNOVATE • BUILD • GROW</text>
    </g>

    <!-- Service Title & Subtitle -->
    <text x="252" y="342" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#0F172A" text-anchor="middle">Software &amp; Web Development Studio</text>
    <text x="252" y="368" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#64748B" text-anchor="middle">Angular 19 • Spring Boot 3 • React Native • Cloud</text>

    <!-- INR Packages Highlight Badge -->
    <g transform="translate(102, 396)">
      <rect width="300" height="34" rx="10" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
      <text x="150" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#065F46" text-anchor="middle">Starter Websites ₹10K–₹15K • 100% Code Handover</text>
    </g>

    <!-- Footer URL Bar -->
    <g transform="translate(0, 448)">
      <path d="M 0 0 L 504 0 C 504 0, 504 28, 476 28 L 28 28 C 0 28, 0 0, 0 0 Z" fill="#0B1930" />
      <text x="252" y="19" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#FF8A00" text-anchor="middle" letter-spacing="0.8">arivomtechnologies.com</text>
    </g>
  </g>
</svg>
`;

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .toFile('public/images/arivom-share-square.jpg');
  console.log('✓ Generated public/images/arivom-share-square.jpg (600x600)');
}

async function generateBrandLogoSquare() {
  const size = 800;

  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${EMBLEM_DEFS}
    <radialGradient id="brand-glow" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#FF6A00" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#FF6A00" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="100%" height="100%" fill="#FFFFFF" />
  <rect width="100%" height="100%" fill="url(#brand-glow)" />

  <!-- Growth Arrow Emblem -->
  <g transform="translate(230, 140) scale(3.0)">
    ${EMBLEM_PATHS}
  </g>

  <!-- Brand Typography -->
  <text x="400" y="520" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="76" font-weight="900" fill="#0B1930" text-anchor="middle" letter-spacing="-1">ARIVOM</text>
  <text x="400" y="570" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" fill="#62748E" text-anchor="middle" letter-spacing="11">TECHNOLOGIES</text>

  <!-- Tagline Pill -->
  <g transform="translate(230, 610)">
    <rect width="340" height="52" rx="26" fill="#FFF7ED" stroke="#FED7AA" stroke-width="1.5" />
    <text x="170" y="33" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#EA580C" text-anchor="middle" letter-spacing="2.5">INNOVATE • BUILD • GROW</text>
  </g>
</svg>
`;

  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile('public/images/arivom-brand-logo-square.png');
  console.log('✓ Generated public/images/arivom-brand-logo-square.png (800x800)');
}

async function generateFavicons() {
  // Pure emblem SVG centered on square canvas
  const emblemSquareSvg = (canvasSize, emblemSize) => {
    const scale = emblemSize / 112;
    const offsetX = (canvasSize - 112 * scale) / 2;
    const offsetY = (canvasSize - 96 * scale) / 2;
    return `
<svg width="${canvasSize}" height="${canvasSize}" viewBox="0 0 ${canvasSize} ${canvasSize}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${EMBLEM_DEFS}
  </defs>
  <g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">
    ${EMBLEM_PATHS}
  </g>
</svg>
`;
  };

  // Apple Touch Icon with subtle squircle background
  const appleTouchSvg = `
<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${EMBLEM_DEFS}
    <linearGradient id="apple-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FFF7ED" />
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="40" fill="url(#apple-bg)" />
  <rect x="1" y="1" width="178" height="178" rx="39" fill="none" stroke="#FED7AA" stroke-width="2" />
  <g transform="translate(26, 28) scale(1.15)">
    ${EMBLEM_PATHS}
  </g>
</svg>
`;

  await sharp(Buffer.from(appleTouchSvg))
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('✓ Generated public/apple-touch-icon.png (180x180)');

  // Favicon 192x192
  await sharp(Buffer.from(emblemSquareSvg(192, 168)))
    .png()
    .toFile('public/favicon-192x192.png');
  console.log('✓ Generated public/favicon-192x192.png');

  // Favicon 144x144
  await sharp(Buffer.from(emblemSquareSvg(144, 126)))
    .png()
    .toFile('public/favicon-144x144.png');
  console.log('✓ Generated public/favicon-144x144.png');

  // Favicon 96x96
  await sharp(Buffer.from(emblemSquareSvg(96, 84)))
    .png()
    .toFile('public/favicon-96x96.png');
  console.log('✓ Generated public/favicon-96x96.png');

  // Favicon 48x48
  await sharp(Buffer.from(emblemSquareSvg(48, 42)))
    .png()
    .toFile('public/favicon-48x48.png');
  console.log('✓ Generated public/favicon-48x48.png');

  // Favicon 32x32
  await sharp(Buffer.from(emblemSquareSvg(32, 28)))
    .png()
    .toFile('public/favicon.png');
  console.log('✓ Generated public/favicon.png');

  // Favicon.ico (48x48 PNG format standard)
  await sharp(Buffer.from(emblemSquareSvg(48, 42)))
    .png()
    .toFile('public/favicon.ico');
  console.log('✓ Generated public/favicon.ico');
}

async function removeLegacyFiles() {
  const legacyFiles = [
    'public/images/arivom-logo-full.jpg',
    'public/images/arivom-logo-icon.png',
    'public/images/arivom-brand-banner.png',
    'public/images/arivom-emblem.png',
    'public/images/arivom-favicon.png'
  ];

  for (const file of legacyFiles) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log('✓ Removed legacy file:', file);
    }
  }
}

async function main() {
  console.log('Generating brand assets with new growth emblem & typography...');
  await generateShareBanner();
  await generateShareSquare();
  await generateBrandLogoSquare();
  await generateFavicons();
  await removeLegacyFiles();
  console.log('All brand assets successfully updated!');
}

main().catch(err => {
  console.error('Asset generation error:', err);
  process.exit(1);
});
