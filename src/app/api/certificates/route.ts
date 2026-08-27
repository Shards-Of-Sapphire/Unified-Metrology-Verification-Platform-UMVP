import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const certificates = await db.certificate.findMany({
    where: { application: { workspaceId: user.workspaceId } },
    include: { application: { include: { applicant: true, instrument: true } } },
    orderBy: { issuedAt: "desc" },
  });

  return NextResponse.json(certificates);
}