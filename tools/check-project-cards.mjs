// Confirms each project card matches its declared status: an active project is
// clickable and links to its case study, one in development is locked and does
// not navigate. Also checks that a case study offers a live demo link only when
// the project actually has one.
import puppeteer from 'puppeteer-core';

const base = process.env.SITE_URL || 'https://izotov.dev';

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(base + '/', { waitUntil: 'networkidle0', timeout: 45000 });

const cards = await page.evaluate(() => {
  const section = document.getElementById('projects');
  return [...section.querySelectorAll('a')].map(a => ({
    href: a.getAttribute('href'),
    title: a.querySelector('h3')?.textContent?.trim().slice(0, 40),
    locked: a.className.includes('cursor-not-allowed'),
  }));
});

console.log('Карточки на главной:');
for (const c of cards) {
  console.log(`  ${c.locked ? '🔒 закрыта' : '🔓 открыта '}  ${String(c.title).padEnd(30)} → ${c.href}`);
}

console.log('\nКнопка живого демо на кейс-страницах:');
for (const path of ['/lms-case-study', '/ai-saas-case-study', '/medtech-case-study']) {
  await page.goto(base + path, { waitUntil: 'networkidle0', timeout: 45000 });
  const state = await page.evaluate(() => {
    const link = [...document.querySelectorAll('a')].find(a => /view live/i.test(a.textContent || ''));
    const badge = [...document.querySelectorAll('div')].find(d => (d.textContent || '').trim() === 'In Development');
    return { live: link?.href ?? null, badge: !!badge };
  });
  console.log(`  ${path.padEnd(24)} ${state.live ? 'ссылка → ' + state.live : state.badge ? 'бейдж «In Development»' : 'НИЧЕГО'}`);
}

await browser.close();
