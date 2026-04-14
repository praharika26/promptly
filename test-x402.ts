import { wrapFetchWithPaymentFromConfig } from "@x402-avm/fetch";
import { ExactAvmScheme, createAlgodClient } from "@x402-avm/avm";
import type { ClientAvmSigner } from "@x402-avm/avm";
import algosdk from "algosdk";
import assert from "assert";

// VERIFIED LocalNet Genesis Hash CAIP-2
const ALGORAND_LOCALNET_CAIP2 = "algorand:/gUcgn0fBwrVK9UfXytu8/2iFm3oTkSBsxcJa0+fG4E=";
const API_URL = "http://localhost:3000/api/execute";

async function main() {
  console.log("🚀 Initializing x402 End-to-End Test...");
  
  const kmd = new algosdk.Kmd("a".repeat(64), "http://localhost", 4002);
  const localAlgodClient = createAlgodClient(ALGORAND_LOCALNET_CAIP2, "http://localhost:4001", "a".repeat(64));
  
  console.log("   - Fetching KMD Wallets...");
  const wallets = (await kmd.listWallets()).wallets;
  if (!wallets || wallets.length < 2) throw new Error("Need multiple wallets for testing");
  
  const walletId = wallets[1].id;
  const handle = (await kmd.initWalletHandle(walletId, "")).wallet_handle_token;
  const addresses = (await kmd.listKeys(handle)).addresses;
  const payerAddress = addresses[0];
  const payerPrivKey = (await kmd.exportKey(handle, "", payerAddress)).private_key;
  
  console.log(`   - Payer Address: ${payerAddress}`);

  const clientSigner: ClientAvmSigner = {
    address: payerAddress,
    signTransactions: async (txns: Uint8Array[], indexesToSign?: number[]) => {
      console.log(`[Test Client] Signing ${txns.length} transactions for verified LocalNet...`);
      return txns.map((txn, i) => {
        if (indexesToSign && !indexesToSign.includes(i)) return null;
        const decoded = algosdk.decodeUnsignedTransaction(txn);
        return algosdk.signTransaction(decoded, Buffer.from(payerPrivKey)).blob;
      });
    },
  };

  console.log("   - Wrapping Fetch with x402 Payment (Forced LocalNode + Verified Hash)...");
  const fetchWithPayment = wrapFetchWithPaymentFromConfig(globalThis.fetch as any, {
    schemes: [
      { 
        network: ALGORAND_LOCALNET_CAIP2, 
        client: new ExactAvmScheme(clientSigner, {
          algodClient: localAlgodClient as any
        }) 
      }
    ]
  });

  console.log("\n📡 Sending Request to /api/execute...");
  const promptText = "Hello AI! Are you there?";
  const agentId = "2578";

  try {
    const res = await fetchWithPayment(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, prompt: promptText }),
    });

    const text = await res.text();
    console.log(`\n✅ HTTP Status: ${res.status}`);
    console.log(`✅ Response Raw: ${text}`);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: "Non-JSON response" };
    }
    
    assert(res.status === 200, "Expected a successful 200 OK after automatic payment");
    assert(data.result, "Expected to receive an execution result from the LLM endpoint");
    
    console.log("\n🎉 TEST PASSED! The x402 payment was automatically negotiated and verified.");
  } catch (err) {
    console.error("\n❌ TEST FAILED:", err);
    process.exit(1);
  }
}

main();
