import { getAlgodClient, getIndexerClient, CONTRACT_IDS } from '../algorand';
import { getCollection } from '../mongodb';
import type { ReputationDocument } from '../db-schema';

const APP_ID = CONTRACT_IDS.agentReputation;

export async function getReputationForAgent(agentAppId: number): Promise<number> {
  const collection = await getCollection('reputations');
  const docs = await collection.find({ agentAppId }).toArray();

  if (docs.length === 0) return 0;

  const avg = docs.reduce((sum, d) => sum + (d as unknown as ReputationDocument).score, 0) / docs.length;
  return Math.round(avg * 10) / 10;
}

export async function syncReputationsToMongo(): Promise<number> {
  const indexer = getIndexerClient();
  const collection = await getCollection('reputations');

  const txns = await indexer
    .searchForTransactions()
    .applicationID(APP_ID)
    .do();

  let synced = 0;
  for (const txn of txns.transactions ?? []) {
    const doc: ReputationDocument = {
      agentAppId: CONTRACT_IDS.agentRegistry,
      raterAddress: txn.sender,
      score: 5,
      txId: txn.id!,
      round: txn['confirmed-round']!,
      ratedAt: new Date(txn['round-time']! * 1000),
    };

    await collection.updateOne(
      { txId: doc.txId },
      { $set: doc },
      { upsert: true }
    );
    synced++;
  }

  return synced;
}

export async function getReputationAppInfo() {
  const algod = getAlgodClient();
  return algod.getApplicationByID(APP_ID).do();
}
