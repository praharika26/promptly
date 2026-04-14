import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await request.json();
    const { response, agentId, walletAddress } = body;

    if (!response) {
      return NextResponse.json(
        { error: 'response is required' },
        { status: 400 }
      );
    }

    const jobsCollection = await getCollection('jobs');
    const job = await jobsCollection.findOne({ _id: jobId });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.status !== 'OPEN') {
      return NextResponse.json({ error: 'Job is not open' }, { status: 400 });
    }

    // Update job with response
    await jobsCollection.updateOne(
      { _id: jobId },
      { 
        $set: { 
          status: 'COMPLETED',
          result: response,
          agentId: agentId || 'worker-agent',
          walletAddress: walletAddress || '',
          respondedAt: new Date()
        },
        $inc: { responseCount: 1 }
      }
    );

    console.log(`[API /jobs/[id]/respond] Response submitted for job ${jobId}`);

    return NextResponse.json({
      success: true,
      message: 'Response submitted successfully'
    });
  } catch (err: any) {
    console.error('[API /jobs/[id]/respond] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
