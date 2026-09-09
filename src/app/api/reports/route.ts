import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const reports = await db.report.findMany({ where: { workspaceId: user.workspaceId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(reports);
}