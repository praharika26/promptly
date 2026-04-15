import algosdk from "algosdk";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const ALGOD_URL = "https://testnet-api.algonode.cloud";
const USDC_ID = 10458941;

async function optIn() {
  const client = new algosdk.Algodv2("", ALGOD_URL, "");
  
  // Use AVM_PRIVATE_KEY which corresponds to PAY_TO address
  const sk = new Uint8Array(Buffer.from(process.env.AVM_PRIVATE_KEY!, "base64"));
  const address = algosdk.encodeAddress(sk.slice(32));
  
  console.log(`Opting in address: ${address}`);
  console.log(`Asset: USDC (${USDC_ID})`);

  // Check if already opted in
  try {
    const info = await client.accountAssetInformation(address, USDC_ID).do();
    console.log("Already opted in! Balance:", info['asset-holding']?.amount ?? 0);
    return;
  } catch {
    console.log("Not opted in yet. Sending opt-in transaction...");
  }

  const params = await client.getTransactionParams().do();
  
  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    sender: address,
    receiver: address,
    assetIndex: USDC_ID,
    amount: 0,
    suggestedParams: params,
  });

  const signedTxn = txn.signTxn(sk);
  const result = await client.sendRawTransaction(signedTxn).do();
  
  console.log(`Opt-in transaction sent! TxID: ${result.txId}`);
  console.log("Waiting for confirmation...");
  
  await algosdk.waitForConfirmation(client, result.txId, 4);
  console.log("SUCCESS: PAY_TO address is now opted into USDC!");
}

optIn().catch(err => console.error("Failed:", err.message));
