import { NextRequest, NextResponse } from "next/server";
import { markDonated } from "@/lib/skip";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { donation_recipient, donation_date } = await req.json();
    const data = await markDonated(params.id, donation_recipient, donation_date);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
