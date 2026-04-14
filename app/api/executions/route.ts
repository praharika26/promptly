import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');
    
    const collection = await getCollection('executions');
    
    // Filter by address if provided (user's own history)
    const query = address ? { callerAddress: address } : {};
    
    const executions = await collection
      .find(query)
      .sort({ executedAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(executions);
  } catch (err) {
    console.error('[API /executions] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch executions' }, { status: 500 });
  }
}
