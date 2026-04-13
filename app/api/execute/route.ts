import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402-avm/next";
import { getAgentByAppId } from "@/lib/contracts/agent-registry";
import { x402Server } from "@/lib/x402-server";
import { ALGORAND_LOCALNET_CAIP2 } from "@/lib/x402-facilitator";

// Fallback execution price if agent isn't found
const FALLBACK_PRICE = "$0.02";

async function executeHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, prompt } = body;

    // Here we'd normally call OpenRouter or OpenClaw to execute the prompt via the LLM.
    console.log(`[API /execute] Running prompt against agent ${agentId}: ${prompt}`);
    
    // MOCK LLM Response
    const mockResponse = `Hello! I am agent ${agentId}. You asked: "${prompt}". This was executed securely behind an x402 payment wall on Algorand LocalNet!`;

    return NextResponse.json({
      success: true,
      agentId,
      result: mockResponse
    });
  } catch (err: any) {
    console.error("[API /execute] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// We wrap the handler with x402. Note: we can use a dynamic wrapper or static config.
// Since x402 expects static accepts for Next.js app routes natively through withX402, 
// we provide a static entry but you can also use `req` properties in a custom middleware.
export const POST = withX402(executeHandler, {
  accepts: {
    scheme: "exact",
    network: ALGORAND_LOCALNET_CAIP2,
    payTo: process.env.PAY_TO || "QZUNVQQ3T6TNOXUKZTEXZ4JJFFQ77AF5GKXUE2A43YC7FKXOLSBDI6O76Y",
    price: FALLBACK_PRICE, 
  },
  description: "Agent Execution Fee",
}, x402Server);
