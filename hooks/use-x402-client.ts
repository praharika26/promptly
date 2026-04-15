"use client";

import { useMemo } from "react";
import { useWallet } from "@txnlab/use-wallet-react";
import type { ClientAvmSigner } from "@x402-avm/avm";
import { ALGORAND_TESTNET_CAIP2 } from "@x402-avm/avm";
import { wrapFetchWithPayment, x402Client } from "@x402-avm/fetch";
import { registerExactAvmScheme } from "@x402-avm/avm/exact/client";

const ALGOD_URL = "https://testnet-api.algonode.cloud";

export function useX402Fetch() {
  const { activeAccount, signTransactions } = useWallet();

  return useMemo(() => {
    if (!activeAccount) {
      return fetch;
    }

    const signer: ClientAvmSigner = {
      address: activeAccount.address,
      signTransactions: async (txns: Uint8Array[], indexesToSign?: number[]) => {
        return signTransactions(txns, indexesToSign);
      },
    };

    const client = new x402Client();
    registerExactAvmScheme(client, {
      signer,
      algodConfig: {
        algodUrl: ALGOD_URL,
      },
    });

    return wrapFetchWithPayment(fetch, client);
  }, [activeAccount, signTransactions]);
}

export const TESTNET_CONFIG = {
  network: ALGORAND_TESTNET_CAIP2,
  algodUrl: ALGOD_URL,
  usdcAssetId: "10458941",
};