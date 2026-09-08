// Exercises the contact relay locally: honeypot, rate limiting, validation and
// spoofing resistance. TELEGRAM_BOT_TOKEN is deliberately fake — a request that
// reaches Telegram fails there, which is itself the signal that validation let
// it through.
const BASE = 'http://127.0.0.1:3999/api/contact';

const valid = { name: 'Test', email: 't@example.com', description: 'hello', contactMethod: 'telegram' };

async function post(body, headers = {}) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

const ipA = { 'X-Real-IP': '203.0.113.10' };
const ipB = { 'X-Real-IP': '203.0.113.99' };

console.log('1. honeypot заполнен → тихий 200, в Telegram не уходит');
console.log('  ', JSON.stringify(await post({ ...valid, company_website: 'spam.example' }, ipA)));

console.log('2. поле не строка (name как объект) → 400, а не падение');
console.log('  ', JSON.stringify(await post({ ...valid, name: { $ne: null } }, ipB)));

console.log('3. пустое обязательное поле → 400');
console.log('  ', JSON.stringify(await post({ ...valid, description: '   ' }, ipB)));

console.log('4. лимит: 3 запроса с одного IP проходят к Telegram (500 = фейковый токен), 4-й → 429');
for (let i = 1; i <= 4; i++) {
  const r = await post(valid, ipA);
  console.log(`   попытка ${i}: ${r.status} ${JSON.stringify(r.body)}`);
}

console.log('5. подделка X-Forwarded-For больше не сбрасывает лимит (тот же X-Real-IP)');
const spoof = await post(valid, { ...ipA, 'X-Forwarded-For': '1.2.3.4' });
console.log('  ', JSON.stringify(spoof), spoof.status === 429 ? '← лимит держится' : '← ЛИМИТ ОБОЙДЁН');

console.log('6. другой реальный IP имеет собственную квоту');
console.log('  ', JSON.stringify(await post(valid, { 'X-Real-IP': '198.51.100.7' })));

console.log('7. GET вместо POST → 405');
const g = await fetch(BASE);
console.log('   status', g.status);
