import { NextResponse } from "next/server";
import { facilitator } from "@/lib/x402-facilitator";

export async function POST(req: Request) {
  try {
    const { paymentPayload, paymentRequirements } = await req.json();
    const result = await facilitator.settle(paymentPayload, paymentRequirements);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Facilitator Settle Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
