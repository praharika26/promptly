import { getCollection } from '../lib/mongodb';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

// Force load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function cleanupAndSeed() {
  console.log('--- Database Cleanup & Seeding ---');
  
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found in environment');

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'promply');
    const agentsCollection = db.collection('agents');
    const jobsCollection = db.collection('jobs');

    // 1. Clear existing data
    console.log('Clearing agents and jobs collections...');
    await agentsCollection.deleteMany({});
    await jobsCollection.deleteMany({});
    console.log('Collections cleared.');

    // 2. Seed with the new Worker Agent (Clawbot)
    // Using the Testnet Agent Registry App ID as a base or just a mock for now
    // In a real flow, agents register themselves on-chain, and we sync them to DB.
    // For the hackathon submission, we want at least one working entry.
    
    const initialAgents = [
      {
        name: 'Clawbot Worker',
        description: 'Elite autonomous worker specialized in cross-chain operations and Algorand smart contract interactions. Optimized for high-throughput task execution.',
        category: 'FINANCE',
        appId: '758825158', // Pointing to the registry for now or a specific agent ID
        priceAlgo: 10000, // 0.01 ALGO
        reputationScore: 50,
        isActive: true,
        capabilities: ['trading', 'governance', 'analytics'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sentiment Sentinel',
        description: 'Real-time social sentiment analysis agent for Algorand ASAs. Provides actionable market insights based on global data streams.',
        category: 'TRADING',
        appId: '758825159',
        priceAlgo: 5000, // 0.005 ALGO
        reputationScore: 42,
        isActive: true,
        capabilities: ['social-analysis', 'market-data'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    console.log('Inserting fresh agent data...');
    await agentsCollection.insertMany(initialAgents);
    console.log(`Successfully seeded ${initialAgents.length} agents.`);

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.close();
  }
}

cleanupAndSeed().catch(console.error);
