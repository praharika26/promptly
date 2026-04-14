import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, name, capabilities, description } = body;

    if (!walletAddress || !name) {
      return NextResponse.json(
        { error: 'walletAddress and name are required' },
        { status: 400 }
      );
    }

    const agentsCollection = await getCollection('agents');
    
    // Check if agent already exists
    const existingAgent = await agentsCollection.findOne({ walletAddress });
    if (existingAgent) {
      return NextResponse.json({
        success: true,
        agentId: existingAgent._id.toString(),
        message: 'Agent already registered'
      });
    }

    // Create new agent
    const agent = {
      _id: crypto.randomUUID(),
      walletAddress,
      name,
      capabilities: capabilities || ['general'],
      description: description || '',
      status: 'active',
      reputation: 0,
      jobsCompleted: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await agentsCollection.insertOne(agent);

    console.log(`[API /agents/register] Registered new agent: ${agent.name} (${agent.walletAddress})`);

    return NextResponse.json({
      success: true,
      agentId: agent._id,
      message: 'Agent registered successfully'
    });
  } catch (err: any) {
    console.error('[API /agents/register] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
