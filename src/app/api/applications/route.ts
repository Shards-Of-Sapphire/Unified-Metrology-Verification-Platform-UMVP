import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const applications = await db.application.findMany({
    where: { workspaceId: user.workspaceId },
    include: { applicant: true, instrument: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(applications);
}