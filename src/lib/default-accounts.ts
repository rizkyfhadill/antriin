import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const DEFAULT_RSHS_PASSWORD = "RSHS@2026";

export const DEFAULT_RSHS_ACCOUNTS = [
  {
    name: "Asep Surasep - Pasien BPJS RSHS",
    email: "pasien@rshs.go.id",
    role: "customer" as const,
    phone: "082112345678",
    city: "Bandung",
    avatarUrl: "https://i.pravatar.cc/150?img=59",
  },
  {
    name: "Dr. RSHS Direktur Utama",
    email: "direktur@rshs.go.id",
    role: "super_admin" as const,
    phone: "0222032214",
    city: "Bandung",
    avatarUrl: "https://i.pravatar.cc/150?img=60",
  },
  {
    name: "dr. Nadya Prameswari - Manager Poliklinik Terpadu",
    email: "manager.poli@rshs.go.id",
    role: "admin" as const,
    phone: "081122334455",
    city: "Bandung",
    avatarUrl: "https://i.pravatar.cc/150?img=68",
  },
  {
    name: "Siti Nurhaliza - Petugas Poli Kemuning",
    email: "petugas.poli@rshs.go.id",
    role: "operator" as const,
    phone: "081234567890",
    city: "Bandung",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
  },
];

export function isDefaultRshsEmail(email: string) {
  return DEFAULT_RSHS_ACCOUNTS.some((account) => account.email === email.toLowerCase().trim());
}

export async function ensureDefaultRshsAccount(email: string, syncPassword = false) {
  const normalizedEmail = email.toLowerCase().trim();
  const account = DEFAULT_RSHS_ACCOUNTS.find((item) => item.email === normalizedEmail);
  if (!account) return null;

  const passwordHash = syncPassword ? await hashPassword(DEFAULT_RSHS_PASSWORD) : null;
  const existing = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);

  if (existing[0]) {
    const updated = await db
      .update(users)
      .set({
        name: account.name,
        role: account.role,
        phone: account.phone,
        city: account.city,
        avatarUrl: account.avatarUrl,
        isActive: true,
        ...(passwordHash ? { passwordHash } : {}),
      })
      .where(eq(users.email, normalizedEmail))
      .returning();
    return updated[0];
  }

  const newPasswordHash = passwordHash ?? await hashPassword(DEFAULT_RSHS_PASSWORD);
  const inserted = await db
    .insert(users)
    .values({
      name: account.name,
      email: account.email,
      passwordHash: newPasswordHash,
      role: account.role,
      phone: account.phone,
      city: account.city,
      avatarUrl: account.avatarUrl,
      isActive: true,
    })
    .returning();

  return inserted[0];
}
