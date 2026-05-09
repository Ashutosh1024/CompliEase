// lib/alertService.ts — SMS (Fast2SMS) + WhatsApp (Twilio)

// ── Fast2SMS (India) ─────────────────────────────────────────────
// Free at fast2sms.com — signup gives 38 credits (1 credit = 1 SMS)
export async function sendSMS(phone: string, message: string, apiKey?: string) {
  const key = apiKey || process.env.FAST2SMS_API_KEY;
  if (!key || key === 'your-fast2sms-api-key')
    throw new Error('FAST2SMS_API_KEY not configured');

  // Fast2SMS needs exactly 10 digits
  const clean = phone.replace(/\D/g, '').replace(/^91/, '').slice(-10);
  // Keep message ≤160 chars
  const msg   = message.slice(0, 160);

  // Try GET method (simpler, works without CORS issues)
  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${key}&route=q&message=${encodeURIComponent(msg)}&numbers=${clean}&language=english&flash=0`;
  const res  = await fetch(url, { method: 'GET' });

  // Read raw response for better error diagnosis
  const text = await res.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch { throw new Error(`Fast2SMS non-JSON response (${res.status}): ${text.slice(0,120)}`); }

  if (res.status === 401 || !data.return) {
    const reason = data.message || text.slice(0, 120);
    if (reason.includes('Key Disabled') || data.status_code === 413)
      throw new Error('Fast2SMS API key is DISABLED — go to fast2sms.com → Dev API → API Key → click the Enable button');
    if (reason.includes('Invalid Authentication') || data.status_code === 412)
      throw new Error('Fast2SMS: Wrong API key — re-paste from fast2sms.com → Dev API → API Key → View');
    throw new Error(`Fast2SMS: ${reason}`);
  }


  return data.request_id as string;
}


// ── Twilio WhatsApp ──────────────────────────────────────────────
// Sign up at twilio.com → get Account SID + Auth Token
// Join sandbox: text "join <word>" to +14155238886 (WhatsApp)
export async function sendWhatsApp(phone: string, message: string, opts?: {
  sid?: string; token?: string; from?: string;
}) {
  const sid   = opts?.sid   || process.env.TWILIO_ACCOUNT_SID;
  const token = opts?.token || process.env.TWILIO_AUTH_TOKEN;
  const from  = opts?.from  || process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886';

  if (!sid || !token || sid.startsWith('ACxxxxxxx'))
    throw new Error('Twilio credentials not configured');

  const clean   = phone.replace(/\D/g, '').replace(/^91/, '');
  const toPhone = `whatsapp:+91${clean}`;
  const frPhone = from.startsWith('whatsapp:') ? from : `whatsapp:${from}`;

  const twilio = (await import('twilio')).default(sid, token);
  const msg    = await twilio.messages.create({ body: message, from: frPhone, to: toPhone });
  return msg.sid;
}

// ── Message builder ──────────────────────────────────────────────
export function buildMessage(opts: { businessName: string; title: string; body: string }) {
  // Keep under 160 chars for SMS
  const short = opts.body.length > 80 ? opts.body.slice(0, 77) + '...' : opts.body;
  return `CompliEase: ${opts.title}\n${short}\nDashboard: localhost:3000/dashboard`;
}
