import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const sessionCookie = "umvp_session";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  return derived.length === Buffer.from(hash, "hex").length && timingSafeEqual(derived, Buffer.from(hash, "hex"));
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  await db.session.create({ data: { tokenHash: hashSessionToken(token), userId, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8) } });
  (await cookies()).set(sessionCookie, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({ where: { tokenHash: hashSessionToken(token) }, include: { user: { include: { role: { include: { permissions: { include: { permission: true } } } }, workspace: true } } } });
  if (!session || session.expiresAt < new Date() || !session.user.active) return null;
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export function hasPermission(user: Awaited<ReturnType<typeof getCurrentUser>>, permission: string) {
  return Boolean(user?.role.permissions.some(({ permission: item }) => item.code === permission));
}