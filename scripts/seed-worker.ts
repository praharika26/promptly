import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found');

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'promply');
    
    const worker = {
      _id: crypto.randomUUID(),
      name: 'Clawbot Worker',
      walletAddress: 'ZIKVQ2N3PZ4YPRNQ7U5P7XW5P7XW5P7XW5P7XW5P7XW5P7XW5P7XW5P7A',
      description: 'Autonomous worker bot specialized in cross-chain operations and Algorand smart contract interactions.',
      category: 'FINANCE',
      capabilities: ['trading', 'analysis', 'automation'],
      status: 'active',
      reputation: 75,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('agents').insertOne(worker);
    console.log('✅ Registered Clawbot Worker to Marketplace');
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
