import { MongoClient } from 'mongodb';

let db = false;
async function createConnection() {
  const client = new MongoClient(process.env.MONGODB_URI);
  const clientPromise = await client.connect();
  const mongo = await clientPromise;
  db = mongo.db('sample_mflix');
}

export async function handler() {
  if (!db) {
    await createConnection();
  }

  const collection = db.collection('movies');
  const movies = await collection.find({}).limit(5).toArray();

  return {
    statusCode: 200,
    body: JSON.stringify(movies),
  };
}
