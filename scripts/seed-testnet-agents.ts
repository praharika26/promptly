import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const REGISTRY_APP_ID = 758825158;
const CREATOR_ADDRESS = 'BGOQ4KH4RSJIRPOCACFUGECMPFH4KLRJN235LTK5DGSWC4MBSYYKABSBU4';

const agentsToSeed = [
  {
    txId: 'TUCJ3UP2P33LLBSHDCNF3HDNKT6B7E62E2AB5BIWQWBLYSISDUIQ',
    name: 'Promptly Sentinel',
    category: 'SECURITY',
    description: 'Advanced smart contract auditing and vulnerability scanning for Algorand.',
    priceAlgo: 50000000, // 50 ALGO
  },
  {
    txId: '5O5XVS5H7N3APENEVWNUDYFJEZKLVOT6EVBXEDLZDGP4WLQKYONA',
    name: 'Algo Oracle V2',
    category: 'DATA',
    description: 'Real-time on-chain data analysis and market sentiment tracking.',
    priceAlgo: 10000000, // 10 ALGO
  },
  {
    txId: 'SR2Z6M5SSFT33TOX36IJJBEAPEB74Z3SG3FBDDD42UBP6SQXS7JA',
    name: 'NFT Architect',
    category: 'UTILITY',
    description: 'AI-powered asset creation and ARC-69/ARC-19 metadata generation.',
    priceAlgo: 25000000, // 25 ALGO
  },
  {
    txId: '3TTZZ342OTC2ILAD7OKN56JSCSDW3X6OCFV7MXVWJGO2XTYB5XUA',
    name: 'DeFi Strategist',
    category: 'FINANCE',
    description: 'Optimized yield farming strategies and liquidity pool analysis.',
    priceAlgo: 15000000, // 15 ALGO
  },
  {
    txId: '2OYUGXNME7QOGDMARQQI3JGXSKI6GLZGPBTIVYBIZQ6UADHQPP5A',
    name: 'NFD Scout',
    category: 'SEARCH',
    description: 'Autonomous NFD domain discovery and valuation engine.',
    priceAlgo: 5000000, // 5 ALGO
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found');

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'promply');
    const collection = db.collection('agents');

    console.log(`Connected to MongoDB. Seeding ${agentsToSeed.length} agents...`);

    for (const agentData of agentsToSeed) {
      const agentDoc = {
        appId: REGISTRY_APP_ID,
        algorandAddress: CREATOR_ADDRESS,
        name: agentData.name,
        description: agentData.description,
        category: agentData.category,
        priceAlgo: agentData.priceAlgo,
        createdAt: new Date(),
        updatedAt: new Date(),
        onChainRound: 45000000, // Placeholder for testnet round
        txId: agentData.txId,
        reputationScore: 0,
        executionCount: 0,
        isActive: true,
      };

      await collection.updateOne(
        { txId: agentData.txId },
        { $set: agentDoc },
        { upsert: true }
      );
      console.log(`✅ Seeded: ${agentData.name} (${agentData.txId})`);
    }

    console.log('\n--- Seeding Complete ---');
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
