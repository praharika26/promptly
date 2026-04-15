import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function patch() {
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || 'promply');
  
  const result = await db.collection('agents').updateMany(
    { priceAlgo: { $exists: false } },
    { $set: { priceAlgo: 10000 } }
  );

  console.log(`✅ Patched ${result.modifiedCount} agents with default pricing.`);
  await client.close();
}

patch().catch(console.error);
