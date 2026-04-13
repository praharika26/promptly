import algosdk from 'algosdk';

const ALGOD_HOST = process.env.NEXT_PUBLIC_ALGOD_HOST ?? 'http://localhost:4001';
const ALGOD_TOKEN = process.env.NEXT_PUBLIC_ALGOD_TOKEN ?? '';
const ALGOD_PORT = 4001;

const INDEXER_HOST = process.env.NEXT_PUBLIC_INDEXER_HOST ?? 'http://localhost:8980';
const INDEXER_TOKEN = process.env.NEXT_PUBLIC_INDEXER_TOKEN ?? '';
const INDEXER_PORT = 8980;

let algodInstance: algosdk.Algodv2 | null = null;
let indexerInstance: algosdk.Indexer | null = null;

export function getAlgodClient(): algosdk.Algodv2 {
  if (!algodInstance) {
    algodInstance = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_HOST, ALGOD_PORT);
  }
  return algodInstance;
}

export function getIndexerClient(): algosdk.Indexer {
  if (!indexerInstance) {
    indexerInstance = new algosdk.Indexer(INDEXER_TOKEN, INDEXER_HOST, INDEXER_PORT);
  }
  return indexerInstance;
}

export const CONTRACT_IDS = {
  agentRegistry: Number(process.env.NEXT_PUBLIC_AGENT_REGISTRY_APP_ID ?? 2578),
  agentExecutor: Number(process.env.NEXT_PUBLIC_AGENT_EXECUTOR_APP_ID ?? 2579),
  agentReputation: Number(process.env.NEXT_PUBLIC_AGENT_REPUTATION_APP_ID ?? 2580),
  helloWorld: Number(process.env.NEXT_PUBLIC_HELLO_WORLD_APP_ID ?? 2575),
} as const;

export async function getAppGlobalState(appId: number): Promise<Record<string, unknown>> {
  const algod = getAlgodClient();
  const appInfo = await algod.getApplicationByID(appId).do();
  const state: Record<string, unknown> = {};

  for (const kv of appInfo.params['global-state'] ?? []) {
    const key = Buffer.from(kv.key, 'base64').toString('utf8');
    const val = kv.value;
    state[key] = val.type === 1
      ? Buffer.from(val.bytes, 'base64').toString('utf8')
      : val.uint;
  }

  return state;
}

export async function healthCheck(): Promise<boolean> {
  try {
    const algod = getAlgodClient();
    await algod.healthCheck().do();
    return true;
  } catch {
    return false;
  }
}
