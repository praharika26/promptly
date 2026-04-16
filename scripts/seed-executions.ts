import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'promptly';

const SEED_EXECUTIONS = [
  {
    agentAppId: '758825158', // AgentRegistry
    callerAddress: 'anonymous',
    input: 'Audit the Promptly Registry contract for AVM box storage vulnerabilities.',
    output: '[AUDIT REPORT] Analyzed the provided logic for agent 758825158. I\'ve identified 2 potential reentrancy risks and a missing check for account initialization. Recommendation: Use a non-reentrant modifier and verify account state before execution.',
    txId: 'TUCJ3UP2P33LLBSHDCNF3HDNKT6B7E62E2AB5BIWQWBLYSISDUIQ',
    executedAt: new Date(Date.now() - 3600000 * 2),
    status: 'success',
    cost: 10000,
  },
  {
    agentAppId: '758825159', // AgentExecutor
    callerAddress: 'anonymous',
    input: 'Create a viral tweet thread about Algorand x402 payments.',
    output: '[SOCIAL THREAD] 1/5 The future of AI on Algorand is just getting started. 🧵\n2/5 x402 payments are enabling real-time micro-economies where agents pay agents.\n3/5 Promptly is the gateway to this world.\n#Algorand #AI #Web3',
    txId: '5O5XVS5H7N3APENEVWNUDYFJEZKLVOT6EVBXEDLZDGP4WLQKYON',
    executedAt: new Date(Date.now() - 3600000 * 1.5),
    status: 'success',
    cost: 10000,
  },
  {
    agentAppId: '758825169', // AgentReputation
    callerAddress: 'anonymous',
    input: 'Analyze the current market sentiment for ALGO on-chain.',
    output: '[MARKET ANALYSIS] Based on current on-chain metrics, the ecosystem is showing strong accumulation. Agent 758825169 suggests monitoring the liquidity depth at the 0.25 ALGO level for optimal entry.',
    txId: 'SR2Z6MFK4X5XZS3X2V5X2V5X2V5X2V5X2V5X2V5X2V5X2V5X',
    executedAt: new Date(Date.now() - 3600000 * 1),
    status: 'success',
    cost: 10000,
  },
  {
    agentAppId: '758825158',
    callerAddress: 'anonymous',
    input: 'Generate a TypeScript snippet to interact with Promptly agents.',
    output: '[CODE GENERATED] Here is a snippet for your request:\n\nconst agent = new PromptlyAgent("758825158");\nawait agent.execute("Generate a smart contract audit");\n// Success! Check dashboard for results.',
    txId: '3TTZZ3P2P33LLBSHDCNF3HDNKT6B7E62E2AB5BIWQWBLYSISDUIQ',
    executedAt: new Date(Date.now() - 1800000),
    status: 'success',
    cost: 10000,
  },
  {
    agentAppId: '758825159',
    callerAddress: 'anonymous',
    input: 'Check the status of my recent task on the Algorand Testnet.',
    output: 'Hello from Agent 758825159! I have processed your request: "Check the status of my recent task on the Algorand Testnet.". My neural weights suggest a high confidence in the success of this operation. Everything looks ready for the next step on the Algorand blockchain.',
    txId: '2OYUGXVS5H7N3APENEVWNUDYFJEZKLVOT6EVBXEDLZDGP4WLQKYON',
    executedAt: new Date(Date.now() - 600000),
    status: 'success',
    cost: 10000,
  }
];

async function seedExecutions() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('executions');

    // Clear existing executions to avoid duplicates during demo setup
    console.log('Clearing existing executions...');
    await collection.deleteMany({});

    console.log('Seeding executions...');
    const result = await collection.insertMany(SEED_EXECUTIONS);
    console.log(`Successfully seeded ${result.insertedCount} executions!`);

  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.close();
  }
}

seedExecutions();
