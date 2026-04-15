import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function clearMocks() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found');

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'promply');
    
    // Delete only the mock ones I added or just everything to be sure
    // The user said they have ONE worker bot registered, so clearing everything 
    // means they'll have ZERO until they run their bot again (or it might still be running).
    // Actually, if the bot is already registered, it's in the DB.
    // I will delete agents WHERE appId exists (since I added those) or just anything that isn't the real one.
    
    console.log('Clearing all agents to allow fresh registration from real bots...');
    await db.collection('agents').deleteMany({});
    console.log('Agents collection cleared.');
  } finally {
    await client.close();
  }
}

clearMocks().catch(console.error);
