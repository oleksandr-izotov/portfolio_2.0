import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const paths = ['/', '/impressum', '/lms-case-study', '/ai-saas-case-study', '/medtech-case-study', '/datenschutz', '/does-not-exist'];
let bad = 0;

for (const p of paths) {
  const page = await browser.newPage();
  const msgs = [];
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) msgs.push(`[${m.type()}] ${m.text().slice(0, 220)}`); });
  page.on('pageerror', e => msgs.push(`[pageerror] ${String(e).slice(0, 220)}`));
  const resp = await page.goto('http://127.0.0.1:4173' + p, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 900));
  const title = await page.title();
  const h1 = await page.$eval('h1', e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 45)).catch(() => '—');
  console.log(`${p.padEnd(24)} ${resp.status()}  "${title.slice(0, 46)}"  h1="${h1}"`);
  if (msgs.length) { bad++; msgs.slice(0, 5).forEach(m => console.log('     ' + m)); }
  await page.close();
}

console.log(bad ? `\n${bad} страниц(ы) с сообщениями в консоли` : '\nКонсоль чистая на всех страницах');
await browser.close();
