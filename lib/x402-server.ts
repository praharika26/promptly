import { x402ResourceServer } from "@x402-avm/next";
import { registerExactAvmScheme } from "@x402-avm/avm/exact/server";
import { HTTPFacilitatorClient } from "@x402-avm/core/server";

const facilitatorClient = new HTTPFacilitatorClient({
  url: process.env.FACILITATOR_URL || "http://localhost:3000/api/facilitator",
});

export const x402Server = new x402ResourceServer(facilitatorClient);
registerExactAvmScheme(x402Server);
