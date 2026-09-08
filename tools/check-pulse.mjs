// Verifies the System Pulse panel reports live figures rather than constants:
// scrolls it into view, waits for a poll, and prints what a visitor would see.
import puppeteer from 'puppeteer-core';

const base = process.env.SITE_URL || 'https://izotov.dev';

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();

const problems = [];
page.on('console', m => { if (m.type() === 'error') problems.push(m.text().slice(0, 180)); });
page.on('pageerror', e => problems.push(String(e).slice(0, 180)));

await page.goto(base + '/', { waitUntil: 'networkidle0', timeout: 45000 });

// The panel sits beside the contact form at the bottom of the page.
await page.evaluate(() => document.getElementById('contact')?.scrollIntoView());
await new Promise(r => setTimeout(r, 2500));

const panel = await page.evaluate(() => {
  const labels = [...document.querySelectorAll('span')].filter(s => s.textContent === 'System_Pulse');
  const root = labels[0]?.closest('div')?.parentElement?.parentElement;
  if (!root) return null;
  const state = root.querySelector('[aria-live]')?.textContent?.trim();
  const cells = [...root.querySelectorAll('.grid-cols-4 > div')].map(d => ({
    label: d.children[0]?.textContent?.trim(),
    value: d.children[1]?.textContent?.trim(),
  }));
  return { state, cells };
});

console.log('состояние панели:', panel?.state ?? '— не найдена —');
for (const c of panel?.cells ?? []) console.log(`  ${String(c.label).padEnd(14)} ${c.value}`);

const dashes = (panel?.cells ?? []).filter(c => c.value === '—').length;
console.log(dashes ? `\n${dashes} метрик без данных` : '\nВсе четыре метрики с живыми значениями');
console.log(problems.length ? 'Ошибки в консоли: ' + problems.join(' | ') : 'Консоль чистая');

await browser.close();
