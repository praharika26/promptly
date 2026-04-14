"use client";

import { useMemo } from "react";
import { useWallet } from "@txnlab/use-wallet-react";
import type { ClientAvmSigner } from "@x402-avm/avm";
import { ExactAvmScheme, createAlgodClient } from "@x402-avm/avm";
import { wrapFetchWithPaymentFromConfig } from "@x402-avm/fetch";

const ALGORAND_TESTNET_CAIP2 = "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=";
const ALGOD_URL = "https://testnet-api.algonode.cloud";

function useAvmSigner(): ClientAvmSigner | null {
  const { activeAccount, signTransactions } = useWallet();

  if (!activeAccount) return null;

  return {
    address: activeAccount.address,
    signTransactions: async (txns: Uint8Array[], indexesToSign?: number[]) => {
      return signTransactions(txns, indexesToSign);
    },
  };
}

export function useX402Fetch() {
  const signer = useAvmSigner();

  const fetchWithPayment = useMemo(() => {
    if (!signer) return fetch;

    const testnetAlgodClient = createAlgodClient(ALGORAND_TESTNET_CAIP2, ALGOD_URL);

    const config = {
      schemes: [
        {
          network: ALGORAND_TESTNET_CAIP2,
          client: new ExactAvmScheme(signer, {
            algodClient: testnetAlgodClient as any
          }),
        },
      ],
    };

    return wrapFetchWithPaymentFromConfig(fetch, config);
  }, [signer]);

  return fetchWithPayment;
}

export const TESTNET_CONFIG = {
  network: ALGORAND_TESTNET_CAIP2,
  algodUrl: ALGOD_URL,
  usdcAssetId: "10458941",
};