import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, locations, services, counters, queues, ratings, notifications } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

const DEFAULT_PASSWORD = "RSHS@2026";

export async function POST() {
  try {
    const passwordHash = await hashPassword(DEFAULT_PASSWORD);

    // Reset data agar akun login jelas hanya 4 role utama.
    await db.delete(notifications);
    await db.delete(ratings);
    await db.delete(queues);
    await db.delete(counters);
    await db.delete(services);
    await db.delete(locations);
    await db.delete(users);

    const [direktur] = await db.insert(users).values({
      name: "Dr. RSHS Direktur Utama",
      email: "direktur@rshs.go.id",
      passwordHash,
      role: "super_admin",
      phone: "0222032214",
      city: "Bandung",
      avatarUrl: "https://i.pravatar.cc/150?img=60",
    }).returning();

    const [managerPoli] = await db.insert(users).values({
      name: "dr. Nadya Prameswari - Manager Poliklinik Terpadu",
      email: "manager.poli@rshs.go.id",
      passwordHash,
      role: "admin",
      phone: "081122334455",
      city: "Bandung",
      avatarUrl: "https://i.pravatar.cc/150?img=68",
    }).returning();

    const [petugasPoli] = await db.insert(users).values({
      name: "Siti Nurhaliza - Petugas Poli Kemuning",
      email: "petugas.poli@rshs.go.id",
      passwordHash,
      role: "operator",
      phone: "081234567890",
      city: "Bandung",
      avatarUrl: "https://i.pravatar.cc/150?img=32",
    }).returning();

    const [pasien] = await db.insert(users).values({
      name: "Asep Surasep - Pasien BPJS RSHS",
      email: "pasien@rshs.go.id",
      passwordHash,
      role: "customer",
      phone: "082112345678",
      city: "Bandung",
      avatarUrl: "https://i.pravatar.cc/150?img=59",
    }).returning();

    const locationSeeds = [
      {
        name: "RSUP Dr. Hasan Sadikin - Poliklinik Terpadu Kemuning",
        description: "Pusat layanan rawat jalan RSHS Bandung untuk pasien BPJS dan umum. Melayani poli spesialis penyakit dalam, jantung, anak, bedah, mata, THT, saraf, obgyn, paru, kulit, urologi, orthopedi, dan layanan prioritas.",
        address: "Jl. Pasteur No.38, Gedung Kemuning Lt.2, Kota Bandung, Jawa Barat 40161",
        latitude: -6.8936,
        longitude: 107.6020,
        openingTime: "07:00",
        closingTime: "16:00",
        totalCounters: 8,
        quotaPerDay: 500,
        avgServiceTime: 12,
        imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200",
        services: [
          ["Poli Penyakit Dalam", "Konsultasi penyakit dalam, diabetes, hipertensi, ginjal", 12, 80],
          ["Poli Jantung & Pembuluh Darah", "Konsultasi jantung, EKG, echo, kontrol pasca rawat", 15, 60],
          ["Poli Anak", "Konsultasi anak, imunisasi, tumbuh kembang", 12, 70],
          ["Poli Mata", "Katarak, glaukoma, retina, refraksi", 10, 60],
          ["Poli Saraf", "Stroke, epilepsi, nyeri kepala, saraf perifer", 14, 50],
          ["Layanan Prioritas", "Lansia, ibu hamil, disabilitas, bayi", 8, 100],
        ],
      },
      {
        name: "RSHS - Instalasi Gawat Darurat 24 Jam",
        description: "IGD 24 jam RSHS dengan layanan triase, resusitasi, observasi, IGD anak, IGD dewasa, dan kebidanan PONEK.",
        address: "Jl. Pasteur No.38, Pintu IGD RSHS Bandung",
        latitude: -6.8945,
        longitude: 107.6015,
        openingTime: "00:00",
        closingTime: "23:59",
        totalCounters: 6,
        quotaPerDay: 300,
        avgServiceTime: 15,
        imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200",
        services: [
          ["Triase IGD Dewasa", "Pemeriksaan awal kegawatdaruratan dewasa", 15, 80],
          ["Triase IGD Anak", "Pemeriksaan awal kegawatdaruratan anak", 15, 70],
          ["IGD Kebidanan PONEK", "Kegawatdaruratan ibu hamil dan persalinan", 20, 40],
          ["Resusitasi", "Kasus merah dan prioritas emergensi", 25, 30],
        ],
      },
      {
        name: "RSHS - Radiologi & Laboratorium Terpadu",
        description: "Layanan penunjang diagnostik RSHS: X-Ray digital, CT-Scan, MRI, USG, laboratorium darah rutin, kimia klinik, dan mikrobiologi.",
        address: "Jl. Pasteur No.38, Gedung Diagnostik Terpadu RSHS Bandung",
        latitude: -6.8938,
        longitude: 107.6018,
        openingTime: "07:00",
        closingTime: "19:00",
        totalCounters: 6,
        quotaPerDay: 250,
        avgServiceTime: 10,
        imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200",
        services: [
          ["X-Ray Digital", "Foto thorax dan ekstremitas", 8, 80],
          ["CT-Scan", "CT kepala, thorax, abdomen", 20, 40],
          ["MRI", "MRI otak, spine, dan sendi", 35, 25],
          ["Laboratorium Darah", "Darah rutin dan kimia klinik", 10, 100],
        ],
      },
      {
        name: "RSHS - Farmasi Rawat Jalan",
        description: "Layanan farmasi BPJS dan umum untuk pasien rawat jalan RSHS. Tersedia jalur obat racikan dan non-racikan.",
        address: "Jl. Pasteur No.38, Instalasi Farmasi Rawat Jalan RSHS Bandung",
        latitude: -6.8940,
        longitude: 107.6022,
        openingTime: "07:00",
        closingTime: "22:00",
        totalCounters: 6,
        quotaPerDay: 400,
        avgServiceTime: 8,
        imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1200",
        services: [
          ["Farmasi BPJS Non-Racikan", "Pengambilan obat BPJS non-racikan", 8, 160],
          ["Farmasi BPJS Racikan", "Pengambilan obat BPJS racikan", 18, 120],
          ["Farmasi Umum", "Pengambilan obat pasien umum", 7, 80],
          ["Informasi Obat", "Konseling dan informasi obat", 10, 40],
        ],
      },
      {
        name: "RSHS - Paviliun Parahyangan (Eksekutif)",
        description: "Layanan rawat jalan eksekutif dengan kenyamanan premium. Ruang tunggu VIP, dokter senior, dan layanan personal untuk pasien umum dan asuransi.",
        address: "Jl. Pasteur No.38, Paviliun Parahyangan RSHS Bandung",
        latitude: -6.8942,
        longitude: 107.6025,
        openingTime: "08:00",
        closingTime: "20:00",
        totalCounters: 4,
        quotaPerDay: 150,
        avgServiceTime: 20,
        imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200",
        services: [
          ["Poli Eksekutif Penyakit Dalam", "Konsultasi penyakit dalam premium", 20, 50],
          ["Poli Eksekutif Jantung", "Konsultasi jantung dengan dokter senior", 25, 40],
          ["Poli Eksekutif Anak", "Konsultasi anak tumbuh kembang", 20, 45],
          ["Medical Check Up", "Pemeriksaan kesehatan lengkap", 60, 20],
        ],
      },
    ];

    const allServiceIds: string[] = [];
    const locationIds: string[] = [];

    for (const loc of locationSeeds) {
      const [insertedLocation] = await db.insert(locations).values({
        name: loc.name,
        category: "hospital",
        description: loc.description,
        address: loc.address,
        city: "Bandung",
        latitude: loc.latitude,
        longitude: loc.longitude,
        openingTime: loc.openingTime,
        closingTime: loc.closingTime,
        totalCounters: loc.totalCounters,
        quotaPerDay: loc.quotaPerDay,
        imageUrl: loc.imageUrl,
        ownerId: managerPoli.id,
        avgServiceTime: loc.avgServiceTime,
      }).returning();

      locationIds.push(insertedLocation.id);

      const serviceRows = loc.services.map(([name, description, durationAvg, quota]) => ({
        locationId: insertedLocation.id,
        name: String(name),
        description: String(description),
        durationAvg: Number(durationAvg),
        quota: Number(quota),
        price: 0,
      }));
      const insertedServices = await db.insert(services).values(serviceRows).returning();
      allServiceIds.push(...insertedServices.map(s => s.id));

      const counterNames = loc.name.includes("Poliklinik")
        ? ["Loket Online", "Loket BPJS A", "Loket BPJS B", "Loket Umum", "Loket Prioritas", "Loket Verifikasi", "Loket Informasi", "Loket Bantuan QR"]
        : loc.name.includes("IGD")
        ? ["Triase", "IGD Dewasa", "IGD Anak", "IGD Kebidanan", "BPJS IGD", "Administrasi IGD"]
        : loc.name.includes("Farmasi")
        ? ["Farmasi BPJS A", "Farmasi BPJS B", "Obat Racikan", "Farmasi Umum", "Informasi Obat", "Penyerahan Obat"]
        : ["Pendaftaran", "Radiologi", "Laboratorium", "CT/MRI", "Pengambilan Hasil", "Informasi"];

      for (let i = 0; i < loc.totalCounters; i++) {
        await db.insert(counters).values({
          locationId: insertedLocation.id,
          name: counterNames[i] || `Loket ${i + 1}`,
          operatorId: i < 2 ? petugasPoli.id : null,
          status: "active",
        });
      }
    }

    // Buat antrean awal untuk pasien agar dashboard pasien tidak kosong.
    const poliLocationId = locationIds[0];
    const poliService = await db.select().from(services).where(eq(services.locationId, poliLocationId)).limit(1);
    if (poliService[0]) {
      await db.insert(queues).values({
        ticketNumber: "P042",
        locationId: poliLocationId,
        serviceId: poliService[0].id,
        customerId: pasien.id,
        status: "waiting",
        estimatedWaitMinutes: 18,
        position: 4,
        qrCode: `RSHS-${Date.now()}-P042-AKSES`,
        isQrUsed: false,
      });
    }

    // Antrean tambahan untuk data operasional.
    const allLocations = await db.select().from(locations);
    const allServices = await db.select().from(services);
    for (let i = 0; i < 28; i++) {
      const loc = allLocations[i % allLocations.length];
      const locServices = allServices.filter(s => s.locationId === loc.id);
      const svc = locServices[i % locServices.length];
      const prefix = loc.name.includes("IGD") ? "I" : loc.name.includes("Farmasi") ? "F" : loc.name.includes("Radiologi") ? "R" : "P";
      const statuses = ["waiting", "waiting", "called", "checked_in", "serving", "completed"] as const;
      const status = statuses[i % statuses.length];
      await db.insert(queues).values({
        ticketNumber: `${prefix}${String(100 + i).padStart(3, "0")}`,
        locationId: loc.id,
        serviceId: svc.id,
        customerId: pasien.id,
        status,
        estimatedWaitMinutes: 8 + (i % 6) * 5,
        position: i + 1,
        qrCode: `RSHS-${Date.now()}-${prefix}${i}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        isQrUsed: ["checked_in", "serving", "completed"].includes(status),
        createdAt: new Date(Date.now() - (i % 48) * 60 * 60 * 1000),
      });
    }

    const completedQueue = await db.select().from(queues).where(eq(queues.status, "completed")).limit(1);
    if (completedQueue[0]) {
      await db.insert(ratings).values({
        queueId: completedQueue[0].id,
        customerId: pasien.id,
        locationId: completedQueue[0].locationId,
        rating: 5,
        comment: "Pelayanan Poliklinik RSHS lebih tertib. Ambil nomor dari rumah, datang sesuai estimasi, dan check-in QR sangat membantu.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Data login real RSHS berhasil dibuat",
      password: DEFAULT_PASSWORD,
      accounts: [
        { role: "Pasien", email: "pasien@rshs.go.id" },
        { role: "Direktur / Super Admin", email: "direktur@rshs.go.id" },
        { role: "Manager Poli", email: "manager.poli@rshs.go.id" },
        { role: "Petugas Poli / Operator", email: "petugas.poli@rshs.go.id" },
      ],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat data RSHS", details: String(error) }, { status: 500 });
  }
}
