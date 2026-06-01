import sharp from 'sharp';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const dir = path.resolve('src/assets');
const files = readdirSync(dir).filter(f => f.endsWith('.webp') && !f.includes('.old.'));
for (const f of files.sort()) {
  const p = path.join(dir, f);
  const { width, height } = await sharp(p).metadata();
  const kb = (statSync(p).size / 1024).toFixed(0);
  console.log(`${kb.padStart(5)}KB  ${String(width).padStart(5)}x${String(height).padEnd(5)}  ${f}`);
}
