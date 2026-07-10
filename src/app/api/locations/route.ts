import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { locations, services, counters, users } from "@/db/schema";
import { eq, like, and, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const city = searchParams.get("city");

    let query = db.select().from(locations).orderBy(desc(locations.createdAt));

    // Simple fetch all then filter in memory for MVP (drizzle dynamic where more complex)
    const all = await db.select().from(locations).orderBy(desc(locations.createdAt));
    let filtered = all;
    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter(l => l.name.toLowerCase().includes(lower) || l.address.toLowerCase().includes(lower));
    }
    if (category && category !== "all") {
      filtered = filtered.filter(l => l.category === category);
    }
    if (city && city !== "all") {
      filtered = filtered.filter(l => l.city.toLowerCase() === city.toLowerCase());
    }
    return NextResponse.json({ locations: filtered });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Gagal memuat lokasi" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const role = session.user.role;
    if (!["admin", "super_admin"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await req.json();
    const { name, category, address, city, latitude, longitude, openingTime, closingTime, totalCounters, quotaPerDay, description, imageUrl } = body;
    if (!name || !address || !city) {
      return NextResponse.json({ error: "Nama, alamat, kota wajib" }, { status: 400 });
    }
    const inserted = await db.insert(locations).values({
      name,
      category: category || "other",
      address,
      city,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      openingTime: openingTime || "08:00",
      closingTime: closingTime || "17:00",
      totalCounters: Number(totalCounters) || 3,
      quotaPerDay: Number(quotaPerDay) || 100,
      description,
      imageUrl,
      ownerId: session.user.id,
    }).returning();

    const loc = inserted[0];

    // auto create counters
    const counterPromises = Array.from({ length: Number(totalCounters) || 3 }).map((_, i) =>
      db.insert(counters).values({
        locationId: loc.id,
        name: `Loket ${i + 1}`,
        status: "active",
      })
    );
    await Promise.all(counterPromises);

    // auto create default services
    await db.insert(services).values([
      { locationId: loc.id, name: "Layanan Umum", description: "Pelayanan umum standar", durationAvg: 8 },
      { locationId: loc.id, name: "Layanan Prioritas", description: "Layanan prioritas cepat", durationAvg: 5 },
      { locationId: loc.id, name: "Konsultasi", description: "Sesi konsultasi mendalam", durationAvg: 15 },
    ]);

    return NextResponse.json({ success: true, location: loc });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Gagal membuat lokasi" }, { status: 500 });
  }
}
