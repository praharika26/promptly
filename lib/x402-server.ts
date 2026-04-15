import { x402ResourceServer } from "@x402-avm/next";
import { registerExactAvmScheme } from "@x402-avm/avm/exact/server";
import { HTTPFacilitatorClient } from "@x402-avm/core/server";
import { ALGORAND_TESTNET_CAIP2 } from "@x402-avm/avm";

// Use the public GoPlausible facilitator — it handles verification & settlement on-chain
const facilitatorClient = new HTTPFacilitatorClient({
  url: process.env.FACILITATOR_URL || "https://facilitator.goplausible.xyz",
});

export const x402Server = new x402ResourceServer(facilitatorClient);
registerExactAvmScheme(x402Server);

export const PAY_TO = process.env.PAY_TO!;
export const NETWORK = ALGORAND_TESTNET_CAIP2;
