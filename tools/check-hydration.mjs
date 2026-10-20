import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const pages = ['/', '/lms-case-study', '/fortochka-case-study', '/medtech-case-study', '/impressum', '/datenschutz'];
// Every page exists three times: English at the root, German and Russian under a prefix.
const paths = [
  ...['', '/de', '/ru'].flatMap(prefix => pages.map(p => (p === '/' ? prefix || '/' : prefix + p))),
  '/does-not-exist',
];
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
