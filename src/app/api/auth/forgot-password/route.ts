import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json({ error: "Email dan password baru wajib diisi" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    // Cek apakah email ada
    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
    
    if (existing.length === 0) {
      // Untuk keamanan, tetap return success tapi tidak update apa-apa
      return NextResponse.json({ 
        success: true, 
        message: "Jika email terdaftar, instruksi reset password telah dikirim." 
      });
    }

    // Update password
    const passwordHash = await hashPassword(newPassword);
    await db.update(users)
      .set({ passwordHash })
      .where(eq(users.email, email.toLowerCase().trim()));

    return NextResponse.json({ 
      success: true, 
      message: "Password berhasil direset. Silakan login dengan password baru." 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan. Silakan coba lagi." }, { status: 500 });
  }
}
