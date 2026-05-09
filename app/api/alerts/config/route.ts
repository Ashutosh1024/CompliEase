import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { encryptCredential, decryptCredential } from '@/lib/credentialVault';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db  = await getDb();
  const doc = await db.collection('alert_config').findOne({ userId: user.userId });

  const safe = (f: string) => { try { return doc?.[f] ? decryptCredential(doc[f]) : ''; } catch { return ''; } };

  return NextResponse.json({
    config: {
      fast2smsKey:   safe('fast2smsKey'),
      twilioSid:     safe('twilioSid'),
      twilioToken:   safe('twilioToken'),
      twilioWaPhone: safe('twilioWaPhone'),
      smsConfigured: !!(doc?.fast2smsKey),
      waConfigured:  !!(doc?.twilioSid && doc?.twilioToken),
    }
  });
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const update: Record<string, string> = {};
  const enc = (v: string) => encryptCredential(v);

  if (body.fast2smsKey)   update.fast2smsKey   = enc(body.fast2smsKey);
  if (body.twilioSid)     update.twilioSid     = enc(body.twilioSid);
  if (body.twilioToken)   update.twilioToken   = enc(body.twilioToken);
  if (body.twilioWaPhone) update.twilioWaPhone = enc(body.twilioWaPhone);

  if (!Object.keys(update).length)
    return NextResponse.json({ error: 'No credentials provided' }, { status: 400 });

  const db = await getDb();
  await db.collection('alert_config').updateOne(
    { userId: user.userId },
    { $set: { ...update, updatedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}
