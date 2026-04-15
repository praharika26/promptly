"use client";

import { useMemo } from "react";
import { useWallet } from "@txnlab/use-wallet-react";
import type { ClientAvmSigner } from "@x402-avm/avm";
import { ExactAvmScheme, ALGORAND_TESTNET_CAIP2 } from "@x402-avm/avm";
import { wrapFetchWithPayment, x402Client } from "@x402-avm/fetch";
import { registerExactAvmScheme } from "@x402-avm/avm/exact/client";

const ALGOD_URL = "https://testnet-api.algonode.cloud";

export function useAvmSigner(): ClientAvmSigner | null {
  const { activeAccount, signTransactions } = useWallet();

  if (!activeAccount) {
    console.log('[x402] No active account connected');
    return null;
  }

  return {
    address: activeAccount.address,
    signTransactions: async (txns: Uint8Array[], indexesToSign?: number[]) => {
      console.log('[x402] signTransactions called:', {
        txnsCount: txns.length,
        indexesToSign: indexesToSign?.join(',') || 'all'
      });
      const signed = await signTransactions(txns, indexesToSign);
      console.log('[x402] Signed txns returned:', signed.filter(Boolean).length);
      return signed;
    },
  };
}

export function useX402Fetch() {
  const { activeAccount, signTransactions } = useWallet();

  return useMemo(() => {
    if (!activeAccount) {
      console.log('[x402] No active account, returning raw fetch');
      return fetch;
    }

    console.log('[x402] Initializing x402 client with address:', activeAccount.address);

    const signer: ClientAvmSigner = {
      address: activeAccount.address,
      signTransactions: async (txns: Uint8Array[], indexesToSign?: number[]) => {
        console.log('[x402] Calling wallet.signTransactions...');
        try {
          const signed = await signTransactions(txns, indexesToSign);
          console.log('[x402] Wallet returned signed txns:', signed.filter(Boolean).length);
          return signed;
        } catch (err: any) {
          console.error('[x402] WALLET SIGNING ERROR:', err.message, err);
          throw err;
        }
      },
    };

    // Create the client instance
    const client = new x402Client();

    // Register Algorand scheme (handles V1 and V2 automatically)
    registerExactAvmScheme(client, {
      signer,
      networks: [ALGORAND_TESTNET_CAIP2, "algorand:*"], // Be permissive with networks
      algodConfig: {
        algodUrl: ALGOD_URL,
      }
    });

    // Add logging hooks
    client.onBeforePaymentCreation(async (ctx) => {
      console.log('[x402] Requirements matched, about to create payment', ctx.selectedRequirements);
    });

    client.onAfterPaymentCreation(async (ctx) => {
      console.log('[x402] Payment payload created successfully');
    });

    client.onPaymentCreationFailure(async (ctx) => {
      console.error('[x402] Payment creation failed:', ctx.error.message);
    });

    console.log('[x402] Client ready, wrapping fetch');
    
    const wrappedFetch = wrapFetchWithPayment(fetch, client);
    
    // Add a wrapper to log call attempts
    return async (input: RequestInfo | URL, init?: RequestInit) => {
      console.log(`[x402] Outgoing request to: ${typeof input === 'string' ? input : (input as Request).url || 'unknown'}`);
      const response = await wrappedFetch(input, init);
      if (response.status === 402) {
        console.warn(`[x402] RECEIVED 402 from server. Headers:`, Array.from(response.headers.entries()));
      }
      return response;
    };
  }, [activeAccount, signTransactions]);
}

export const TESTNET_CONFIG = {
  network: ALGORAND_TESTNET_CAIP2,
  algodUrl: ALGOD_URL,
  usdcAssetId: "10458941",
};