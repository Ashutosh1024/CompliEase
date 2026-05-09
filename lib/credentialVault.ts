import crypto from 'crypto';

const ALGO = 'aes-256-cbc';

function getKey(): Buffer {
  return crypto.createHash('sha256').update(process.env.JWT_SECRET || 'compliease-key').digest();
}

export function encryptCredential(plain: string): string {
  const iv  = crypto.randomBytes(16);
  const c   = crypto.createCipheriv(ALGO, getKey(), iv);
  const enc = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  return iv.toString('hex') + ':' + enc.toString('hex');
}

export function decryptCredential(cipher: string): string {
  const [ivHex, encHex] = cipher.split(':');
  const d = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(ivHex, 'hex'));
  return Buffer.concat([d.update(Buffer.from(encHex, 'hex')), d.final()]).toString('utf8');
}

export async function loadAlertConfig(db: any, userId: string) {
  const doc  = await db.collection('alert_config').findOne({ userId });
  const safe = (f: string) => { try { return doc?.[f] ? decryptCredential(doc[f]) : null; } catch { return null; } };
  return {
    fast2smsKey:  safe('fast2smsKey'),
    twilioSid:    safe('twilioSid'),
    twilioToken:  safe('twilioToken'),
    twilioWaPhone:safe('twilioWaPhone'),
  };
}
