import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { queues, services, locations } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { generateTicketNumber, generateQRCode } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get("locationId");
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");

    let all = await db.select().from(queues).orderBy(desc(queues.createdAt));
    if (locationId) all = all.filter(q => q.locationId === locationId);
    if (customerId) all = all.filter(q => q.customerId === customerId);
    if (status) all = all.filter(q => q.status === status as any);

    return NextResponse.json({ queues: all });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Gagal memuat antrean" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized — silakan login" }, { status: 401 });
    const { locationId, serviceId, bookingDate } = await req.json();
    if (!locationId || !serviceId) return NextResponse.json({ error: "Lokasi dan layanan wajib dipilih" }, { status: 400 });

    const loc = await db.select().from(locations).where(eq(locations.id, locationId)).limit(1);
    const svc = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);
    if (!loc[0] || !svc[0]) return NextResponse.json({ error: "Data lokasi/layanan tidak valid" }, { status: 400 });

    // quota check
    const todayQueues = await db.select().from(queues).where(eq(queues.locationId, locationId));
    const todayCount = todayQueues.filter(q => {
      const d = new Date(q.createdAt);
      const now = new Date();
      return d.toDateString() === now.toDateString() && ["waiting","called","checked_in","serving"].includes(q.status);
    }).length;
    if (todayCount >= (loc[0].quotaPerDay || 100)) {
      return NextResponse.json({ error: "Kuota antrean hari ini penuh, coba besok" }, { status: 400 });
    }

    // AI prediction: weighted calculation
    const waiting = await db.select().from(queues).where(and(eq(queues.locationId, locationId), eq(queues.status, "waiting")));
    const waitingSameService = waiting.filter(q => q.serviceId === serviceId);
    const historicalAvg = svc[0].durationAvg || loc[0].avgServiceTime || 8;
    
    // time factor: busier at 9-11am => +30% wait
    const hour = new Date().getHours();
    const timeFactor = hour >= 9 && hour <= 11 ? 1.3 : hour >= 13 && hour <= 15 ? 0.8 : 1.0;
    
    // day factor: Monday busier
    const day = new Date().getDay();
    const dayFactor = day === 1 ? 1.25 : day === 0 || day === 6 ? 0.7 : 1.0;
    
    const baseEstimated = waitingSameService.length * historicalAvg;
    const randomJitter = Math.floor(Math.random() * 4); // small randomness for realism
    const estimated = Math.max(2, Math.round(baseEstimated * timeFactor * dayFactor + randomJitter));

    const ticket = generateTicketNumber(svc[0].name.charAt(0).toUpperCase());
    const qr = generateQRCode();

    const inserted = await db.insert(queues).values({
      ticketNumber: ticket,
      locationId,
      serviceId,
      customerId: session.user.id,
      status: "waiting",
      estimatedWaitMinutes: estimated,
      position: waiting.length + 1,
      qrCode: qr,
      bookingDate: bookingDate ? new Date(bookingDate) : new Date(),
    }).returning();

    return NextResponse.json({ success: true, queue: inserted[0], estimated, timeFactor, dayFactor });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Gagal membuat antrean" }, { status: 500 });
  }
}
