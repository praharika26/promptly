import { connectToDatabase } from '../lib/mongodb';
import { ensureIndexes } from '../lib/db-indexes';

async function main() {
  console.log('Testing MongoDB connection...');
  
  try {
    const { db } = await connectToDatabase();
    console.log('✅ MongoDB connected successfully');
    
    await ensureIndexes();
    console.log('✅ Indexes created');
    
    // Insert a test document
    const agents = db.collection('agents');
    const testDoc = {
      appId: 9999,
      algorandAddress: 'TEST_ADDRESS',
      name: 'Test Agent',
      description: 'Connection test',
      category: 'test',
      priceAlgo: 1000000,
      createdAt: new Date(),
      updatedAt: new Date(),
      onChainRound: 0,
      txId: 'TEST_TX',
      reputationScore: 0,
      executionCount: 0,
      isActive: false,
    };
    
    await agents.insertOne(testDoc);
    console.log('✅ Test document inserted');
    
    const found = await agents.findOne({ appId: 9999 });
    console.log('✅ Test document retrieved:', found?.name);
    
    await agents.deleteOne({ appId: 9999 });
    console.log('✅ Test document cleaned up');
    
    console.log('\n✅ MongoDB fully operational');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
}

main();
