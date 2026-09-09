// Confirms the hero hover effect works end to end: the name blurs back, the
// role rises through it, and everything returns when the pointer leaves.
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
await new Promise(r => setTimeout(r, 800));

const read = () => page.evaluate(() => {
  const h1 = document.querySelector('h1');
  const style = getComputedStyle(h1);
  const overlay = [...document.querySelectorAll('h2')].find(h => /SOFTWARE|ENGINEER/i.test(h.textContent || ''));
  return {
    h1: h1.textContent.replace(/\s+/g, ' ').trim(),
    h1Opacity: style.opacity,
    h1Filter: style.filter,
    overlay: overlay?.textContent.replace(/\s+/g, ' ').trim() ?? null,
  };
});

console.log('до наведения: ', JSON.stringify(await read()));

await page.hover('h1');
await new Promise(r => setTimeout(r, 1200));
console.log('при наведении:', JSON.stringify(await read()));

await page.mouse.move(5, 5);
await new Promise(r => setTimeout(r, 1200));
console.log('после ухода:  ', JSON.stringify(await read()));

await browser.close();
