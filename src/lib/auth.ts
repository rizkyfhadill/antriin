import bcrypt from "bcryptjs";
import * as jose from "jose";
import { cookies, headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "antriin-super-secret-key-2024-navy-blue-strong");
const COOKIE_NAME = "antriin_session";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
export async function signJWT(payload: any, expiresIn: string = "7d") {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}
export async function verifyJWT(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as any;
  } catch {
    return null;
  }
}
export async function setSessionCookie(userId: string, role: string, remember: boolean = false) {
  const expires = remember ? "30d" : "7d";
  const token = await signJWT({ userId, role }, expires);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
  });
  return token;
}
export async function getSession() {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get(COOKIE_NAME)?.value;

    // Fallback: Baca dari Authorization header jika browser memblokir cookies di dalam iframe / sandbox preview
    if (!token) {
      const headersList = await headers();
      const authHeader = headersList.get("Authorization") || headersList.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;
    const payload = await verifyJWT(token);
    if (!payload) return null;
    const userId = payload.userId as string;
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user[0]) return null;
    return { ...payload, user: user[0] };
  } catch {
    return null;
  }
}
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
export function getRoleLabel(role: string) {
  const map: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    operator: "Operator",
    customer: "Customer",
  };
  return map[role] || role;
}
