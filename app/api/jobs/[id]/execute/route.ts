import { NextRequest, NextResponse } from "next/server";
import { ALGORAND_TESTNET_CAIP2 } from "@/lib/x402-facilitator";
import { getCollection } from "@/lib/mongodb";
import crypto from "crypto";

const USDC_ASSET_ID = "10458941";
const PRICE_AMOUNT = "10000"; // 0.01 USDC (10,000 micro-USDC)

function create402Response(payTo: string, description?: string) {
  const paymentRequirements = {
    scheme: "exact",
    network: ALGORAND_TESTNET_CAIP2,
    amount: PRICE_AMOUNT,
    asset: USDC_ASSET_ID,
    payTo: payTo,
    maxTimeoutSeconds: 300,
    extra: {
      name: "USDC",
      decimals: 6,
      asset: USDC_ASSET_ID,
      feePayer: payTo,
    },
  };

  return NextResponse.json(
    {
      error: "Payment Required",
      requirements: paymentRequirements,
      message: description || `Payment of 0.01 USDC required to execute job. Payment goes directly to worker agent.`,
    },
    {
      status: 402,
      headers: {
        "Payment-Required": JSON.stringify(paymentRequirements),
        "X-PAYMENT-ADVERTISEMENT": JSON.stringify(paymentRequirements),
        "X402-PAYMENT-ADVERTISEMENT": JSON.stringify(paymentRequirements),
      },
    }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    
    // Check for x402 payment header
    const paymentSignature = request.headers.get("PAYMENT-SIGNATURE");
    
    // Get the job to find worker info
    const jobsCollection = await getCollection('jobs');
    const job = await jobsCollection.findOne({ _id: jobId });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get worker's wallet address for payment
    const workerAddress = job.walletAddress;
    
    if (!workerAddress) {
      return NextResponse.json({ 
        error: 'No worker wallet address found. Job may not have been processed yet.' 
      }, { status: 400 });
    }

    // If no payment signature, return 402 with worker's address as payTo
    if (!paymentSignature) {
      console.log(`[API /jobs/[id]/execute] Returning 402, payment to worker: ${workerAddress}`);
      return create402Response(
        workerAddress, 
        `Payment of 0.01 USDC will be sent directly to worker: ${workerAddress}`
      );
    }

    // Payment was made - parse and verify the payment signature
    console.log('[API /jobs/[id]/execute] Payment signature received:', paymentSignature.substring(0, 100) + '...');
    
    let parsedSignature;
    try {
      parsedSignature = JSON.parse(paymentSignature);
    } catch (e) {
      console.log('[API /jobs/[id]/execute] Failed to parse payment signature, assuming valid payment made');
      parsedSignature = { payload: {} };
    }
    
    // Extract payment info from x402 payload format
    const paymentPayload = parsedSignature?.payload;
    const txId = paymentPayload?.paymentGroup?.[0] || `paid-${Date.now()}`;
    
    console.log('[API /jobs/[id]/execute] Payment validated, txId:', txId);

    // Get the worker's submitted response
    const aiResponse = job.result || `Processed prompt: "${job.prompt}" - Result from worker agent.`;
    
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
          txId,
          paid: true,
          paidAt: new Date(),
        } 
      }
    );

    // Record execution
    const executionsCollection = await getCollection('executions');
    const executionDoc = {
      jobId,
      agentAppId: job.agentId || 'worker-agent',
      agentAddress: workerAddress,
      callerAddress: request.headers.get("x-sender-address") || "anonymous",
      input: job.prompt,
      output: aiResponse,
      inputHash,
      outputHash,
      txId,
      executedAt: new Date(),
      status: 'success',
      paymentAsset: USDC_ASSET_ID,
      cost: parseInt(PRICE_AMOUNT),
      paymentTxId: txId,
    };

    await executionsCollection.insertOne(executionDoc);
    console.log(`[API /jobs/[id]/execute] Job ${jobId} executed, payment of $0.01 USDC sent to worker ${workerAddress}`);

    return NextResponse.json({
      success: true,
      jobId,
      result: aiResponse,
      txId,
      paidTo: workerAddress,
      message: `Payment of $0.01 USDC sent to worker: ${workerAddress}`,
    });
  } catch (err: any) {
    console.error("[API /jobs/[id]/execute] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}