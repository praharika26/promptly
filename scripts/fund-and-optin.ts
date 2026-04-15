import algosdk from "algosdk";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const ALGOD_URL = "https://testnet-api.algonode.cloud";
const USDC_ID = 10458941;

async function fundAndOptIn() {
  const client = new algosdk.Algodv2("", ALGOD_URL, "");
  
  const funder = algosdk.mnemonicToSecretKey(process.env.TESTNET_FACILITATOR_MNEMONIC!);
  const payToSk = new Uint8Array(Buffer.from(process.env.AVM_PRIVATE_KEY!, "base64"));
  const payToAddress = algosdk.encodeAddress(payToSk.slice(32));
  
  console.log("Funder:", funder.addr.toString());
  console.log("PAY_TO:", payToAddress.toString());

  // Step 1: Fund PAY_TO with 1 ALGO
  console.log("\n--- Step 1: Funding PAY_TO with 1 ALGO ---");
  let params = await client.getTransactionParams().do();
  
  const fundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: funder.addr,
    receiver: payToAddress,
    amount: 1_000_000,
    suggestedParams: params,
  });
  
  const signedFund = fundTxn.signTxn(funder.sk);
  await client.sendRawTransaction(signedFund).do();
  const txId1 = fundTxn.txID();
  console.log("Fund txn ID:", txId1);
  await algosdk.waitForConfirmation(client, txId1, 10);
  console.log("PAY_TO funded!");

  // Step 2: Opt-in PAY_TO to USDC
  console.log("\n--- Step 2: Opting PAY_TO into USDC ---");
  params = await client.getTransactionParams().do();
  
  const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    sender: payToAddress,
    receiver: payToAddress,
    assetIndex: USDC_ID,
    amount: 0,
    suggestedParams: params,
  });
  
  const signedOptIn = optInTxn.signTxn(payToSk);
  await client.sendRawTransaction(signedOptIn).do();
  const txId2 = optInTxn.txID();
  console.log("Opt-in txn ID:", txId2);
  await algosdk.waitForConfirmation(client, txId2, 10);
  console.log("PAY_TO opted into USDC!");

  // Verify
  console.log("\n--- Done! ---");
  const info = await client.accountInformation(payToAddress).do();
  console.log("PAY_TO ALGO:", Number(info.amount) / 1_000_000);
}

fundAndOptIn().catch(err => console.error("Failed:", err.message));
