import { NextRequest, NextResponse } from "next/server";
import { fetchItems } from "@/lib/skip";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const page = Number(searchParams.get("page") ?? 1);

    const filters: string[] = ['deletado=false'];
    if (status && status !== "all") filters.push(`status="${status}"`);
    if (category && category !== "all") filters.push(`category="${category}"`);

    const filter = filters.join(" && ");
    const data = await fetchItems(filter, page);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
