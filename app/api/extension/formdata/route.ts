import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

// GET /api/extension/formdata?portal=udyam — get saved form scan for a portal
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const portal = req.nextUrl.searchParams.get('portal') || '';
  const db     = await getDb();
  const saved  = await db.collection('formscans').findOne({ userId: user.userId, portal });
  return NextResponse.json({ scan: saved?.scan || null });
}

// POST /api/extension/formdata — save scanned form fields from a government portal
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body   = await req.json();
  const { portal, url, fields, title } = body;
  if (!portal || !fields) return NextResponse.json({ error: 'portal and fields required' }, { status: 400 });

  const db = await getDb();
  await db.collection('formscans').updateOne(
    { userId: user.userId, portal },
    { $set: { userId: user.userId, portal, url, title, fields, updatedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}
