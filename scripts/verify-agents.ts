import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verify() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found');

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'promply');
    const collection = db.collection('agents');

    const agents = await collection.find({ isActive: true }).toArray();
    console.log(`Found ${agents.length} active agents in the database:`);
    agents.forEach((a, i) => {
      console.log(`${i+1}. ${a.name} | Category: ${a.category} | TX: ${a.txId}`);
    });
  } finally {
    await client.close();
  }
}

verify().catch(console.error);
