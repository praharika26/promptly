import { facilitator, facilitatorSigner } from "../lib/x402-facilitator";
import { ALGORAND_TESTNET_CAIP2 } from "@x402-avm/avm";
import algosdk from "algosdk";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testFacilitator() {
  console.log("Testing Facilitator Logic...");

  // 1. Test Address Lookup
  const addresses = facilitatorSigner.getAddresses();
  console.log("Facilitator Addresses:", addresses);
  
  if (addresses.length === 0) {
    console.error("No facilitator addresses found! Check your mnemonics.");
    return;
  }

  const testAddr = addresses[0];
  console.log(`Testing signer for: ${testAddr}`);

  try {
    // We can't easily test signTransaction without a real transaction, 
    // but we can check if it throws "No signer for address"
    // Mock a simple transaction
    const params = await facilitatorSigner.getAlgodClient(ALGORAND_TESTNET_CAIP2).getTransactionParams().do();
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: testAddr,
      receiver: testAddr,
      amount: 0,
      suggestedParams: params
    });

    const signed = await facilitatorSigner.signTransaction(txn.toByte(), testAddr);
    console.log("Successfully signed mock transaction!");
  } catch (err: any) {
    console.error("Signer lookup FAILED:", err.message);
  }

  // 2. Test Algod Client Routing
  try {
    const client = facilitatorSigner.getAlgodClient(ALGORAND_TESTNET_CAIP2);
    const status = await client.status().do();
    console.log("Successfully routed to Testnet Algod! Last Round:", status['last-round']);
  } catch (err: any) {
    console.error("Algod routing FAILED:", err.message);
  }
}

testFacilitator();
