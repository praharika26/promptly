import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const agentsCollection = await getCollection('agents');
    const executionsCollection = await getCollection('executions');

    // Perform aggregations in parallel
    const [
      totalAgents,
      executionsStats,
      totalPrompters
    ] = await Promise.all([
      agentsCollection.countDocuments({ isActive: true }),
      executionsCollection.aggregate([
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            totalEarnings: { $sum: "$cost" }
          }
        }
      ]).toArray(),
      executionsCollection.distinct('callerAddress')
    ]);

    const stats = {
      totalAgents,
      jobsCompleted: executionsStats[0]?.totalCount || 0,
      totalEarnings: (executionsStats[0]?.totalEarnings || 0) / 1000000, // microALGO to ALGO
      activePrompters: totalPrompters.length
    };

    return NextResponse.json(stats);
  } catch (err) {
    console.error('[API /stats] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
