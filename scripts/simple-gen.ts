import algosdk from 'algosdk';

async function run() {
    const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
    const mnemonic = "toy inherit clever cave skirt alcohol flight muscle congress viable label aim great cycle easily palace blame crash endless marble pause category tissue absent one";
    const account = algosdk.mnemonicToSecretKey(mnemonic);
    const signer = algosdk.makeBasicAccountTransactionSigner(account);

    const REGISTRY_APP_ID = 758825158;
    const EXECUTOR_APP_ID = 758825159;
    const REPUTATION_APP_ID = 758825169;

    const execAddr = algosdk.getApplicationAddress(EXECUTOR_APP_ID).toString();
    const repAddr = algosdk.getApplicationAddress(REPUTATION_APP_ID).toString();

    console.log(`Using account: ${account.addr}`);

    const transactions: any[] = [];

    // 2. AgentExecutor - invokeAgent
    console.log('\n--- Interacting with AgentExecutor ---');
    for (let i = 1; i <= 5; i++) {
        const agentId = BigInt(i);
        const inputHash = new Uint8Array(32).fill(i);
        const note = `Execution ${i} for Hackathon`;
        console.log(`Invoking Agent ${i}...`);

        const atc = new algosdk.AtomicTransactionComposer();
        const sp = await algod.getTransactionParams().do();
        
        atc.addTransaction({
            txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                sender: account.addr,
                receiver: execAddr,
                amount: 500000,
                suggestedParams: sp,
            }),
            signer: signer,
        });

        atc.addMethodCall({
            appID: EXECUTOR_APP_ID,
            method: new algosdk.ABIMethod({ 
                name: 'invokeAgent', 
                args: [
                    { type: 'uint64', name: 'agentId' }, 
                    { type: 'byte[]', name: 'inputHash' }, 
                    { type: 'string', name: 'callerNote' }
                ], 
                returns: { type: 'uint64' } 
            }),
            methodArgs: [agentId, inputHash, note],
            sender: account.addr,
            signer: signer,
            suggestedParams: sp,
            boxes: [{ appIndex: EXECUTOR_APP_ID, name: new Uint8Array([0x65, 0x78, ...algosdk.encodeUint64(0n)]) }], 
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
                sender: account.addr,
                receiver: repAddr,
                amount: 500000,
                suggestedParams: sp,
            }),
            signer: signer,
        });

        atc.addMethodCall({
            appID: REPUTATION_APP_ID,
            method: new algosdk.ABIMethod({ name: 'incrementReputation', args: [{ type: 'uint64', name: 'agentId' }], returns: { type: 'void' } }),
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

run().catch(console.error);
