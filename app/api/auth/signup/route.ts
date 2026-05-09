import { getDb } from '@/lib/mongodb';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password)
      return Response.json({ error: 'Name, email, and password are required' }, { status: 400 });

    if (password.length < 6)
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });

    const db = await getDb();
    const users = db.collection('users');

    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing)
      return Response.json({ error: 'Email already registered. Please sign in.' }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    const result = await users.insertOne({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      plan: 'free',
      createdAt: now,
      updatedAt: now,
    });

    const token = signToken({
      userId: result.insertedId.toString(),
      email: email.toLowerCase().trim(),
      name: name.trim(),
    });

    return Response.json({
      token,
      user: { id: result.insertedId.toString(), name: name.trim(), email: email.toLowerCase().trim(), plan: 'free' },
    }, { status: 201 });

  } catch (err) {
    console.error('[signup]', err);
    return Response.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
