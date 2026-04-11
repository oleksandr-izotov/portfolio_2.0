export const config = { runtime: 'edge' };

// --- Rate Limiter ---
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60_000; // 60 seconds

function getIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
}

function checkRateLimit(ip: string): boolean {
  // Cleanup expired entries
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

// --- Helpers ---

/**
 * Escape special characters for Telegram MarkdownV2.
 * https://core.telegram.org/bots/api#markdownv2-style
 */
function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.\\!])/g, '\\$1');
}

const FIELD_LIMITS = {
  name: 100,
  phone: 30,
  email: 200,
  description: 2000,
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  // Rate limiting check
  const ip = getIP(req);
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { name, phone, email, type, description, contactMethod } = body;

  if (!name || !email || !description) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  // Validate field lengths
  if (name.length > FIELD_LIMITS.name) {
    return new Response(JSON.stringify({ error: `Name must be ${FIELD_LIMITS.name} characters or less` }), { status: 400 });
  }
  if (phone && phone.length > FIELD_LIMITS.phone) {
    return new Response(JSON.stringify({ error: `Phone must be ${FIELD_LIMITS.phone} characters or less` }), { status: 400 });
  }
  if (email.length > FIELD_LIMITS.email) {
    return new Response(JSON.stringify({ error: `Email must be ${FIELD_LIMITS.email} characters or less` }), { status: 400 });
  }
  if (description.length > FIELD_LIMITS.description) {
    return new Response(JSON.stringify({ error: `Description must be ${FIELD_LIMITS.description} characters or less` }), { status: 400 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId   = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 });
  }

  const typeLabel   = type === 'company' ? '🏢 Company' : '👤 Private';
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

  const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'MarkdownV2' }),
  });

  if (!tgRes.ok) {
    const err = await tgRes.text();
    console.error('Telegram error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
