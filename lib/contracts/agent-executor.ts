import algosdk from 'algosdk';
import { getAlgodClient, getIndexerClient, CONTRACT_IDS } from '../algorand';
import { getCollection } from '../mongodb';
import type { ExecutionDocument } from '../db-schema';

const APP_ID = CONTRACT_IDS.agentExecutor;

export async function getExecutionHistory(agentAppId?: number): Promise<ExecutionDocument[]> {
  const collection = await getCollection('executions');
  const query = agentAppId ? { agentAppId } : {};
  return collection.find(query)
    .sort({ executedAt: -1 })
    .limit(50)
    .toArray() as unknown as ExecutionDocument[];
}

export async function syncExecutionsToMongo(): Promise<number> {
  const indexer = getIndexerClient();
  const collection = await getCollection('executions');

  const txns = await indexer
    .searchForTransactions()
    .applicationID(APP_ID)
    .do();

  let synced = 0;
  for (const txn of txns.transactions ?? []) {
    const doc: ExecutionDocument = {
      appId: APP_ID,
      agentAppId: CONTRACT_IDS.agentRegistry,
      callerAddress: txn.sender,
      inputHash: '',
      outputHash: '',
      txId: txn.id!,
      round: txn['confirmed-round']!,
      executedAt: new Date(txn['round-time']! * 1000),
      status: 'success',
      cost: txn.fee ?? 1000,
    };

    await collection.updateOne(
      { txId: doc.txId },
      { $set: doc },
      { upsert: true }
    );
    synced++;
  }

  console.log(`[AgentExecutor] Synced ${synced} executions to MongoDB`);
  return synced;
}

export async function getExecutorAppInfo() {
  const algod = getAlgodClient();
  return algod.getApplicationByID(APP_ID).do();
}
