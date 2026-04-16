import algosdk from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const REGISTRY_APP_ID = Number(process.env.NEXT_PUBLIC_AGENT_REGISTRY_APP_ID);
const EXECUTOR_APP_ID = Number(process.env.NEXT_PUBLIC_AGENT_EXECUTOR_APP_ID);
const REPUTATION_APP_ID = Number(process.env.NEXT_PUBLIC_AGENT_REPUTATION_APP_ID);

async function run() {
    const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
    const mnemonic = process.env.TESTNET_FACILITATOR_MNEMONIC!;
    const account = algosdk.mnemonicToSecretKey(mnemonic);
    const signer = algosdk.makeBasicAccountTransactionSigner(account);

    const regAddr = algosdk.getApplicationAddress(REGISTRY_APP_ID).toString();
    const execAddr = algosdk.getApplicationAddress(EXECUTOR_APP_ID).toString();
    const repAddr = algosdk.getApplicationAddress(REPUTATION_APP_ID).toString();

    console.log(`Using account: ${account.addr}`);

    const transactions: any[] = [];

    // 1. AgentRegistry - registerAgent
    console.log('\n--- Interacting with AgentRegistry ---');
    for (let i = 1; i <= 5; i++) {
        const metadata = `ipfs://QmCheckThisOutAgent${i}${Date.now()}`;
        console.log(`Registering Agent ${i}...`);
        
        const atc = new algosdk.AtomicTransactionComposer();
        const sp = await algod.getTransactionParams().do();
        
        let nextId = await getGlobalState(REGISTRY_APP_ID, 'nextAgentId', algod);
        if (nextId === 0n) nextId = BigInt(i); 

        const boxName = new Uint8Array([0x61, 0x67, ...algosdk.encodeUint64(nextId)]);

        atc.addTransaction({
            txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: account.addr,
                to: regAddr,
                amount: 500000, 
                suggestedParams: sp,
            }),
            signer: signer,
        });

        atc.addMethodCall({
            appID: REGISTRY_APP_ID,
            method: getMethodByName('registerAgent', REGISTRY_APP_ID),
            methodArgs: [metadata],
            sender: account.addr,
            signer: signer,
            suggestedParams: sp,
            boxes: [{ appIndex: REGISTRY_APP_ID, name: boxName }],
        });

        const result = await atc.execute(algod, 4);
        console.log(`✅ Tx IDs: ${result.txIDs.join(', ')}`);
        transactions.push({ contract: 'AgentRegistry', method: 'registerAgent', txId: result.txIDs[1] });
    }

    // 2. AgentExecutor - invokeAgent
    console.log('\n--- Interacting with AgentExecutor ---');
    for (let i = 1; i <= 5; i++) {
        const agentId = BigInt(i);
        const inputHash = new Uint8Array(32).fill(i);
        const note = `Execution ${i} for Hackathon`;
        console.log(`Invoking Agent ${i}...`);

        const atc = new algosdk.AtomicTransactionComposer();
        const sp = await algod.getTransactionParams().do();
        const boxName = new Uint8Array([0x65, 0x78, ...algosdk.encodeUint64(agentId)]); 

        atc.addTransaction({
            txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: account.addr,
                to: execAddr,
                amount: 500000,
                suggestedParams: sp,
            }),
            signer: signer,
        });

        atc.addMethodCall({
            appID: EXECUTOR_APP_ID,
            method: getMethodByName('invokeAgent', EXECUTOR_APP_ID),
            methodArgs: [agentId, inputHash, note],
            sender: account.addr,
            signer: signer,
            suggestedParams: sp,
            boxes: [{ appIndex: EXECUTOR_APP_ID, name: boxName }],
        });

        const result = await atc.execute(algod, 4);
        console.log(`✅ Tx IDs: ${result.txIDs.join(', ')}`);
        transactions.push({ contract: 'AgentExecutor', method: 'invokeAgent', txId: result.txIDs[1] });
    }

    // 3. AgentReputation - incrementReputation
    console.log('\n--- Interacting with AgentReputation ---');
    for (let i = 1; i <= 5; i++) {
        const agentId = BigInt(i);
        console.log(`Incrementing Reputation for Agent ${i}...`);

        const atc = new algosdk.AtomicTransactionComposer();
        const sp = await algod.getTransactionParams().do();
        const boxName = new Uint8Array([0x72, 0x65, ...algosdk.encodeUint64(agentId)]);

        atc.addTransaction({
            txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: account.addr,
                to: repAddr,
                amount: 500000,
                suggestedParams: sp,
            }),
            signer: signer,
        });

        atc.addMethodCall({
            appID: REPUTATION_APP_ID,
            method: getMethodByName('incrementReputation', REPUTATION_APP_ID),
            methodArgs: [agentId],
            sender: account.addr,
            signer: signer,
            suggestedParams: sp,
            boxes: [{ appIndex: REPUTATION_APP_ID, name: boxName }],
        });

        const result = await atc.execute(algod, 4);
        console.log(`✅ Tx IDs: ${result.txIDs.join(', ')}`);
        transactions.push({ contract: 'AgentReputation', method: 'incrementReputation', txId: result.txIDs[1] });
    }

    console.log('\n--- Summary of Transactions ---');
    console.table(transactions);
}

function getMethodByName(name: string, appId: number) {
    const methods: any = {
        [REGISTRY_APP_ID]: [
            new algosdk.ABIMethod({ name: 'registerAgent', args: [{ type: 'string', name: 'metadataURI' }], returns: { type: 'uint64' } })
        ],
        [EXECUTOR_APP_ID]: [
            new algosdk.ABIMethod({ name: 'invokeAgent', args: [{ type: 'uint64', name: 'agentId' }, { type: 'byte[32]', name: 'inputHash' }, { type: 'string', name: 'callerNote' }], returns: { type: 'uint64' } })
        ],
        [REPUTATION_APP_ID]: [
            new algosdk.ABIMethod({ name: 'incrementReputation', args: [{ type: 'uint64', name: 'agentId' }], returns: { type: 'void' } })
        ]
    };
    const method = methods[appId]?.find((m: any) => m.name === name);
    if (!method) throw new Error(`Method ${name} not found for App ${appId}`);
    return method;
}

async function getGlobalState(appId: number, key: string, algod: algosdk.Algodv2) {
    try {
        const info = await algod.getApplicationByID(appId).do();
        const state = info.params['global-state'];
        if (!state) return 0n;
        const keyBase64 = Buffer.from(key).toString('base64');
        const item = state.find((s: any) => s.key === keyBase64);
        if (!item) return 0n;
        return BigInt(item.value.uint);
    } catch (e) {
        return 0n;
    }
}

run().catch(console.error);
