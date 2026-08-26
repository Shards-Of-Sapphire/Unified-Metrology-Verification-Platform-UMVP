import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (typeof email !== "string" || typeof password !== "string") return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  const user = await db.user.findFirst({ where: { email: email.toLowerCase().trim(), active: true } });
  if (!user || !verifyPassword(password, user.passwordHash)) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}