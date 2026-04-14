import { NextResponse } from "next/server";
import { facilitator } from "@/lib/x402-facilitator";

export async function GET() {
  try {
    const supported = facilitator.getSupported();
    return NextResponse.json(supported);
  } catch (error: any) {
    console.error("Facilitator Supported Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
