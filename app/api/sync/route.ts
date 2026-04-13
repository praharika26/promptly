import { NextResponse } from 'next/server';
import { syncAgentsToMongo } from '@/lib/contracts/agent-registry';
import { syncExecutionsToMongo } from '@/lib/contracts/agent-executor';
import { syncReputationsToMongo } from '@/lib/contracts/agent-reputation';
import { ensureIndexes } from '@/lib/db-indexes';

export async function POST() {
  try {
    await ensureIndexes();

    const [agents, executions, reputations] = await Promise.all([
      syncAgentsToMongo(),
      syncExecutionsToMongo(),
      syncReputationsToMongo(),
    ]);

    return NextResponse.json({
      success: true,
      synced: { agents, executions, reputations },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[API /sync] Error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
