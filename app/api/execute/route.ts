import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402-avm/next";
import { x402Server } from "@/lib/x402-server";
import { ALGORAND_LOCALNET_CAIP2 } from "@/lib/x402-facilitator";
import { generateAgentResponse } from "@/lib/ai-provider";
import { getCollection } from "@/lib/mongodb";
import { CONTRACT_IDS } from "@/lib/algorand";
import crypto from "crypto";

async function executeHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, prompt } = body;
    
    // Get headers set by withX402 middleware for the verified payment
    const paymentSignature = req.headers.get("PAYMENT-SIGNATURE");
    const parsedSignature = paymentSignature ? JSON.parse(paymentSignature) : null;
    const txId = parsedSignature?.payload?.paymentGroup?.[0] || `mock-${Date.now()}`;

    // 1. Generate real AI response
    console.log(`[API /execute] Running prompt against agent ${agentId}: ${prompt}`);
    const aiResponse = await generateAgentResponse(prompt, agentId);
    
    // 2. Hash for on-chain integrity (if needed)
    const inputHash = crypto.createHash('sha256').update(prompt).digest('hex');
    const outputHash = crypto.createHash('sha256').update(aiResponse).digest('hex');

    // 3. PERSIST to MongoDB
    const executionsCollection = await getCollection('executions');
    const executionDoc = {
      appId: CONTRACT_IDS.agentExecutor,
      agentAppId: Number(agentId),
      callerAddress: req.headers.get("x-sender-address") || "anonymous",
      input: prompt,
      output: aiResponse,
      inputHash,
      outputHash,
      txId,
      round: 0, // In a real system, we'd fetch the confirmed round from algod
      executedAt: new Date(),
      status: 'success',
      cost: 1000, // 0.001 ALGO
    };

    await executionsCollection.insertOne(executionDoc);
    console.log(`[API /execute] Persisted execution ${txId} to MongoDB`);

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
    network: ALGORAND_LOCALNET_CAIP2,
    payTo: process.env.PAY_TO || "QZUNVQQ3T6TNOXUKZTEXZ4JJFFQ77AF5GKXUE2A43YC7FKXOLSBDI6O76Y",
    price: "$0.01",
    extra: {
      asset: "0", // Native ALGO
      decimals: 6,
    },
  },
  description: "Agent Execution Fee",
}, x402Server);
