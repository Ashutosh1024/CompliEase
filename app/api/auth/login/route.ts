import { getDb } from '@/lib/mongodb';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password)
      return Response.json({ error: 'Email and password are required' }, { status: 400 });

    const db = await getDb();
    const users = db.collection('users');

    const user = await users.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return Response.json({ error: 'No account found with this email.' }, { status: 401 });

    const valid = await bcrypt.compare(password, user.passwordHash as string);
    if (!valid)
      return Response.json({ error: 'Incorrect password.' }, { status: 401 });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email as string,
      name: user.name as string,
    });

    return Response.json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email, plan: user.plan || 'free' },
    });

  } catch (err) {
    console.error('[login]', err);
    return Response.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
