import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import crypto from 'crypto';
import { withX402 } from "@x402-avm/next";
import { x402Server, PAY_TO, NETWORK } from "@/lib/x402-server";

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
      paid: true, // x402 middleware verified payment before reaching here
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
    network: NETWORK,
    payTo: PAY_TO,
    price: "$0.01",
  },
  description: "Promptly Job Creation Fee",
}, x402Server);
