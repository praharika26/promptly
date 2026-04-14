import { x402ResourceServer } from "@x402-avm/next";
import { registerExactAvmScheme } from "@x402-avm/avm/exact/server";
import { facilitator, ALGORAND_LOCALNET_CAIP2 } from "./x402-facilitator";

export const x402Server = new x402ResourceServer(facilitator);

// Explicitly register the scheme with the verified local genesis hash identifier
registerExactAvmScheme(x402Server, {
  networks: [ALGORAND_LOCALNET_CAIP2]
});
