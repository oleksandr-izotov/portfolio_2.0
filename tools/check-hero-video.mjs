// Verifies the hero backdrop video: that it loads and plays on a desktop
// viewport, that it is skipped where it should be (reduced motion, small
// screen), and that the still image is always there underneath.
import puppeteer from 'puppeteer-core';

const base = process.env.SITE_URL || 'https://izotov.dev';

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
});

async function inspect(label, { width, height, reducedMotion = false }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

  const videoRequests = [];
  page.on('response', r => {
    const u = r.url();
    if (/\.(webm|mp4)(\?|$)/.test(u)) videoRequests.push(`${u.split('/').pop()} ${r.status()}`);
  });

  await page.goto(base + '/', { waitUntil: 'networkidle0', timeout: 45000 });
  // The video is deliberately deferred to idle time.
  await new Promise(r => setTimeout(r, 4000));

  const state = await page.evaluate(() => {
    const v = document.querySelector('video');
    const img = document.querySelector('section img');
    return {
      hasVideo: !!v,
      playing: v ? !v.paused && v.currentTime > 0 : false,
      currentTime: v ? Number(v.currentTime.toFixed(1)) : null,
      opacity: v ? getComputedStyle(v).opacity : null,
      muted: v?.muted ?? null,
      loop: v?.loop ?? null,
      stillImage: !!img,
    };
  });

  console.log(`${label}:`);
  console.log(`  <video> в DOM: ${state.hasVideo ? 'да' : 'нет'}${state.hasVideo ? `, играет: ${state.playing}, t=${state.currentTime}s, opacity=${state.opacity}, muted=${state.muted}, loop=${state.loop}` : ''}`);
  console.log(`  картинка-подложка: ${state.stillImage ? 'на месте' : 'ОТСУТСТВУЕТ'}`);
  console.log(`  запрошено видеофайлов: ${videoRequests.length ? videoRequests.join(', ') : 'ни одного'}`);
  await page.close();
}

await inspect('Десктоп 1440×900', { width: 1440, height: 900 });
await inspect('Телефон 390×844', { width: 390, height: 844 });
await inspect('Десктоп + prefers-reduced-motion', { width: 1440, height: 900, reducedMotion: true });

await browser.close();
