import { getDb } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// GET /api/documents — list user's documents
export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await getDb();
    const docs = await db.collection('documents')
      .find({ userId: user.userId }, { projection: { fileData: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      documents: docs.map(d => ({ ...d, id: d._id.toString(), _id: undefined }))
    });
  } catch (err) {
    console.error('[documents GET]', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/documents — upload a document (base64)
export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, category, size, mimeType, fileData } = body;

    if (!name || !fileData)
      return Response.json({ error: 'name and fileData are required' }, { status: 400 });

    const db = await getDb();
    const now = new Date();

    const result = await db.collection('documents').insertOne({
      userId: user.userId,
      name,
      category: category || 'Other',
      size: size || '—',
      mimeType: mimeType || 'application/octet-stream',
      fileData, // base64
      createdAt: now,
    });

    return Response.json({
      document: { id: result.insertedId.toString(), name, category, size, mimeType, createdAt: now }
    }, { status: 201 });
  } catch (err) {
    console.error('[documents POST]', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/documents?id=xxx
export async function DELETE(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return Response.json({ error: 'id is required' }, { status: 400 });

    const db = await getDb();
    const result = await db.collection('documents').deleteOne({
      _id: new ObjectId(id),
      userId: user.userId, // ensure ownership
    });

    if (result.deletedCount === 0)
      return Response.json({ error: 'Document not found' }, { status: 404 });

    return Response.json({ success: true });
  } catch (err) {
    console.error('[documents DELETE]', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
