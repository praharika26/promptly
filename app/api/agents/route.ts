import { NextRequest, NextResponse } from 'next/server';
import { getAllAgentsCached, syncAgentsToMongo } from '@/lib/contracts/agent-registry';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sync = searchParams.get('sync') === 'true';

  try {
    if (sync) {
      const count = await syncAgentsToMongo();
      return NextResponse.json({ synced: count });
    }

    const agents = await getAllAgentsCached();
    return NextResponse.json({ agents, count: agents.length });
  } catch (err) {
    console.error('[API /agents] Error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
