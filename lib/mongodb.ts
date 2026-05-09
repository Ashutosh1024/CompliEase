import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI!;

if (!uri) throw new Error('MONGODB_URI is not defined in .env.local');

interface CachedMongoClient {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: CachedMongoClient;
}

if (!global._mongoClientPromise) {
  global._mongoClientPromise = { client: null, promise: null };
}

const cached = global._mongoClientPromise;

async function connectToDatabase(): Promise<MongoClient> {
  if (cached.client) return cached.client;
  if (!cached.promise) {
    cached.promise = MongoClient.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
  }
  try {
    cached.client = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.client;
}

export async function getDb(): Promise<Db> {
  const client = await connectToDatabase();
  return client.db('CompliEase');
}

export default connectToDatabase;
