import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
const problems = [];
page.on('pageerror', e => problems.push('pageerror: ' + String(e).slice(0, 150)));

await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' });

const read = () => page.evaluate(() => ({
  url: location.pathname,
  title: document.title,
  desc: document.querySelector('meta[name="description"]')?.content.slice(0, 60),
  canonical: document.querySelector('link[rel="canonical"]')?.href,
}));

console.log('start:', JSON.stringify(await read()));

// Click through to a case study via the project card link.
await page.evaluate(() => document.querySelector('a[href="/lms-case-study"]')?.click());
await new Promise(r => setTimeout(r, 900));
console.log('after click:', JSON.stringify(await read()));

// Back to home.
await page.goBack({ waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 900));
console.log('after back:', JSON.stringify(await read()));

// Footer link to the imprint.
await page.evaluate(() => document.querySelector('a[href="/impressum"]')?.click());
await new Promise(r => setTimeout(r, 900));
console.log('after imprint:', JSON.stringify(await read()));

// Language switch keeps working after hydration.
const langBefore = await page.evaluate(() => document.documentElement.lang);
console.log('html lang:', langBefore);

console.log(problems.length ? 'ПРОБЛЕМЫ: ' + problems.join(' | ') : 'ошибок нет');
await browser.close();
