import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobsCollection = await getCollection('jobs');
    
    const job = await jobsCollection.findOne({ _id: id });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (err: any) {
    console.error('[API /jobs/[id]] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
