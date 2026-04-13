import { NextResponse } from 'next/server';
import { syncAgentsToMongo } from '@/lib/contracts/agent-registry';
import { syncExecutionsToMongo } from '@/lib/contracts/agent-executor';
import { syncReputationsToMongo } from '@/lib/contracts/agent-reputation';

// Allow Vercel Cron to Trigger this
export async function GET(request: Request) {
  // Verifying Authorization header for cron requests on production
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const agents = await syncAgentsToMongo();
    const executions = await syncExecutionsToMongo();
    const reputations = await syncReputationsToMongo();
    
    return NextResponse.json({ 
      status: 'success', 
      synced: {
        agents,
        executions,
        reputations
      }
    });
  } catch (error) {
    console.error('Error during cron sync:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
