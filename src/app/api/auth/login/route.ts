import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { DEFAULT_RSHS_PASSWORD, ensureDefaultRshsAccount, isDefaultRshsEmail } from "@/lib/default-accounts";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Format request tidak valid" }, { status: 400 });
    }

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const remember = Boolean(body.remember ?? false);

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    // Jika akun resmi RSHS belum tersedia karena database baru, buat otomatis tanpa menampilkan demo di UI.
    if (isDefaultRshsEmail(email)) {
      // Pastikan 4 akun resmi RSHS selalu sesuai README, termasuk jika DB masih menyimpan password lama.
      await ensureDefaultRshsAccount(email, true);
    }

    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = result[0];

    if (!user) {
      return NextResponse.json({ error: "Email belum terdaftar. Pasien baru dapat mendaftar melalui halaman registrasi." }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      const hint = isDefaultRshsEmail(email) ? `Password akun resmi adalah ${DEFAULT_RSHS_PASSWORD}` : "Periksa kembali password Anda";
      return NextResponse.json({ error: "Password salah", hint }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Akun dinonaktifkan. Hubungi administrator RSHS." }, { status: 403 });
    }

    const token = await setSessionCookie(user.id, user.role, remember);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return NextResponse.json({ error: "Gagal login. Koneksi database sedang bermasalah, coba beberapa saat lagi." }, { status: 500 });
  }
}
