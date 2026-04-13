import algosdk from "algosdk";
import type { FacilitatorAvmSigner } from "@x402-avm/avm";
import { x402Facilitator } from "@x402-avm/core/facilitator";
import { registerExactAvmScheme } from "@x402-avm/avm/exact/facilitator";

// AVM Network (LocalNet CAIP-2)
export const ALGORAND_LOCALNET_CAIP2 = "algorand:/gUcgn0fBwrVK9UfXytu8/2iFm3oTkSBsxcJa0+fG4E=";

const secretKey = Buffer.from(process.env.AVM_PRIVATE_KEY!, "base64");
const address = algosdk.encodeAddress(secretKey.slice(32));
const algodClient = new algosdk.Algodv2(
  "a".repeat(64),
  "http://localhost",
  "4001"
);

const facilitatorSigner: FacilitatorAvmSigner = {
  getAddresses: () => [address],

  signTransaction: async (txn: Uint8Array, senderAddress: string) => {
    const decoded = algosdk.decodeUnsignedTransaction(txn);
    const signed = algosdk.signTransaction(decoded, secretKey);
    return signed.blob;
  },

  getAlgodClient: (network: string) => algodClient,

  simulateTransactions: async (txns: Uint8Array[], network: string) => {
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
    
    return algodClient.simulateTransactions(request).do();
  },

  sendTransactions: async (signedTxns: Uint8Array[], network: string) => {
    const combined = Buffer.concat(signedTxns.map((t) => Buffer.from(t)));
    const { txId } = await algodClient.sendRawTransaction(combined).do();
    return txId;
  },

  waitForConfirmation: async (txId: string, network: string, waitRounds = 4) => {
    return algosdk.waitForConfirmation(algodClient, txId, waitRounds);
  },
};

export const facilitator = new x402Facilitator();

registerExactAvmScheme(facilitator, {
  signer: facilitatorSigner,
  networks: [ALGORAND_LOCALNET_CAIP2],
});
