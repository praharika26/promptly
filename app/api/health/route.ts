import { NextResponse } from 'next/server';
import { healthCheck, getAlgodClient, CONTRACT_IDS } from '@/lib/algorand';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  const results: Record<string, unknown> = {};

  // Check Algorand
  results.algorand = await healthCheck();

  // Check contract App IDs
  const algod = getAlgodClient();
  for (const [name, appId] of Object.entries(CONTRACT_IDS)) {
    try {
      await algod.getApplicationByID(appId).do();
      results[`contract_${name}`] = { status: 'live', appId };
    } catch {
      results[`contract_${name}`] = { status: 'dead', appId };
    }
  }

  // Check MongoDB
  try {
    await connectToDatabase();
    results.mongodb = 'connected';
  } catch (err) {
    results.mongodb = `error: ${err}`;
  }

  const allOk = results.algorand === true && results.mongodb === 'connected';
  return NextResponse.json(results, { status: allOk ? 200 : 503 });
}
