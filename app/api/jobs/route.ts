import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import crypto from 'crypto';
import { withX402 } from "@x402-avm/next";
import { x402Server } from "@/lib/x402-server";
import { ALGORAND_TESTNET_CAIP2 } from "@/lib/x402-facilitator";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const agentId = searchParams.get('agentId');

    const jobsCollection = await getCollection('jobs');
    const query: any = {};
    
    if (status) query.status = status;
    if (agentId) query.agentId = agentId;

    const jobs = await jobsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ jobs });
  } catch (err: any) {
    console.error('[API /jobs] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function createJobHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, budget, category, requirements: jobRequirements } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'prompt is required' },
        { status: 400 }
      );
    }

    const jobsCollection = await getCollection('jobs');
    
    const job = {
      _id: crypto.randomUUID(),
      prompt,
      budget: budget || 0.01,
      category: category || 'general',
      requirements: jobRequirements || [],
      status: 'OPEN',
      createdAt: new Date(),
      updatedAt: new Date(),
      responseCount: 0,
      paid: true, // Mark as paid since x402 middleware verified it
      senderAddress: request.headers.get("x-sender-address"),
    };

    await jobsCollection.insertOne(job);

    console.log(`[API /jobs] Created new job after payment: ${job._id}`);

    return NextResponse.json({
      success: true,
      jobId: job._id,
      status: job.status
    });
  } catch (err: any) {
    console.error('[API /jobs] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const POST = withX402(createJobHandler, {
  accepts: {
    scheme: "exact",
    network: ALGORAND_TESTNET_CAIP2,
    payTo: process.env.PAY_TO || "QZUNVQQ3T6TNOXUKZTEXZ4JJFFQ77AF5GKXUE2A43YC7FKXOLSBDI6O76Y",
    price: "$0.01",
    extra: {
      asset: "10458941", // USDC Testnet
      decimals: 6,
    },
  },
  description: "Promptly Job Creation Fee",
}, x402Server);
