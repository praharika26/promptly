import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import crypto from 'crypto';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, budget, category, requirements } = body;

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
      requirements: requirements || [],
      status: 'OPEN',
      createdAt: new Date(),
      updatedAt: new Date(),
      responseCount: 0,
    };

    await jobsCollection.insertOne(job);

    console.log(`[API /jobs] Created new job: ${job._id}`);

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
