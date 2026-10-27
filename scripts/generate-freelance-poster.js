const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Exact Growth Arrow Emblem SVG defs & paths
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

async function generatePoster() {
  const width = 1200;
  const height = 1800;

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${EMBLEM_DEFS}
    <linearGradient id="top-curve-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E24800" />
      <stop offset="60%" stop-color="#FF6A00" />
      <stop offset="100%" stop-color="#FFB800" />
    </linearGradient>
    <radialGradient id="bg-ambient" cx="80%" cy="15%" r="65%">
      <stop offset="0%" stop-color="#FF6A00" stop-opacity="0.07" />
      <stop offset="100%" stop-color="#FF6A00" stop-opacity="0" />
    </radialGradient>
    <pattern id="poster-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" stroke-width="0.8" stroke-opacity="0.6"/>
    </pattern>
    <linearGradient id="badge-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="100%" height="100%" fill="#F8FAFC" />
  <rect width="100%" height="100%" fill="url(#poster-grid)" />
  <rect width="100%" height="100%" fill="url(#bg-ambient)" />

  <!-- Top Decorative Curve Accent -->
  <path d="M 0 0 L 280 0 C 220 70, 130 140, 0 170 Z" fill="url(#top-curve-grad)" />
  <path d="M 0 0 L 250 0 C 190 60, 110 120, 0 150 Z" fill="#0B1930" />

  <!-- Outer Border Frame -->
  <rect x="24" y="24" width="1152" height="1752" rx="32" fill="none" stroke="#CBD5E1" stroke-width="2" />

  <!-- Top Floating Capsule Header (Matching Exact Website Branding) -->
  <g transform="translate(60, 50)">
    <rect width="520" height="82" rx="41" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
    
    <!-- Growth Emblem -->
    <g transform="translate(24, 15) scale(0.6)">
      ${EMBLEM_PATHS}
    </g>

    <!-- Brand Typography -->
    <text x="102" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="#0B1930" letter-spacing="-0.5">ARIVOM</text>
    <text x="102" y="65" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="800" fill="#62748E" letter-spacing="5">TECHNOLOGIES</text>

    <!-- Tagline Badge -->
    <g transform="translate(320, 22)">
      <rect width="176" height="38" rx="19" fill="#FFF7ED" stroke="#FED7AA" stroke-width="1" />
      <text x="88" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" fill="#EA580C" text-anchor="middle" letter-spacing="1.5">INNOVATE • BUILD • GROW</text>
    </g>
  </g>

  <!-- Top Right "Limited Seats" Circular Badge -->
  <g transform="translate(930, 60)">
    <circle cx="95" cy="95" r="90" fill="#FFFBEB" stroke="#F59E0B" stroke-width="3" stroke-dasharray="6,4" />
    <circle cx="95" cy="95" r="80" fill="url(#badge-gold)" />
    <text x="95" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="#FEF3C7" text-anchor="middle">★ ★ ★</text>
    <text x="95" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="21" font-weight="900" fill="#FFFFFF" text-anchor="middle">LIMITED</text>
    <text x="95" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="21" font-weight="900" fill="#FFFFFF" text-anchor="middle">SEATS</text>
    <text x="95" y="132" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#FEF3C7" text-anchor="middle">AVAILABLE!</text>
    <text x="95" y="152" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" fill="#FEF3C7" text-anchor="middle">★ ★ ★</text>
  </g>

  <!-- Main Title Area -->
  <g transform="translate(70, 210)">
    <text x="0" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="58" font-weight="900" fill="#0B1930" letter-spacing="-1">
      FREELANCE, INTERNSHIP &amp;
    </text>
    <text x="0" y="126" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="58" font-weight="900" fill="#FF6A00" letter-spacing="-1">
      UPSKILLING PROGRAM 2026
    </text>

    <!-- Slogan Capsule Banner -->
    <g transform="translate(0, 160)">
      <rect width="660" height="52" rx="26" fill="#0B1930" />
      <g transform="translate(24, 14)">
        <path d="M 0 12 L 16 4 L 32 12 L 16 20 Z M 8 16 L 8 24 C 8 28 24 28 24 24 L 24 16" stroke="#FF8A00" stroke-width="2.5" fill="none" stroke-linejoin="round" />
      </g>
      <text x="76" y="33" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#FFFFFF">
        Build Skills. Get Real Experience. Launch Your Career.
      </text>
    </g>
  </g>

  <!-- ================= SECTION 1: PROGRAM HIGHLIGHTS ================= -->
  <g transform="translate(70, 490)">
    <!-- Section Header Ribbon -->
    <g transform="translate(320, 0)">
      <rect width="420" height="46" rx="23" fill="#0B1930" />
      <text x="210" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="900" fill="#FF8A00" text-anchor="middle" letter-spacing="2">
        ★ PROGRAM HIGHLIGHTS ★
      </text>
    </g>

    <!-- Container Card for Highlights Grid -->
    <rect x="0" y="70" width="1060" height="520" rx="24" fill="#FFFFFF" stroke="#FED7AA" stroke-width="2" />

    <!-- Tracks 3 Columns Grid -->
    <!-- Column 1 -->
    <g transform="translate(40, 105)">
      <!-- Item 1: AI -->
      <g transform="translate(0, 0)">
        <rect width="44" height="44" rx="12" fill="#FAF5FF" stroke="#E9D5FF" stroke-width="1.5" />
        <path d="M 14 22 C 14 17 18 14 22 14 C 26 14 30 17 30 22 C 30 25 28 28 26 29 L 26 31 L 18 31 L 18 29 C 16 28 14 25 14 22 Z" stroke="#9333EA" stroke-width="2" fill="none" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">Artificial Intelligence (AI &amp; LLMs)</text>
      </g>
      <!-- Item 2: Full Stack -->
      <g transform="translate(0, 72)">
        <rect width="44" height="44" rx="12" fill="#FFF7ED" stroke="#FED7AA" stroke-width="1.5" />
        <path d="M 17 26 L 12 22 L 17 18 M 27 18 L 32 22 L 27 26 M 24 16 L 20 28" stroke="#EA580C" stroke-width="2.2" stroke-linecap="round" fill="none" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">Full Stack Web Development</text>
      </g>
      <!-- Item 3: Data Science -->
      <g transform="translate(0, 144)">
        <rect width="44" height="44" rx="12" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1.5" />
        <path d="M 14 30 L 14 24 M 22 30 L 22 18 M 30 30 L 30 14" stroke="#059669" stroke-width="3" stroke-linecap="round" fill="none" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">Data Science &amp; Engineering</text>
      </g>
      <!-- Item 4: Cyber Security -->
      <g transform="translate(0, 216)">
        <rect width="44" height="44" rx="12" fill="#FEF2F2" stroke="#FECACA" stroke-width="1.5" />
        <path d="M 22 13 L 31 17 C 31 24 26 29 22 31 C 18 29 13 24 13 17 Z" stroke="#DC2626" stroke-width="2" fill="none" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">Cyber Security &amp; API Shield</text>
      </g>
      <!-- Item 5: Data Analytics -->
      <g transform="translate(0, 288)">
        <rect width="44" height="44" rx="12" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1.5" />
        <path d="M 14 27 L 20 20 L 25 24 L 31 16 M 26 16 L 31 16 L 31 21" stroke="#D97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">Data Analytics &amp; Pipelines</text>
      </g>
    </g>

    <!-- Column 2 -->
    <g transform="translate(390, 105)">
      <!-- Item 6: Cloud -->
      <g transform="translate(0, 0)">
        <rect width="44" height="44" rx="12" fill="#EEF2FF" stroke="#C7D2FE" stroke-width="1.5" />
        <path d="M 16 27 C 14 27 13 25.5 13 23.5 C 13 21.5 14.5 20 16.5 20 C 16.8 17.5 19 15.5 22 15.5 C 25.2 15.5 27.5 17.8 27.8 20.5 C 28.5 20.2 29.2 20 30 20 C 32.2 20 34 21.8 34 24 C 34 25.8 32.5 27 30.5 27 Z" stroke="#4F46E5" stroke-width="2" fill="none" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">Cloud &amp; Microservices</text>
      </g>
      <!-- Item 7: Mobile App -->
      <g transform="translate(0, 72)">
        <rect width="44" height="44" rx="12" fill="#E0F2FE" stroke="#BAE6FD" stroke-width="1.5" />
        <rect x="15" y="13" width="14" height="22" rx="3" stroke="#0284C7" stroke-width="2" fill="none" />
        <line x1="20" y1="30" x2="24" y2="30" stroke="#0284C7" stroke-width="2" stroke-linecap="round" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">Mobile App (React Native)</text>
      </g>
      <!-- Item 8: UI/UX Design -->
      <g transform="translate(0, 144)">
        <rect width="44" height="44" rx="12" fill="#FDF2F8" stroke="#FBCFE8" stroke-width="1.5" />
        <path d="M 14 27 C 14 22 18 14 24 14 C 29 14 31 17 31 20 C 31 25 25 25 25 27" stroke="#DB2777" stroke-width="2" fill="none" />
        <circle cx="22" cy="27" r="1.5" fill="#DB2777" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">UI/UX &amp; Design Systems</text>
      </g>
      <!-- Item 9: Embedded Systems -->
      <g transform="translate(0, 216)">
        <rect width="44" height="44" rx="12" fill="#F0FDF4" stroke="#BBF7D0" stroke-width="1.5" />
        <rect x="15" y="15" width="14" height="14" rx="2" stroke="#16A34A" stroke-width="2" fill="none" />
        <line x1="18" y1="11" x2="18" y2="15" stroke="#16A34A" stroke-width="2" />
        <line x1="26" y1="11" x2="26" y2="15" stroke="#16A34A" stroke-width="2" />
        <line x1="18" y1="29" x2="18" y2="33" stroke="#16A34A" stroke-width="2" />
        <line x1="26" y1="29" x2="26" y2="33" stroke="#16A34A" stroke-width="2" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">Embedded &amp; IoT Solutions</text>
      </g>
      <!-- Item 10: Python with Power BI -->
      <g transform="translate(0, 288)">
        <rect width="44" height="44" rx="12" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1.5" />
        <path d="M 14 20 C 14 16 17 14 21 14 L 24 14 C 27 14 29 16 29 19 L 29 22 L 20 22 C 17 22 14 24 14 27 Z" stroke="#2563EB" stroke-width="1.8" fill="none" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">Python with Power BI</text>
      </g>
    </g>

    <!-- Column 3 -->
    <g transform="translate(730, 105)">
      <!-- Item 11: QA Testing -->
      <g transform="translate(0, 0)">
        <rect width="44" height="44" rx="12" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1.5" />
        <circle cx="22" cy="22" r="11" stroke="#059669" stroke-width="2" fill="none" />
        <path d="M 17 22 L 20 25 L 27 18" stroke="#059669" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">Software Testing &amp; QA</text>
      </g>
      <!-- Item 12: Business Analytics -->
      <g transform="translate(0, 72)">
        <rect width="44" height="44" rx="12" fill="#F0F9FF" stroke="#BAE6FD" stroke-width="1.5" />
        <path d="M 14 29 L 30 29 M 18 29 L 18 20 M 23 29 L 23 15 M 28 29 L 28 24" stroke="#0284C7" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">Business Analytics</text>
      </g>
      <!-- Item 13: Digital Marketing -->
      <g transform="translate(0, 144)">
        <rect width="44" height="44" rx="12" fill="#FFF7ED" stroke="#FED7AA" stroke-width="1.5" />
        <path d="M 14 25 L 20 25 L 27 29 L 27 15 L 20 19 L 14 19 Z" stroke="#EA580C" stroke-width="2" fill="none" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">Digital Growth &amp; SEO</text>
      </g>
      <!-- Item 14: HRM -->
      <g transform="translate(0, 216)">
        <rect width="44" height="44" rx="12" fill="#FAF5FF" stroke="#E9D5FF" stroke-width="1.5" />
        <circle cx="22" cy="18" r="4" stroke="#7C3AED" stroke-width="2" fill="none" />
        <path d="M 14 29 C 14 25 18 24 22 24 C 26 24 30 25 30 29" stroke="#7C3AED" stroke-width="2" fill="none" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0F172A">HR &amp; Talent Operations</text>
      </g>
      <!-- Item 15: Freelance Project Placement -->
      <g transform="translate(0, 288)">
        <rect width="44" height="44" rx="12" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1.5" />
        <path d="M 22 13 L 28 19 L 24 23 L 20 19 Z M 16 27 L 20 23" stroke="#059669" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#059669">Live Freelance Projects</text>
      </g>
    </g>

    <!-- Additional Specialized Badges (Clean row at bottom of card, Y = 430) -->
    <g transform="translate(250, 440)">
      <rect width="260" height="38" rx="19" fill="#F0FDF4" stroke="#BBF7D0" stroke-width="1.5" />
      <text x="130" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#15803D" text-anchor="middle">🍏 Healthcare &amp; Web Portals</text>
    </g>
    <g transform="translate(540, 440)">
      <rect width="260" height="38" rx="19" fill="#FEF2F2" stroke="#FECACA" stroke-width="1.5" />
      <text x="130" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#B91C1C" text-anchor="middle">🏥 Enterprise ERP &amp; Billing</text>
    </g>
  </g>

  <!-- ================= SECTION 2: PROGRAM BENEFITS & WHO CAN APPLY ================= -->
  <g transform="translate(70, 1170)">
    
    <!-- LEFT CARD: PROGRAM BENEFITS -->
    <g transform="translate(0, 0)">
      <!-- Ribbon Title -->
      <rect width="320" height="44" rx="12" fill="#0B1930" />
      <text x="160" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="#FF8A00" text-anchor="middle" letter-spacing="1">
        ★ PROGRAM BENEFITS
      </text>

      <!-- Content Container -->
      <rect x="0" y="55" width="510" height="340" rx="20" fill="#FFFFFF" stroke="#FED7AA" stroke-width="2" />

      <!-- Checkpoint Items -->
      <g transform="translate(30, 88)">
        <g transform="translate(0, 0)">
          <circle cx="12" cy="12" r="12" fill="#FF6A00" />
          <text x="12" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">✓</text>
          <text x="36" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Hands-on Practical Training</text>
        </g>
        <g transform="translate(0, 48)">
          <circle cx="12" cy="12" r="12" fill="#FF6A00" />
          <text x="12" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">✓</text>
          <text x="36" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Real-World Project Experience</text>
        </g>
        <g transform="translate(0, 96)">
          <circle cx="12" cy="12" r="12" fill="#FF6A00" />
          <text x="12" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">✓</text>
          <text x="36" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Industry Expert 1-on-1 Mentorship</text>
        </g>
        <g transform="translate(0, 144)">
          <circle cx="12" cy="12" r="12" fill="#FF6A00" />
          <text x="12" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">✓</text>
          <text x="36" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Internship &amp; Experience Certificate</text>
        </g>
        <g transform="translate(0, 192)">
          <circle cx="12" cy="12" r="12" fill="#FF6A00" />
          <text x="12" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">✓</text>
          <text x="36" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Paid Freelance Milestone Opportunities</text>
        </g>
        <g transform="translate(0, 240)">
          <circle cx="12" cy="12" r="12" fill="#FF6A00" />
          <text x="12" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">✓</text>
          <text x="36" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Resume &amp; LinkedIn Profile Enhancement</text>
        </g>
      </g>
    </g>

    <!-- RIGHT CARD: WHO CAN APPLY? + MOTTO -->
    <g transform="translate(540, 0)">
      <!-- Ribbon Title -->
      <rect width="280" height="44" rx="12" fill="#0B1930" />
      <text x="140" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="#FF8A00" text-anchor="middle" letter-spacing="1">
        ★ WHO CAN APPLY?
      </text>

      <!-- Content Container -->
      <rect x="0" y="55" width="520" height="340" rx="20" fill="#FFFFFF" stroke="#FED7AA" stroke-width="2" />

      <!-- Left Column: Who Can Apply -->
      <g transform="translate(24, 100)">
        <g transform="translate(0, 0)">
          <rect width="38" height="38" rx="10" fill="#0B1930" />
          <path d="M 12 19 L 19 14 L 26 19 L 19 24 Z" stroke="#FF8A00" stroke-width="2" fill="none" />
          <text x="50" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">College Students</text>
        </g>
        <g transform="translate(0, 60)">
          <rect width="38" height="38" rx="10" fill="#0B1930" />
          <circle cx="19" cy="15" r="4" stroke="#FF8A00" stroke-width="2" fill="none" />
          <path d="M 12 25 C 12 22 15 21 19 21 C 23 21 26 22 26 25" stroke="#FF8A00" stroke-width="2" fill="none" />
          <text x="50" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Fresh Graduates</text>
        </g>
        <g transform="translate(0, 120)">
          <rect width="38" height="38" rx="10" fill="#0B1930" />
          <rect x="12" y="14" width="14" height="11" rx="2" stroke="#FF8A00" stroke-width="2" fill="none" />
          <path d="M 15 14 L 15 12 C 15 11 16 10 17 10 L 21 10 C 22 10 23 11 23 12 L 23 14" stroke="#FF8A00" stroke-width="1.8" fill="none" />
          <text x="50" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Freelance Coders</text>
        </g>
        <g transform="translate(0, 180)">
          <rect width="38" height="38" rx="10" fill="#0B1930" />
          <path d="M 13 19 A 6 6 0 0 1 23 15 M 25 19 A 6 6 0 0 1 15 23" stroke="#FF8A00" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <text x="50" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#0F172A">Career Switchers</text>
        </g>
      </g>

      <!-- Vertical Divider -->
      <line x1="260" y1="85" x2="260" y2="355" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="4,4" />

      <!-- Right Column: Inspiring Motto Block -->
      <g transform="translate(280, 120)">
        <text x="110" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="900" fill="#0B1930" text-anchor="middle" letter-spacing="2">LEARN</text>
        <text x="110" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="900" fill="#FF6A00" text-anchor="middle" letter-spacing="2">UPSKILL</text>
        <text x="110" y="110" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="900" fill="#0B1930" text-anchor="middle" letter-spacing="2">INNOVATE</text>
        <text x="110" y="150" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="900" fill="#D97706" text-anchor="middle" letter-spacing="2">SUCCEED</text>
        <!-- Golden underline accent -->
        <path d="M 40 170 Q 110 190 180 170" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" fill="none" />
      </g>
    </g>
  </g>

  <!-- ================= BOTTOM CONTACT & HOW TO APPLY BANNER ================= -->
  <g transform="translate(70, 1610)">
    <rect width="1060" height="110" rx="24" fill="#0B1930" />
    
    <!-- Left Contact Details -->
    <g transform="translate(40, 36)">
      <text x="0" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#FF8A00" letter-spacing="1">GET IN TOUCH &amp; APPLY NOW:</text>
      <text x="0" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="800" fill="#FFFFFF">
        EMAIL: arivomtechnologies@gmail.com   |   CALL / WHATSAPP: +91 866 768 4683
      </text>
    </g>

    <!-- Right Apply Button -->
    <g transform="translate(770, 30)">
      <rect width="250" height="52" rx="16" fill="#FF6A00" />
      <text x="125" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">
        Apply Online →
      </text>
    </g>
  </g>

</svg>
`;

  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 8 })
    .toFile('public/images/arivom-freelance-program-2026.png');
  console.log('✓ Generated public/images/arivom-freelance-program-2026.png');

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile('public/images/arivom-freelance-program-2026.jpg');
  console.log('✓ Generated public/images/arivom-freelance-program-2026.jpg');
}

generatePoster().catch(console.error);
