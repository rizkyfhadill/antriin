import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { locations, services, counters, queues, ratings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const loc = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
    if (!loc[0]) return NextResponse.json({ error: "Lokasi tidak ditemukan" }, { status: 404 });
    const svc = await db.select().from(services).where(eq(services.locationId, id));
    const ctr = await db.select().from(counters).where(eq(counters.locationId, id));
    const qs = await db.select().from(queues).where(eq(queues.locationId, id));
    const rt = await db.select().from(ratings).where(eq(ratings.locationId, id));
    const avgRating = rt.length ? (rt.reduce((a, b) => a + b.rating, 0) / rt.length).toFixed(1) : "0.0";
    return NextResponse.json({ location: loc[0], services: svc, counters: ctr, queues: qs, ratings: rt, avgRating });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Gagal" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await db.update(locations).set({ ...body, ownerId: undefined }).where(eq(locations.id, id)).returning();
    return NextResponse.json({ location: updated[0] });
  } catch (e) {
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await db.delete(locations).where(eq(locations.id, id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}
