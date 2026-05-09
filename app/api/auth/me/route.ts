import { getDb } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await getDb();
    const users = db.collection('users');
    const doc = await users.findOne({ _id: new ObjectId(user.userId) }, { projection: { passwordHash: 0 } });
    if (!doc) return Response.json({ error: 'User not found' }, { status: 404 });

    return Response.json({ user: { id: doc._id.toString(), name: doc.name, email: doc.email, plan: doc.plan || 'free' } });
  } catch (err) {
    console.error('[me]', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
