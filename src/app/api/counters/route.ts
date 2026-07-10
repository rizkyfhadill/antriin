import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { counters } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get("locationId");
  let all = await db.select().from(counters);
  if (locationId) all = all.filter(c => c.locationId === locationId);
  return NextResponse.json({ counters: all });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { locationId, name, operatorId } = await req.json();
  if (!locationId || !name) return NextResponse.json({ error: "Wajib" }, { status: 400 });
  const ins = await db.insert(counters).values({
    locationId,
    name,
    operatorId: operatorId || null,
  }).returning();
  return NextResponse.json({ counter: ins[0] });
}

export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "ID wajib" }, { status: 400 });
  const updated = await db.update(counters).set(data).where(eq(counters.id, id)).returning();
  return NextResponse.json({ counter: updated[0] });
}
