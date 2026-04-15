import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402-avm/next";
import { x402Server } from "@/lib/x402-server";
import { ALGORAND_TESTNET_CAIP2 } from "@/lib/x402-facilitator";
import { generateAgentResponse } from "@/lib/ai-provider";
import { getCollection } from "@/lib/mongodb";
import { CONTRACT_IDS } from "@/lib/algorand";
import crypto from "crypto";

const USDC_ASSET_ID = "10458941";

async function executeHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, prompt } = body;
    
    // 1. Extract actual sender from payment if possible
    const paymentSignature = req.headers.get("PAYMENT-SIGNATURE");
    let senderAddress = req.headers.get("x-sender-address") || "anonymous";
    let txId = `mock-${Date.now()}`;

    if (paymentSignature) {
      try {
        const parsed = JSON.parse(paymentSignature);
        // In AVM Exact scheme, payload contains paymentGroup (base64 txns)
        if (parsed.payload?.paymentGroup?.[0]) {
          const firstTxnB64 = parsed.payload.paymentGroup[0];
          const txnBytes = Buffer.from(firstTxnB64, 'base64');
          // We could decode this to get the sender, but for now we trust the header 
          // or use the group ID as the txId
          txId = crypto.createHash('sha256').update(firstTxnB64).digest('hex').slice(0, 16);
        }
      } catch (e) {
        console.error("Failed to parse payment signature", e);
      }
    }

    // 2. Generate real AI response
    console.log(`[API /execute] Running prompt against agent ${agentId}: ${prompt}`);
    const aiResponse = await generateAgentResponse(prompt, agentId);
    
    // 3. PERSIST to MongoDB
    const executionsCollection = await getCollection('executions');
    const executionDoc = {
      appId: CONTRACT_IDS.agentExecutor,
      agentAppId: agentId,
      callerAddress: senderAddress,
      input: prompt,
      output: aiResponse,
      txId,
      executedAt: new Date(),
      status: 'success',
      cost: 10000, // $0.01 in micro-units
    };

    await executionsCollection.insertOne(executionDoc);
    console.log(`[API /execute] Persisted output for ${agentId} to dashboard`);

    return NextResponse.json({
      success: true,
      agentId,
      result: aiResponse,
      txId
    });
  } catch (err: any) {
    console.error("[API /execute] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const POST = withX402(executeHandler, {
  accepts: {
    scheme: "exact",
    network: ALGORAND_TESTNET_CAIP2,
    payTo: process.env.PAY_TO || "QZUNVQQ3T6TNOXUKZTEXZ4JJFFQ77AF5GKXUE2A43YC7FKXOLSBDI6O76Y",
    price: "$0.01",
    extra: {
      asset: USDC_ASSET_ID, // USDC on Testnet
      decimals: 6,
    },
  },
  description: "Agent Execution Fee - Paid in USDC",
}, x402Server);
