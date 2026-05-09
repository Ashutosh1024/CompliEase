import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { sendSMS, sendWhatsApp, buildMessage } from '@/lib/alertService';
import { loadAlertConfig } from '@/lib/credentialVault';

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { channels, alertTitle, alertMessage, alertType = 'info' } = await req.json();
  if (!channels?.length || !alertTitle || !alertMessage)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const db      = await getDb();
  const profile = await db.collection('profiles').findOne({ userId: user.userId });
  const mobile   = profile?.mobile || '';
  const business = profile?.businessName || 'Your Business';
  const creds    = await loadAlertConfig(db, user.userId);

  const msg     = buildMessage({ businessName: business, title: alertTitle, body: alertMessage });
  const results: Record<string, string | boolean> = {};
  const errors:  Record<string, string>            = {};
  const needsSetup: string[] = [];

  // ── SMS (Fast2SMS) ───────────────────────────────────────
  if (channels.includes('sms')) {
    if (!mobile) { errors.sms = 'No mobile number in your profile'; }
    else {
      const key = creds.fast2smsKey || process.env.FAST2SMS_API_KEY;
      if (!key || key === 'your-fast2sms-api-key') {
        needsSetup.push('sms');
        errors.sms = 'Fast2SMS API key not configured';
      } else {
        try { results.sms = await sendSMS(mobile, msg, key); }
        catch (e: any) { errors.sms = e.message; }
      }
    }
  }

  // ── WhatsApp (Twilio) ────────────────────────────────────
  if (channels.includes('whatsapp')) {
    if (!mobile) { errors.whatsapp = 'No mobile number in your profile'; }
    else {
      const sid   = creds.twilioSid   || process.env.TWILIO_ACCOUNT_SID;
      const token = creds.twilioToken || process.env.TWILIO_AUTH_TOKEN;
      const from  = creds.twilioWaPhone || process.env.TWILIO_WHATSAPP_NUMBER;
      if (!sid || sid.startsWith('ACxxxxxxx')) {
        needsSetup.push('whatsapp');
        errors.whatsapp = 'Twilio credentials not configured';
      } else {
        try { results.whatsapp = await sendWhatsApp(mobile, msg, { sid, token, from }); }
        catch (e: any) { errors.whatsapp = e.message; }
      }
    }
  }

  await db.collection('alerts').insertOne({
    userId: user.userId, channels, alertTitle, alertMessage,
    alertType, results, errors, sentAt: new Date(),
  });

  const anySuccess = Object.keys(results).length > 0;
  return NextResponse.json({
    success:    anySuccess,
    results,
    errors:     Object.keys(errors).length ? errors : undefined,
    needsSetup: needsSetup.length ? needsSetup : undefined,
    message:    anySuccess
      ? `✅ Alert sent via: ${Object.keys(results).join(', ')}`
      : needsSetup.length
        ? 'Please configure your API keys in Alert Settings below'
        : Object.values(errors).join('; '),
  });
}
