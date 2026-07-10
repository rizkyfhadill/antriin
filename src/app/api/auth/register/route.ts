import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Format request tidak valid" }, { status: 400 });
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const phone = String(body.phone || "").trim() || null;
    const city = String(body.city || "Bandung").trim() || "Bandung";

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nama, email, dan password wajib diisi" }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email sudah terdaftar. Silakan login menggunakan akun tersebut." }, { status: 400 });
    }

    // Register publik hanya untuk pasien/customer.
    // Akun direktur, manager poli, dan petugas poli dibuat administrator/seed internal.
    const passwordHash = await hashPassword(password);
    const inserted = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        role: "customer",
        phone,
        city,
      })
      .returning();

    const user = inserted[0];
    const token = await setSessionCookie(user.id, user.role);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
      },
    });
  } catch (error) {
    console.error("REGISTER_ERROR", error);
    return NextResponse.json({ error: "Gagal registrasi. Koneksi database sedang bermasalah, coba beberapa saat lagi." }, { status: 500 });
  }
}
