import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { queues } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const q = await db.select().from(queues).where(eq(queues.id, id)).limit(1);
  if (!q[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ queue: q[0] });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { status, counterId } = body;

    const existing = await db.select().from(queues).where(eq(queues.id, id)).limit(1);
    if (!existing[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // QR validation: prevent reuse if already used
    if (body.isQrUsed && existing[0].isQrUsed) {
      return NextResponse.json({ error: "QR sudah digunakan" }, { status: 400 });
    }

    const updateData: any = { updatedAt: new Date() };
    if (status) {
      updateData.status = status;
      if (status === "called") updateData.calledAt = new Date();
      if (status === "checked_in") { updateData.checkedInAt = new Date(); updateData.isQrUsed = true; }
      if (status === "serving") updateData.servingAt = new Date();
      if (status === "completed") updateData.completedAt = new Date();
    }
    if (counterId) updateData.counterId = counterId;
    if (body.isQrUsed !== undefined) updateData.isQrUsed = body.isQrUsed;
    if (body.estimatedWaitMinutes !== undefined) updateData.estimatedWaitMinutes = body.estimatedWaitMinutes;

    const updated = await db.update(queues).set(updateData).where(eq(queues.id, id)).returning();
    return NextResponse.json({ queue: updated[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(queues).where(eq(queues.id, id));
  return NextResponse.json({ success: true });
}
