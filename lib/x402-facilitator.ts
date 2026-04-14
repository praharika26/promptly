import algosdk from "algosdk";
import type { FacilitatorAvmSigner } from "@x402-avm/avm";
import { x402Facilitator } from "@x402-avm/core/facilitator";
import { registerExactAvmScheme } from "@x402-avm/avm/exact/facilitator";
import { ALGORAND_TESTNET_CAIP2, ALGORAND_MAINNET_CAIP2 } from "@x402-avm/avm";

export const ALGORAND_LOCALNET_CAIP2 = "algorand:localnet-test";
export { ALGORAND_TESTNET_CAIP2, ALGORAND_MAINNET_CAIP2 };

function getKeyFromMnemonic(mnemonic: string): { sk: Buffer; address: string } {
  const key = algosdk.mnemonicToSecretKey(mnemonic);
  return {
    sk: Buffer.from(key.sk),
    address: algosdk.encodeAddress(key.sk.slice(32))
  };
}

// Get testnet facilitator key from mnemonic
const TESTNET_MNEMONIC = process.env.TESTNET_FACILITATOR_MNEMONIC || "";
let testnetKey = { sk: Buffer.alloc(64), address: "" };

if (TESTNET_MNEMONIC) {
  testnetKey = getKeyFromMnemonic(TESTNET_MNEMONIC);
  console.log("[Facilitator] Testnet address:", testnetKey.address);
} else {
  console.warn("[Facilitator] WARNING: TESTNET_FACILITATOR_MNEMONIC not set!");
}

const localnetSecretKey = Buffer.from(process.env.AVM_PRIVATE_KEY || "", "base64");
const localnetAddress = algosdk.encodeAddress(localnetSecretKey.slice(32));

const localnetAlgodClient = new algosdk.Algodv2(
  "a".repeat(64),
  "http://localhost",
  "4001"
);

const testnetAlgodClient = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  ""
);

const mainnetAlgodClient = new algosdk.Algodv2(
  "",
  "https://mainnet-api.algonode.cloud",
  ""
);

function getAlgodClientForNetwork(network: string): algosdk.Algodv2 {
  if (network.includes("testnet")) {
    return testnetAlgodClient;
  }
  if (network.includes("mainnet") || !network.includes("/")) {
    return mainnetAlgodClient;
  }
  return localnetAlgodClient;
}

function getSignerForNetwork(network: string) {
  if (network.includes("testnet")) {
    return testnetKey;
  }
  if (network.includes("mainnet") || !network.includes("/")) {
    return testnetKey;
  }
  return { sk: localnetSecretKey, addr: localnetAddress };
}

const facilitatorSigner: FacilitatorAvmSigner = {
  getAddresses: () => {
    const addresses = [testnetKey.address];
    if (localnetAddress.length === 58) {
      addresses.push(localnetAddress);
    }
    return addresses;
  },

  signTransaction: async (txn: Uint8Array, senderAddress: string) => {
    const decoded = algosdk.decodeUnsignedTransaction(txn);
    const signer = getSignerForNetwork(senderAddress);
    if (signer.sk.length !== 64) {
      throw new Error("Invalid signer key");
    }
    const signed = algosdk.signTransaction(decoded, signer.sk);
    return signed.blob;
  },

  getAlgodClient: (network: string) => {
    console.log(`[Facilitator] getAlgodClient called for: ${network}`);
    return getAlgodClientForNetwork(network);
  },

  simulateTransactions: async (txns: Uint8Array[], network: string) => {
    console.log(`[Facilitator] simulateTransactions for: ${network}`);
    const client = getAlgodClientForNetwork(network);
    const stxns = txns.map((txnBytes) => {
      try {
        return algosdk.decodeSignedTransaction(txnBytes);
      } catch {
        const txn = algosdk.decodeUnsignedTransaction(txnBytes);
        return new algosdk.SignedTransaction({ txn });
      }
    });

    const request = new algosdk.modelsv2.SimulateRequest({
      txnGroups: [
        new algosdk.modelsv2.SimulateRequestTransactionGroup({ txns: stxns }),
      ],
      allowEmptySignatures: true,
    });
    
    return client.simulateTransactions(request).do();
  },

  sendTransactions: async (signedTxns: Uint8Array[], network: string) => {
    console.log(`[Facilitator] sendTransactions for: ${network}`);
    const client = getAlgodClientForNetwork(network);
    const combined = Buffer.concat(signedTxns.map((t) => Buffer.from(t)));
    const { txId } = await client.sendRawTransaction(combined).do();
    return txId;
  },

  waitForConfirmation: async (txId: string, network: string, waitRounds = 4) => {
    console.log(`[Facilitator] waitForConfirmation for: ${network}`);
    const client = getAlgodClientForNetwork(network);
    return algosdk.waitForConfirmation(client, txId, waitRounds);
  },
};

export const facilitator = new x402Facilitator();

facilitator.onBeforeVerify((ctx) => console.log(`[Facilitator] onBeforeVerify (ID: ${ctx.requirements.network})`));
facilitator.onAfterVerify((res) => console.log("[Facilitator] onAfterVerify", res));
facilitator.onVerifyFailure((err) => console.error("[Facilitator] onVerifyFailure", err));
facilitator.onBeforeSettle(() => console.log("[Facilitator] onBeforeSettle"));
facilitator.onAfterSettle((res) => console.log("[Facilitator] onAfterSettle", res));
facilitator.onSettleFailure((err) => console.error("[Facilitator] onSettleFailure", err));

registerExactAvmScheme(facilitator, {
  signer: facilitatorSigner,
  networks: [ALGORAND_LOCALNET_CAIP2, ALGORAND_TESTNET_CAIP2, ALGORAND_MAINNET_CAIP2],
});
