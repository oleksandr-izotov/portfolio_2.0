import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const paths = ['/', '/impressum', '/lms-case-study', '/medtech-case-study', '/nope-404'];
let problems = 0;

for (const p of paths) {
  const page = await browser.newPage();
  const msgs = [];
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) msgs.push(`[${m.type()}] ${m.text().slice(0, 200)}`); });
  page.on('pageerror', e => msgs.push(`[pageerror] ${String(e).slice(0, 200)}`));
  page.on('requestfailed', r => msgs.push(`[failed] ${r.url().slice(0, 90)} — ${r.failure()?.errorText}`));

  const resp = await page.goto('https://izotov.dev' + p, { waitUntil: 'networkidle0', timeout: 45000 });
  await new Promise(r => setTimeout(r, 1000));

  const title = await page.title();
  const h1 = await page.$eval('h1', e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)).catch(() => '—');
  // Did the page actually render, or is it a blank shell?
  const textLen = await page.evaluate(() => document.body.innerText.length);

  console.log(`${p.padEnd(22)} ${resp.status()}  текста ${String(textLen).padStart(5)} симв.  "${title.slice(0, 42)}"  h1="${h1}"`);
  if (msgs.length) { problems += msgs.length; msgs.slice(0, 4).forEach(m => console.log('     ' + m)); }
  await page.close();
}

console.log(problems ? `\n${problems} сообщений в консоли` : '\nКонсоль чистая, CSP ничего не блокирует');
await browser.close();
