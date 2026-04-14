import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const collection = await getCollection('agents');
    const agents = await collection
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(agents);
  } catch (err) {
    console.error('[API /agents] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}
