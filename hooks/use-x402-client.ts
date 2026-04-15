"use client";

import { useMemo } from "react";
import { useWallet } from "@txnlab/use-wallet-react";
import type { ClientAvmSigner } from "@x402-avm/avm";
import { ExactAvmScheme, createAlgodClient } from "@x402-avm/avm";
import { x402Client, wrapFetchWithPayment, wrapFetchWithPaymentFromConfig } from "@x402-avm/fetch";
import { registerExactAvmScheme } from "@x402-avm/avm/exact/client";

const ALGORAND_TESTNET_CAIP2 = "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=";
const ALGOD_URL = "https://testnet-api.algonode.cloud";

export function useAvmSigner(): ClientAvmSigner | null {
  const { activeAccount, signTransactions } = useWallet();

  if (!activeAccount) {
    console.log('[x402] No active account connected');
    return null;
  }

  console.log('[x402] Creating signer for address:', activeAccount.address);

  return {
    address: activeAccount.address,
    signTransactions: async (txns: Uint8Array[], indexesToSign?: number[]) => {
      console.log('[x402] signTransactions called:', {
        txnsCount: txns.length,
        indexesToSign: indexesToSign?.join(',') || 'all'
      });
      // Key: Must pass indexesToSign to wallet for correct signing
      const signed = await signTransactions(txns, indexesToSign);
      console.log('[x402] Signed txns returned:', signed.filter(Boolean).length);
      return signed;
    },
  };
}

export function useX402Fetch() {
  const signer = useAvmSigner();

  const fetchWithPayment = useMemo(() => {
    if (!signer) {
      console.log('[x402] No signer, returning raw fetch');
      return fetch;
    }

    console.log('[x402] Setting up x402 client with signer:', signer.address);

    // Create x402 client
    const client = new x402Client();
    
    // Create AVM scheme with signer and Algod client
    const testnetAlgodClient = createAlgodClient(ALGORAND_TESTNET_CAIP2, ALGOD_URL);
    
    const avmScheme = new ExactAvmScheme(signer, {
      algodClient: testnetAlgodClient as any,
    });
    
    // Register the scheme
    registerExactAvmScheme(client, { signer });
    
    // Debug lifecycle hooks
    client.onBeforePaymentCreation(async ({ selectedRequirements }) => {
      console.log('[x402] BEFORE PAYMENT:', {
        amount: selectedRequirements.amount,
        payTo: selectedRequirements.payTo,
        asset: selectedRequirements.asset,
        network: selectedRequirements.network,
      });
    });
    
    client.onAfterPaymentCreation(async () => {
      console.log('[x402] AFTER PAYMENT - Transaction signed and submitted');
    });
    
    client.onPaymentCreationFailure(async ({ error }) => {
      console.error('[x402] PAYMENT CREATION FAILED:', error.message);
    });

    console.log('[x402] x402 client configured, wrapping fetch');
    
    // Use wrapFetchWithPayment for proper 402 handling
    return wrapFetchWithPayment(fetch, client);
  }, [signer]);

  if (!signer) {
    return fetch;
  }

  return fetchWithPayment;
}

export const TESTNET_CONFIG = {
  network: ALGORAND_TESTNET_CAIP2,
  algodUrl: ALGOD_URL,
  usdcAssetId: "10458941",
};