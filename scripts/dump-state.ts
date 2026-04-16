import algosdk from 'algosdk';

async function run() {
    const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
    const ids = [758825158, 758825159, 758825169];
    
    for (const id of ids) {
        console.log(`--- App ${id} ---`);
        try {
            const info = await algod.getApplicationByID(id).do();
            console.log('Global State:', JSON.stringify(info.params['global-state'], null, 2));
        } catch (e) {
            console.error(`Error fetching App ${id}:`, e);
        }
    }
}

run();
