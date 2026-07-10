import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const all = await db.select().from(notifications).where(eq(notifications.userId, session.user.id)).orderBy(desc(notifications.createdAt)).limit(20);
  return NextResponse.json({ notifications: all });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, message, type = "info", userId } = await req.json();
  const targetUserId = userId || session.user.id;
  const ins = await db.insert(notifications).values({
    userId: targetUserId,
    title,
    message,
    type,
  }).returning();
  return NextResponse.json({ notification: ins[0] });
}

export async function PATCH(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const updated = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning();
  return NextResponse.json({ notification: updated[0] });
}
