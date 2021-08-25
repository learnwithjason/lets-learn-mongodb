import { MongoClient } from 'mongodb';

let db = false;
async function createConnection() {
  const client = new MongoClient(process.env.MONGODB_URI);
  const clientPromise = await client.connect();
  const mongo = await clientPromise;
  db = mongo.db('sample_mflix');
}

export async function handler(event) {
  const { search } = event.queryStringParameters;
  console.log({ search });
  if (!db) {
    await createConnection();
  }

  const collection = db.collection('movies');

  const results = await collection
    .aggregate([
      {
        $search: {
          index: 'movieSearch',
          text: {
            query: search,
            path: {
              wildcard: '*',
            },
          },
        },
      },
      {
        $project: {
          title: 1,
          plot: 1,
        },
      },
    ])
    .toArray();

  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
}
