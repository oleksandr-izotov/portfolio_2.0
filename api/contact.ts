export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
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
    `🚀 *New Request from Portfolio*`,
    ``,
    `${typeLabel}`,
    `👤 *Name:* ${name}`,
    `📱 *Phone:* ${phone || '—'}`,
    `📧 *Email:* ${email}`,
    ``,
    `📝 *Task:*`,
    `${description}`,
    ``,
    `💬 *Preferred Contact:* ${methodLabel}`,
    ``,
    `_Sent via portfolio contact form_`,
  ].join('\n');

  const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });

  if (!tgRes.ok) {
    const err = await tgRes.text();
    console.error('Telegram error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
