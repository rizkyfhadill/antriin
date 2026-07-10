import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ratings } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get("locationId");
  let all = await db.select().from(ratings).orderBy(desc(ratings.createdAt));
  if (locationId) all = all.filter(r => r.locationId === locationId);
  return NextResponse.json({ ratings: all });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { queueId, locationId, rating, comment } = await req.json();
  if (!rating || rating < 1 || rating > 5) return NextResponse.json({ error: "Rating 1-5" }, { status: 400 });
  const ins = await db.insert(ratings).values({
    queueId,
    locationId,
    customerId: session.user.id,
    rating: Number(rating),
    comment,
  }).returning();
  return NextResponse.json({ rating: ins[0] });
}
