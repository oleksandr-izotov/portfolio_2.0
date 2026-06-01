// Minimal zero-dependency contact-form backend for izotov.dev.
// Receives POST /api/contact (proxied by nginx), validates, and relays the
// request to Telegram. Ported from the old Vercel edge function api/contact.ts.
//
// Runtime: node:20-alpine (global fetch). Listens on 127.0.0.1 inside the
// container; published to 127.0.0.1:PORT on the host and reverse-proxied by nginx.

import { createServer } from 'node:http';
import dns from 'node:dns';

// Prefer IPv4 — this host's IPv6 egress to Telegram is unreachable.
// This VPS's upstream network filters most of Telegram's IP range, so the
// container is pinned to a reachable Telegram DC IP via --add-host at
// `docker run` time (see deploy/deploy-contact-api.sh). With that pin in place,
// sendMessage works; without it, this would fail with ETIMEDOUT.
dns.setDefaultResultOrder('ipv4first');

const PORT = Number(process.env.PORT) || 3002;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// --- Rate limiter (per-IP, in-memory) -------------------------------------
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) rateLimitMap.delete(key);
  }
  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

// --- Helpers --------------------------------------------------------------
function escapeMarkdown(text) {
  return String(text).replace(/([_*\[\]()~`>#+\-=|{}.\\!])/g, '\\$1');
}

const FIELD_LIMITS = { name: 100, phone: 30, email: 200, description: 2000 };

function json(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function getIP(req) {
  // nginx sets X-Forwarded-For with the real client (CF-Connecting-IP upstream).
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return fwd.split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

function readBody(req, limitBytes = 16_384) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limitBytes) {
        reject(new Error('payload too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// --- Handler --------------------------------------------------------------
async function handleContact(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const ip = getIP(req);
  if (!checkRateLimit(ip)) return json(res, 429, { error: 'Too many requests' });

  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch {
    return json(res, 400, { error: 'Invalid JSON' });
  }

  const { name, phone, email, type, description, contactMethod } = body || {};

  if (!name || !email || !description) {
    return json(res, 400, { error: 'Missing required fields' });
  }
  if (name.length > FIELD_LIMITS.name) {
    return json(res, 400, { error: `Name must be ${FIELD_LIMITS.name} characters or less` });
  }
  if (phone && phone.length > FIELD_LIMITS.phone) {
    return json(res, 400, { error: `Phone must be ${FIELD_LIMITS.phone} characters or less` });
  }
  if (email.length > FIELD_LIMITS.email) {
    return json(res, 400, { error: `Email must be ${FIELD_LIMITS.email} characters or less` });
  }
  if (description.length > FIELD_LIMITS.description) {
    return json(res, 400, { error: `Description must be ${FIELD_LIMITS.description} characters or less` });
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Server misconfigured: missing TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID');
    return json(res, 500, { error: 'Server misconfigured' });
  }

  const typeLabel = type === 'company' ? '🏢 Company' : '👤 Private';
  const methodLabel =
    contactMethod === 'telegram' ? '💬 Telegram'
    : contactMethod === 'whatsapp' ? '📱 WhatsApp'
    : '📧 Email';

  const text = [
    `🚀 \\*New Request from Portfolio\\*`,
    ``,
    `${escapeMarkdown(typeLabel)}`,
    `👤 \\*Name:\\* ${escapeMarkdown(name)}`,
    `📱 \\*Phone:\\* ${escapeMarkdown(phone || '—')}`,
    `📧 \\*Email:\\* ${escapeMarkdown(email)}`,
    ``,
    `📝 \\*Task:\\*`,
    `${escapeMarkdown(description)}`,
    ``,
    `💬 \\*Preferred Contact:\\* ${escapeMarkdown(methodLabel)}`,
    ``,
    `\\_Sent via portfolio contact form\\_`,
  ].join('\n');

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'MarkdownV2' }),
    });
    if (!tgRes.ok) {
      console.error('Telegram error:', await tgRes.text());
      return json(res, 500, { error: 'Failed to send' });
    }
  } catch (err) {
    console.error('Telegram fetch failed:', err);
    return json(res, 500, { error: 'Failed to send' });
  }

  return json(res, 200, { success: true });
}

const server = createServer((req, res) => {
  const url = (req.url || '').split('?')[0];
  if (url === '/api/contact') return handleContact(req, res);
  if (url === '/healthz') return json(res, 200, { ok: true });
  return json(res, 404, { error: 'Not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`contact-api listening on :${PORT}`);
});
