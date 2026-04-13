"use client";

import { useMemo } from "react";
import { useWallet } from "@txnlab/use-wallet-react";
import type { ClientAvmSigner } from "@x402-avm/avm";
import { ExactAvmScheme } from "@x402-avm/avm";
import { wrapFetchWithPaymentFromConfig } from "@x402-avm/fetch";
// Same local CAIP-2 used in the backend
const ALGORAND_LOCALNET_CAIP2 = "algorand:/gUcgn0fBwrVK9UfXytu8/2iFm3oTkSBsxcJa0+fG4E=";

function useAvmSigner(): ClientAvmSigner | null {
  const { activeAccount, signTransactions } = useWallet();

  if (!activeAccount) return null;

  return {
    address: activeAccount.address,
    signTransactions: async (txns: Uint8Array[], indexesToSign?: number[]) => {
      // @txnlab/use-wallet expects Uint8Array[] array just like core x402-avm
      return signTransactions(txns, indexesToSign);
    },
  };
}

export function useX402Fetch() {
  const signer = useAvmSigner();

  const fetchWithPayment = useMemo(() => {
    if (!signer) return fetch; // fallback to standard fetch if no wallet is connected

    const config = {
      schemes: [
        {
          network: ALGORAND_LOCALNET_CAIP2,
          client: new ExactAvmScheme(signer),
        },
      ],
    };

    return wrapFetchWithPaymentFromConfig(fetch, config);
  }, [signer]);

  return fetchWithPayment;
}
