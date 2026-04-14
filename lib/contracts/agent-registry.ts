import algosdk from 'algosdk';
import { getAlgodClient, getIndexerClient, CONTRACT_IDS } from '../algorand';
import { getCollection } from '../mongodb';
import type { AgentDocument } from '../db-schema';

const APP_ID = CONTRACT_IDS.agentRegistry;

// Read all registered agents from on-chain global state + indexer
export async function getAllAgentsOnChain(): Promise<AgentDocument[]> {
  const indexer = getIndexerClient();

  try {
    // Query indexer for all transactions to this app
    const txns = await indexer
      .searchForTransactions()
      .applicationID(APP_ID)
      .do();

    if (txns.transactions?.length > 0) {
      console.log(`[AgentRegistry] First transaction keys: ${Object.keys(txns.transactions[0]).join(', ')}`);
      console.log(`[AgentRegistry] App Txn keys: ${Object.keys(txns.transactions[0]['application-transaction'] || {}).join(', ')}`);
    }

    console.log(`[AgentRegistry] Found ${txns.transactions?.length ?? 0} transactions`);

    // Parse agent registrations from transactions
    const agents: AgentDocument[] = [];
    for (const txn of txns.transactions ?? []) {
      const appTxn = (txn as any).applicationTransaction;
      if (appTxn && appTxn.onCompletion === 'noop') {
        let name = 'Agent';
        let description = 'Autonomous Agent';
        let category = 'general';
        let priceAlgo = 1000;

        // Try to parse metadata from Note
        if (txn.note) {
          try {
            const decodedNote = Buffer.from(txn.note, 'base64').toString();
            const metadata = JSON.parse(decodedNote);
            name = metadata.name || name;
            description = metadata.description || description;
            category = metadata.category || category;
            priceAlgo = metadata.priceAlgo || priceAlgo;
          } catch (e) {
            // Not a valid JSON note, ignore
          }
        }

        agents.push({
          appId: APP_ID,
          algorandAddress: txn.sender,
          name,
          description,
          category,
          priceAlgo,
          createdAt: new Date((txn as any).roundTime * 1000),
          updatedAt: new Date(),
          onChainRound: (txn as any).confirmedRound,
          txId: txn.id!,
          reputationScore: 0,
          executionCount: 0,
          isActive: true,
        });
      }
    }

    return agents;
  } catch (err) {
    console.error('[AgentRegistry] Error fetching agents:', err);
    throw err;
  }
}

// Read agents from MongoDB (cached/indexed from chain)
export async function getAllAgentsCached(): Promise<AgentDocument[]> {
  const collection = await getCollection('agents');
  return collection.find({ isActive: true })
    .sort({ createdAt: -1 })
    .toArray() as unknown as AgentDocument[];
}

// Get single agent by App ID from MongoDB
export async function getAgentByAppId(agentAppId: number): Promise<AgentDocument | null> {
  const collection = await getCollection('agents');
  return collection.findOne({ appId: agentAppId }) as unknown as AgentDocument | null;
}

// Sync on-chain state → MongoDB
export async function syncAgentsToMongo(): Promise<number> {
  const agents = await getAllAgentsOnChain();
  const collection = await getCollection('agents');
  let synced = 0;

  for (const agent of agents) {
    await collection.updateOne(
      { appId: agent.appId, txId: agent.txId },
      { $set: agent },
      { upsert: true }
    );
    synced++;
  }

  console.log(`[AgentRegistry] Synced ${synced} agents to MongoDB`);
  return synced;
}

// Get app info directly from algod
export async function getRegistryAppInfo() {
  const algod = getAlgodClient();
  return algod.getApplicationByID(APP_ID).do();
}
