import { connectToDatabase } from './mongodb';

export async function ensureIndexes() {
  const { db } = await connectToDatabase();

  // Agents collection
  await db.collection('agents').createIndexes([
    { key: { appId: 1 }, unique: true },
    { key: { algorandAddress: 1 } },
    { key: { category: 1 } },
    { key: { reputationScore: -1 } },
    { key: { createdAt: -1 } },
  ]);

  // Executions collection
  await db.collection('executions').createIndexes([
    { key: { txId: 1 }, unique: true },
    { key: { agentAppId: 1 } },
    { key: { callerAddress: 1 } },
    { key: { executedAt: -1 } },
  ]);

  // Reputations collection
  await db.collection('reputations').createIndexes([
    { key: { agentAppId: 1, raterAddress: 1 }, unique: true },
    { key: { agentAppId: 1 } },
  ]);

  // Users collection
  await db.collection('users').createIndexes([
    { key: { algorandAddress: 1 }, unique: true },
  ]);

  console.log('[MongoDB] All indexes ensured');
}
