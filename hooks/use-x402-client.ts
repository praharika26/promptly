"use client";

import { useMemo } from "react";
import { useWallet } from "@txnlab/use-wallet-react";
import type { ClientAvmSigner } from "@x402-avm/avm";
import { ExactAvmScheme, createAlgodClient } from "@x402-avm/avm";
import { wrapFetchWithPaymentFromConfig } from "@x402-avm/fetch";

// VERIFIED LocalNet Genesis Hash CAIP-2
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
    if (!signer) return fetch;

    const localAlgodClient = createAlgodClient(ALGORAND_LOCALNET_CAIP2, "http://localhost:4001", "a".repeat(64));

    const config = {
      schemes: [
        {
          network: ALGORAND_LOCALNET_CAIP2,
          client: new ExactAvmScheme(signer, {
            algodClient: localAlgodClient as any
          }),
        },
      ],
    };

    return wrapFetchWithPaymentFromConfig(fetch, config);
  }, [signer]);

  return fetchWithPayment;
}
