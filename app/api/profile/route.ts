import { getDb } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await getDb();
    const profile = await db.collection('profiles').findOne({ userId: user.userId });

    if (!profile) return Response.json({ profile: null });

    const { _id, ...rest } = profile;
    return Response.json({ profile: { id: _id.toString(), ...rest } });
  } catch (err) {
    console.error('[profile GET]', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { _id, id, ...profileData } = body;

    const db = await getDb();
    const profiles = db.collection('profiles');

    const now = new Date();
    const result = await profiles.findOneAndUpdate(
      { userId: user.userId },
      {
        $set: { ...profileData, userId: user.userId, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: 'after' }
    );

    const saved = result;
    if (!saved) return Response.json({ error: 'Failed to save' }, { status: 500 });

    const { _id: docId, ...savedRest } = saved;
    return Response.json({ profile: { id: docId.toString(), ...savedRest } });
  } catch (err) {
    console.error('[profile POST]', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
