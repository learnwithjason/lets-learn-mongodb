import { MongoClient } from 'mongodb';

let db = false;
async function createConnection() {
  const client = new MongoClient(process.env.MONGODB_URI);
  const clientPromise = await client.connect();
  const mongo = await clientPromise;
  db = mongo.db('sample_mflix');
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 500, body: 'nope' };
  }

  if (!db) {
    await createConnection();
  }

  const result = await db.collection('movies').insertOne({
    boop: true,
    message: 'hello chat!',
    ideas: ['burritos', 'hugs', 'pizza'],
  });

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}
