// One-off image optimizer. Re-encodes selected assets in place with sharp.
// Backgrounds are heavily blurred + low-opacity on the site, so they tolerate
// aggressive downscale/quality. Project/case-study images that are shown clearly
// get conservative quality to avoid visible degradation.
import sharp from 'sharp';
import { statSync, copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const dir = path.resolve('src/assets');

// [file, maxWidth (0 = keep), quality]
const plan = [
  // --- Heavily blurred / low-opacity backgrounds: aggressive ---
  ['background.webp', 800, 62],   // Hero bg, eager (LCP). blur + opacity 0.1-0.3
  ['liquid-bg.webp',  900, 58],   // TechStack/Contact bg, blur-8px..blur-3xl
  ['testx.webp',      900, 60],   // Contact bg, blur-sm grayscale low-opacity
  ['ai-bg.webp',      1200, 68],  // case-study hero bg
  ['ai2-bg.webp',     1200, 68],
  ['med-bg.webp',     1200, 68],
  ['med2-bg.webp',    1200, 68],
  ['med3-bg.webp',    1200, 68],

  // --- Clearly-visible imagery: conservative quality, keep resolution ---
  ['core-logic.webp',       0, 80],
  ['nexus-db.webp',         0, 80],
  ['blueprint-engine.webp', 0, 80],
  ['lms1.webp',          1200, 76],
  ['lms-hero.webp',         0, 78],
  ['lms-tech.webp',         0, 78],
];

let before = 0, after = 0;
for (const [file, maxW, q] of plan) {
  const p = path.join(dir, file);
  if (!existsSync(p)) { console.log(`SKIP (missing): ${file}`); continue; }
  const origSize = statSync(p).size;
  const bak = p + '.bak';
  if (!existsSync(bak)) copyFileSync(p, bak); // safety backup (gitignored pattern)

  const meta = await sharp(bak).metadata();
  let pipe = sharp(bak);
  if (maxW && meta.width > maxW) pipe = pipe.resize({ width: maxW });
  const buf = await pipe.webp({ quality: q, effort: 6 }).toBuffer();

  // Only write if we actually saved bytes.
  if (buf.length < origSize) {
    const { writeFileSync } = await import('node:fs');
    writeFileSync(p, buf);
  }
  const newSize = statSync(p).size;
  before += origSize; after += newSize;
  const pct = ((1 - newSize / origSize) * 100).toFixed(0);
  console.log(`${file.padEnd(24)} ${(origSize/1024).toFixed(0).padStart(4)}KB -> ${(newSize/1024).toFixed(0).padStart(4)}KB  (-${pct}%)`);
}
console.log(`\nTOTAL ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB  (-${((1-after/before)*100).toFixed(0)}%)`);
