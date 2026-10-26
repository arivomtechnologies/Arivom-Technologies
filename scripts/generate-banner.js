const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const EMBLEM_SVG = `
<svg width="112" height="96" viewBox="0 0 112 96" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  <path d="M 50 10 C 47.2 10 45.4 11.6 44 14.5 L 16.5 77.5 C 15.2 80.5 17.2 84 20.5 84 L 30 84 C 32.2 84 34 82.6 35 80.5 L 42.8 63 L 50 42 L 50 10 Z" fill="url(#a-leg-left)" />
  <path d="M 50 10 C 52.8 10 54.6 11.6 56 14.5 L 83.5 77.5 C 84.8 80.5 82.8 84 79.5 84 L 70 84 C 67.8 84 66 82.6 65 80.5 L 57.2 63 L 50 42 L 50 10 Z" fill="url(#a-leg-right)" />
  <path filter="url(#arrow-soft-shadow)" d="M 18 73 C 28 61, 51 47, 78 41.5 L 76.5 34 C 76.5 32.8 77.8 32.2 78.6 32.9 L 98.2 39.2 C 99.2 39.5 99.2 41 98.2 41.3 L 79.8 49.6 C 79 50 78 49.4 78 48.5 L 78.5 44 C 53.5 49, 31.5 63, 19.5 80 C 18.5 79 18 75.5 18 73 Z" fill="url(#a-arrow-grad)" />
</svg>
`;

async function generateBanner() {
  const width = 1200;
  const height = 630;

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
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
    <rect width="520" height="74" rx="37" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="drop-shadow(0px 8px 24px rgba(15, 23, 42, 0.06))" />
    
    <!-- Growth Emblem -->
    <g transform="translate(24, 11) scale(0.55)">
      ${EMBLEM_SVG}
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

  <!-- 4 Feature Cards (Modern Enterprise Style) -->
  <g transform="translate(60, 280)">
    <!-- Card 1: Web Apps -->
    <g transform="translate(0, 0)">
      <rect width="254" height="150" rx="20" fill="url(#card-grad)" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="20" y="20" width="40" height="40" rx="12" fill="#FFF7ED" stroke="#FED7AA" stroke-width="1" />
      <text x="40" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="900" fill="#EA580C" text-anchor="middle">&lt;/&gt;</text>
      <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Web Applications</text>
      <text x="20" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748B">Angular 19 &amp; Spring Boot 3</text>
      <text x="20" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#EA580C">Enterprise SLA Architecture</text>
    </g>

    <!-- Card 2: Mobile Apps -->
    <g transform="translate(274, 0)">
      <rect width="254" height="150" rx="20" fill="url(#card-grad)" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="20" y="20" width="40" height="40" rx="12" fill="#E0F2FE" stroke="#BAE6FD" stroke-width="1" />
      <text x="40" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="900" fill="#0284C7" text-anchor="middle">📱</text>
      <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Mobile Apps</text>
      <text x="20" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748B">iOS &amp; Android Apps</text>
      <text x="20" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#0284C7">React Native 60 FPS Native UI</text>
    </g>

    <!-- Card 3: Cloud Microservices -->
    <g transform="translate(548, 0)">
      <rect width="254" height="150" rx="20" fill="url(#card-grad)" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="20" y="20" width="40" height="40" rx="12" fill="#EEF2FF" stroke="#C7D2FE" stroke-width="1" />
      <text x="40" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="900" fill="#4F46E5" text-anchor="middle">☁️</text>
      <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Cloud Microservices</text>
      <text x="20" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748B">Docker, Kubernetes &amp; APIs</text>
      <text x="20" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#4F46E5">Fault-Tolerant Scale</text>
    </g>

    <!-- Card 4: Business Websites & Pricing -->
    <g transform="translate(822, 0)">
      <rect width="258" height="150" rx="20" fill="url(#card-grad)" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="20" y="20" width="40" height="40" rx="12" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
      <text x="40" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="900" fill="#059669" text-anchor="middle">₹</text>
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
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile('public/images/arivom-share-banner.jpg');
  console.log('Generated public/images/arivom-share-banner.jpg');
}

generateBanner().catch(console.error);
