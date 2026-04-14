import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402-avm/next";
import { x402Server } from "@/lib/x402-server";
import { ALGORAND_TESTNET_CAIP2 } from "@/lib/x402-facilitator";
import { getCollection } from "@/lib/mongodb";
import crypto from "crypto";

const USDC_ASSET_ID = "10458941";

async function executeHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await request.json();
    const { agentId, prompt } = body;
    
    // Get headers set by withX402 middleware for the verified payment
    const paymentSignature = request.headers.get("PAYMENT-SIGNATURE");
    const parsedSignature = paymentSignature ? JSON.parse(paymentSignature) : null;
    const txId = parsedSignature?.payload?.paymentGroup?.[0] || `mock-${Date.now()}`;

    // Get the job to find the agent
    const jobsCollection = await getCollection('jobs');
    const job = await jobsCollection.findOne({ _id: jobId });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get agent details for payment
    const agentsCollection = await getCollection('agents');
    const agent = await agentsCollection.findOne({ _id: agentId });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Simulate AI response (in real scenario, this would call the agent's AI)
    const aiResponse = `Processed prompt: "${job.prompt}" - This is the result from the worker agent.`;
    
    // Hash for on-chain integrity
    const inputHash = crypto.createHash('sha256').update(job.prompt).digest('hex');
    const outputHash = crypto.createHash('sha256').update(aiResponse).digest('hex');

    // Update job status
    await jobsCollection.updateOne(
      { _id: jobId },
      { 
        $set: { 
          status: 'COMPLETED',
          result: aiResponse,
          executedAt: new Date(),
          txId
        } 
      }
    );

    // Record execution
    const executionsCollection = await getCollection('executions');
    const executionDoc = {
      jobId,
      agentId,
      agentAddress: agent.walletAddress,
      callerAddress: request.headers.get("x-sender-address") || "anonymous",
      input: job.prompt,
      output: aiResponse,
      inputHash,
      outputHash,
      txId,
      executedAt: new Date(),
      status: 'success',
      paymentAsset: USDC_ASSET_ID,
      paymentAmount: "10000", // $0.01 USDC
      paymentTxId: txId,
    };

    await executionsCollection.insertOne(executionDoc);
    console.log(`[API /jobs/[id]/execute] Executed job ${jobId}, payment to ${agent.walletAddress}`);

    return NextResponse.json({
      success: true,
      jobId,
      result: aiResponse,
      txId,
      paidTo: agent.walletAddress
    });
  } catch (err: any) {
    console.error("[API /jobs/[id]/execute] Error:", err.message);
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
      asset: USDC_ASSET_ID,
      decimals: 6,
    },
  },
  description: "Job Execution Fee - Paid in USDC to Agent",
}, x402Server);
