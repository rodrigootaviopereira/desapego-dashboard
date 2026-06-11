import { NextRequest, NextResponse } from "next/server";
import { markSold } from "@/lib/skip";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { valor_final } = await req.json();
    const data = await markSold(params.id, Number(valor_final));
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
