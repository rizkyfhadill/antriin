import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get("locationId");
  let query = await db.select().from(services).orderBy(desc(services.createdAt));
  if (locationId) query = query.filter(s => s.locationId === locationId);
  return NextResponse.json({ services: query });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["admin", "super_admin"].includes(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { locationId, name, description, durationAvg, price, quota } = body;
  if (!locationId || !name) return NextResponse.json({ error: "Data wajib" }, { status: 400 });
  const ins = await db.insert(services).values({
    locationId,
    name,
    description,
    durationAvg: Number(durationAvg) || 10,
    price: Number(price) || 0,
    quota: Number(quota) || 50,
  }).returning();
  return NextResponse.json({ service: ins[0] });
}
