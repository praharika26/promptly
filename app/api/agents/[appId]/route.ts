import { NextRequest, NextResponse } from 'next/server';
import { getAgentByAppId } from '@/lib/contracts/agent-registry';
import { getReputationForAgent } from '@/lib/contracts/agent-reputation';
import { getExecutionHistory } from '@/lib/contracts/agent-executor';

export async function GET(
  req: NextRequest,
  { params }: { params: { appId: string } }
) {
  const appId = Number(params.appId);

  if (isNaN(appId)) {
    return NextResponse.json({ error: 'Invalid appId' }, { status: 400 });
  }

  try {
    const [agent, reputation, executions] = await Promise.all([
      getAgentByAppId(appId),
      getReputationForAgent(appId),
      getExecutionHistory(appId),
    ]);

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json({ agent, reputation, executions });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
