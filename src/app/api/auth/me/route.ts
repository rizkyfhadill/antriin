import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const u = session.user as any;
  return NextResponse.json({ user: { id: u.id, name: u.name, email: u.email, role: u.role, avatarUrl: u.avatarUrl, phone: u.phone, city: u.city } });
}
