const fs = require('fs');
const sharp = require('sharp');

const EMBLEM_SRC = '/Users/adsadmin/.gemini/antigravity/brain/5c5f9455-1202-4468-ae4a-bb63ec95e7d2/.user_uploaded/media_1793255237937_a30eb46c.png';
const LOCKUP_SRC = '/Users/adsadmin/.gemini/antigravity/brain/5c5f9455-1202-4468-ae4a-bb63ec95e7d2/.user_uploaded/media_1793255124897_47ff78ad.png';

async function removeWhiteBg(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Remove near-white pixels (R>240, G>240, B>240) by setting alpha to 0
  // Also handle anti-aliased edge pixels by blending alpha
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // Pure white / near-white background
    if (r > 245 && g > 245 && b > 245) {
      data[i + 3] = 0; // fully transparent
    }
    // Anti-alias fringe: semi-white pixels get partial transparency
    else if (r > 230 && g > 230 && b > 230) {
      const whiteness = Math.min(r, g, b);
      // Scale alpha: whiter = more transparent
      const fade = Math.max(0, (whiteness - 230) / 25);
      data[i + 3] = Math.round(data[i + 3] * (1 - fade));
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png({ compressionLevel: 9 }).toBuffer();
}

async function main() {
  console.log('Step 1: Removing white background from emblem...');
  const rawEmblem = await sharp(EMBLEM_SRC).toBuffer();
  const cleanEmblem = await removeWhiteBg(rawEmblem);

  // Verify corners are now transparent
  const { data: vData, info: vInfo } = await sharp(cleanEmblem).raw().toBuffer({ resolveWithObject: true });
  console.log('  Corner (0,0) alpha:', vData[3], '(should be 0)');
  console.log('  Corner (end) alpha:', vData[(vInfo.height - 1) * vInfo.width * 4 + (vInfo.width - 1) * 4 + 3], '(should be 0)');

  // Trim and save
  const trimmedEmblem = await sharp(cleanEmblem).trim().png({ compressionLevel: 9 }).toBuffer();
  const trimMeta = await sharp(trimmedEmblem).metadata();
  console.log(`  Trimmed emblem: ${trimMeta.width}x${trimMeta.height}`);

  // Save header logo files
  fs.writeFileSync('public/images/arivom-growth-emblem.png', trimmedEmblem);
  fs.writeFileSync('public/images/arivom-header-logo.png', trimmedEmblem);
  console.log('  ✓ Saved arivom-growth-emblem.png & arivom-header-logo.png');

  // Save full lockup (already has transparent bg)
  const lockupTrimmed = await sharp(LOCKUP_SRC).trim().png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync('public/images/arivom-full-logo.png', lockupTrimmed);

  // ── Header Logo SVG (embedded PNG with data URI) ──
  const emblemB64 = trimmedEmblem.toString('base64');
  const headerSvg = `<svg viewBox="0 0 ${trimMeta.width} ${trimMeta.height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image width="${trimMeta.width}" height="${trimMeta.height}" href="data:image/png;base64,${emblemB64}" />
</svg>`;
  fs.writeFileSync('public/images/arivom-header-logo.svg', headerSvg);
  console.log('  ✓ Saved arivom-header-logo.svg');

  // ── AI Emblem (circular badge with deep navy bg) ──
  console.log('\nStep 2: Generating AI emblem...');
  const aiEmblemInner = await sharp(trimmedEmblem)
    .resize(108, null, { fit: 'inside' })
    .toBuffer();
  const aiInnerMeta = await sharp(aiEmblemInner).metadata();
  const aiLeft = Math.round((200 - aiInnerMeta.width) / 2);
  const aiTop = Math.round((200 - aiInnerMeta.height) / 2);

  const aiSvgBg = `
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ai-bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#121F4E"/>
      <stop offset="70%" stop-color="#0B1437"/>
      <stop offset="100%" stop-color="#070D24"/>
    </radialGradient>
    <linearGradient id="ai-ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B00"/>
      <stop offset="50%" stop-color="#FFA84A"/>
      <stop offset="100%" stop-color="#FF6B00"/>
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="96" fill="url(#ai-bg)"/>
  <circle cx="100" cy="100" r="95" stroke="url(#ai-ring)" stroke-width="2.5"/>
  <circle cx="100" cy="100" r="82" stroke="#FF6B00" stroke-opacity="0.25" stroke-width="1" stroke-dasharray="3 4"/>
  <circle cx="100" cy="100" r="68" stroke="#38BDF8" stroke-opacity="0.15" stroke-width="1" stroke-dasharray="2 3"/>
</svg>`;
  const aiBgBuf = await sharp(Buffer.from(aiSvgBg)).png().toBuffer();
  const aiCompositeBuf = await sharp(aiBgBuf)
    .composite([{ input: aiEmblemInner, left: aiLeft, top: aiTop }])
    .png()
    .toBuffer();

  // Write as SVG (data-uri embedded) and PNG
  const aiCompositeB64 = aiCompositeBuf.toString('base64');
  const aiSvgFinal = `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image width="200" height="200" href="data:image/png;base64,${aiCompositeB64}" />
</svg>`;
  fs.writeFileSync('public/images/arivom-ai-emblem.svg', aiSvgFinal);
  fs.writeFileSync('public/images/arivom-ai-emblem.png', aiCompositeBuf);
  console.log('  ✓ Saved arivom-ai-emblem.svg & .png');

  // ── Brand Logo Square (512x512) ──
  console.log('\nStep 3: Generating brand logo square (512x512)...');
  const sqEmblem = await sharp(trimmedEmblem)
    .resize(420, 285, { fit: 'inside' })
    .toBuffer();
  const sqMeta = await sharp(sqEmblem).metadata();
  const sqLeft = Math.round((512 - sqMeta.width) / 2);
  const sqTop = Math.round((512 - sqMeta.height) / 2);
  const sq512 = await sharp({
    create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
  .composite([{ input: sqEmblem, left: sqLeft, top: sqTop }])
  .png({ compressionLevel: 9 })
  .toBuffer();
  fs.writeFileSync('public/images/arivom-brand-logo-square.png', sq512);
  console.log('  ✓ Saved arivom-brand-logo-square.png');

  // ── Favicons ──
  console.log('\nStep 4: Generating favicons...');
  for (const { file, size } of [
    { file: 'public/favicon-192x192.png', size: 192 },
    { file: 'public/favicon-144x144.png', size: 144 },
    { file: 'public/favicon-96x96.png', size: 96 },
    { file: 'public/favicon-48x48.png', size: 48 },
    { file: 'public/favicon.png', size: 32 },
  ]) {
    fs.writeFileSync(file, await sharp(sq512).resize(size, size).png().toBuffer());
  }
  fs.writeFileSync('public/favicon.ico', await sharp(sq512).resize(48, 48).png().toBuffer());

  // Apple Touch Icon: 180x180, Deep Navy #0B1437 solid background
  const touchInner = await sharp(trimmedEmblem).resize(130, 88, { fit: 'inside' }).toBuffer();
  const touchMeta = await sharp(touchInner).metadata();
  const appleTouch = await sharp({
    create: { width: 180, height: 180, channels: 4, background: { r: 11, g: 20, b: 55, alpha: 255 } }
  })
  .composite([{
    input: touchInner,
    left: Math.round((180 - touchMeta.width) / 2),
    top: Math.round((180 - touchMeta.height) / 2),
  }])
  .png()
  .toBuffer();
  fs.writeFileSync('public/apple-touch-icon.png', appleTouch);
  console.log('  ✓ Saved all favicons & apple-touch-icon.png');

  // ── Share Banner (1200x630) ──
  console.log('\nStep 5: Generating share banner (1200x630)...');
  const lockupForBanner = await sharp(lockupTrimmed)
    .resize(460, null, { fit: 'inside' })
    .png()
    .toBuffer();

  // Subtle watermark emblem at 10% opacity
  const wmResized = await sharp(trimmedEmblem)
    .resize(null, 280, { fit: 'inside' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 3; i < wmResized.data.length; i += 4) {
    wmResized.data[i] = Math.round(wmResized.data[i] * 0.10);
  }
  const wmBuf = await sharp(wmResized.data, {
    raw: { width: wmResized.info.width, height: wmResized.info.height, channels: 4 }
  }).png().toBuffer();

  const bannerSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1A42"/>
      <stop offset="50%" stop-color="#0B1437"/>
      <stop offset="100%" stop-color="#080E2A"/>
    </linearGradient>
    <radialGradient id="gl" cx="10%" cy="15%" r="45%">
      <stop offset="0%" stop-color="#FF6B00" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#FF6B00" stop-opacity="0"/>
    </radialGradient>
    <pattern id="gr" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FFF" stroke-width="0.4" stroke-opacity="0.04"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#gr)"/>
  <rect width="100%" height="100%" fill="url(#gl)"/>
  <rect x="0" y="0" width="100%" height="4" fill="#FF6B00"/>

  <rect x="80" y="270" width="200" height="34" rx="17" fill="none" stroke="#FF6B00" stroke-opacity="0.5" stroke-width="1.5"/>
  <text x="180" y="292" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" fill="#FF6B00" text-anchor="middle" letter-spacing="2">INNOVATE • BUILD • GROW</text>

  <text x="80" y="350" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="38" font-weight="900" fill="#FFF" letter-spacing="-0.5">Software &amp; Web</text>
  <text x="80" y="398" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="38" font-weight="900" fill="#FFF" letter-spacing="-0.5">Development Company</text>
  <text x="80" y="435" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="500" fill="#94A3B8">Custom software, business websites, mobile apps &amp; enterprise microservices.</text>

  <g transform="translate(80, 475)">
    <rect width="140" height="30" rx="15" fill="#FF6B00" fill-opacity="0.15"/>
    <text x="70" y="20" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="700" fill="#FF6B00" text-anchor="middle">Web Applications</text>
    <rect x="152" width="120" height="30" rx="15" fill="#FF6B00" fill-opacity="0.15"/>
    <text x="212" y="20" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="700" fill="#FF6B00" text-anchor="middle">Mobile Apps</text>
    <rect x="284" width="160" height="30" rx="15" fill="#FF6B00" fill-opacity="0.15"/>
    <text x="364" y="20" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="700" fill="#FF6B00" text-anchor="middle">Cloud Microservices</text>
    <rect x="456" width="160" height="30" rx="15" fill="#FF6B00" fill-opacity="0.15"/>
    <text x="536" y="20" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="700" fill="#FF6B00" text-anchor="middle">Business Websites</text>
  </g>

  <g transform="translate(80, 540)">
    <text x="0" y="14" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600" fill="#64748B">
      <tspan fill="#FF6B00">✓</tspan> Fixed INR Milestones
      <tspan dx="12" fill="#FF6B00">✓</tspan> 100% Code Handover
      <tspan dx="12" fill="#FF6B00">✓</tspan> Zero Hidden Costs
      <tspan dx="12" fill="#FF6B00">✓</tspan> Post-Launch Warranty
    </text>
  </g>

  <g transform="translate(900, 560)">
    <rect width="230" height="42" rx="21" fill="#FF6B00"/>
    <text x="115" y="27" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="800" fill="#FFF" text-anchor="middle" letter-spacing="0.5">arivomtechnologies.com</text>
  </g>

  <g transform="translate(920, 80)">
    <rect width="210" height="48" rx="24" fill="#FFF" fill-opacity="0.08" stroke="#FFF" stroke-opacity="0.12" stroke-width="1"/>
    <circle cx="28" cy="24" r="14" fill="#FFF4E8" fill-opacity="0.2"/>
    <text x="28" y="29" font-family="-apple-system, sans-serif" font-size="13" font-weight="900" fill="#FF6B00" text-anchor="middle">★</text>
    <text x="54" y="21" font-family="-apple-system, sans-serif" font-size="12" font-weight="800" fill="#FFF">5.0 Star Client Trust</text>
    <text x="54" y="37" font-family="-apple-system, sans-serif" font-size="10" font-weight="600" fill="#94A3B8">Chennai, India • Global SLA</text>
  </g>

  <g transform="translate(920, 144)">
    <rect width="210" height="40" rx="20" fill="#059669" fill-opacity="0.15" stroke="#059669" stroke-opacity="0.3" stroke-width="1"/>
    <text x="105" y="26" font-family="-apple-system, sans-serif" font-size="12" font-weight="800" fill="#34D399" text-anchor="middle">Packages from ₹10K–₹15K</text>
  </g>
</svg>`;

  const bannerBg = await sharp(Buffer.from(bannerSvg)).png().toBuffer();
  await sharp(bannerBg)
    .composite([
      { input: lockupForBanner, left: 80, top: 80 },
      { input: wmBuf, left: 850, top: 250 },
    ])
    .jpeg({ quality: 93, chromaSubsampling: '4:4:4' })
    .toFile('public/images/arivom-share-banner.jpg');
  console.log('  ✓ Saved arivom-share-banner.jpg');

  // ── Share Square (600x600) ──
  console.log('\nStep 6: Generating share square (600x600)...');
  const sqrEmblem = await sharp(trimmedEmblem)
    .resize(200, null, { fit: 'inside' })
    .toBuffer();
  const sqrMeta = await sharp(sqrEmblem).metadata();
  const sqrLeft = Math.round((600 - sqrMeta.width) / 2);

  const squareSvg = `
<svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sqbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1A42"/>
      <stop offset="50%" stop-color="#0B1437"/>
      <stop offset="100%" stop-color="#080E2A"/>
    </linearGradient>
    <radialGradient id="sqgl" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#FF6B00" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#FF6B00" stop-opacity="0"/>
    </radialGradient>
    <pattern id="sqgr" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFF" stroke-width="0.4" stroke-opacity="0.04"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#sqbg)"/>
  <rect width="100%" height="100%" fill="url(#sqgr)"/>
  <rect width="100%" height="100%" fill="url(#sqgl)"/>
  <rect x="0" y="0" width="100%" height="4" fill="#FF6B00"/>

  <text x="300" y="320" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="42" font-weight="900" fill="#FFF" text-anchor="middle" letter-spacing="-0.5">ARIVOM</text>
  <text x="300" y="350" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="800" fill="#64748B" text-anchor="middle" letter-spacing="7">TECHNOLOGIES</text>

  <rect x="175" y="375" width="250" height="34" rx="17" fill="none" stroke="#FF6B00" stroke-opacity="0.5" stroke-width="1.2"/>
  <text x="300" y="397" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="#FF6B00" text-anchor="middle" letter-spacing="1.8">INNOVATE • BUILD • GROW</text>

  <text x="300" y="442" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="700" fill="#E2E8F0" text-anchor="middle">Software &amp; Web Development Studio</text>
  <text x="300" y="465" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11.5" font-weight="500" fill="#94A3B8" text-anchor="middle">Angular 19 • Spring Boot 3 • React Native • Cloud</text>

  <rect x="165" y="486" width="270" height="30" rx="15" fill="#059669" fill-opacity="0.15" stroke="#059669" stroke-opacity="0.3" stroke-width="1"/>
  <text x="300" y="506" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" fill="#34D399" text-anchor="middle">Starter Websites ₹10K–₹15K • 100% Code Handover</text>

  <rect x="150" y="540" width="300" height="36" rx="18" fill="#FF6B00"/>
  <text x="300" y="563" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="800" fill="#FFF" text-anchor="middle" letter-spacing="0.5">arivomtechnologies.com</text>
</svg>`;

  const sqBg = await sharp(Buffer.from(squareSvg)).png().toBuffer();
  await sharp(sqBg)
    .composite([{ input: sqrEmblem, left: sqrLeft, top: 75 }])
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile('public/images/arivom-share-square.jpg');
  console.log('  ✓ Saved arivom-share-square.jpg');

  console.log('\n✅ All assets regenerated with transparent emblem background!');
}

main().catch(err => { console.error(err); process.exit(1); });
