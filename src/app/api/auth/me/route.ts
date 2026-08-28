import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    active: user.active,
    role: user.role.code,
    permissions: user.role.permissions.map(({ permission }) => permission.code),
    workspace: user.workspace,
  });
}