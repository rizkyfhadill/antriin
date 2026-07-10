import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { queues } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { qrCode } = await req.json();
    if (!qrCode) return NextResponse.json({ error: "QR Code wajib" }, { status: 400 });
    const q = await db.select().from(queues).where(eq(queues.qrCode, qrCode)).limit(1);
    if (!q[0]) return NextResponse.json({ error: "QR tidak valid" }, { status: 404 });
    if (q[0].isQrUsed) return NextResponse.json({ error: "QR sudah digunakan", queue: q[0] }, { status: 400 });
    // auto check-in
    const updated = await db.update(queues).set({ status: "checked_in", checkedInAt: new Date(), isQrUsed: true, updatedAt: new Date() }).where(eq(queues.id, q[0].id)).returning();
    return NextResponse.json({ success: true, queue: updated[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Gagal verifikasi" }, { status: 500 });
  }
}
