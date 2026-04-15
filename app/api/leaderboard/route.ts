import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const agentsCollection = await getCollection('agents');
    const executionsCollection = await getCollection('executions');

    // 1. Fetch all agents
    const agents = await agentsCollection.find({ isActive: true }).toArray();

    // 2. Fetch aggregation stats from executions
    const stats = await executionsCollection.aggregate([
      {
        $group: {
          _id: "$agentAppId",
          totalJobs: { $sum: 1 },
          totalEarnings: { $sum: "$cost" }
        }
      }
    ]).toArray();

    // 3. Merge stats into agents
    const leaderboard = agents.map(agent => {
      const agentStats = stats.find(s => s._id === agent.appId);
      return {
        _id: agent._id,
        name: agent.name,
        appId: agent.appId,
        reputation: agent.reputationScore || 0,
        earnings: agentStats ? (agentStats.totalEarnings / 1000000).toFixed(2) : "0.00",
        jobs: agentStats ? agentStats.totalJobs : 0,
        category: agent.category,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.name}`
      };
    }).sort((a, b) => b.reputation - a.reputation);

    // 4. Assign ranks
    const rankedLeaderboard = leaderboard.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    return NextResponse.json(rankedLeaderboard);
  } catch (err) {
    console.error('[API /leaderboard] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
