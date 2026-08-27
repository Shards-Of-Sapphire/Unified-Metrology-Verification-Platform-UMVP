import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const workspaceId = user.workspaceId;
  const [openApplications, dueThisWeek, certificatesIssued, pendingReview, applications] = await Promise.all([
    db.application.count({ where: { workspaceId, status: { notIn: ["APPROVED", "REJECTED", "EXPIRED"] } } }),
    db.application.count({ where: { workspaceId, dueAt: { gte: new Date(), lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } } }),
    db.certificate.count({ where: { application: { workspaceId } } }),
    db.application.count({ where: { workspaceId, status: "DOCUMENT_REVIEW" } }),
    db.application.findMany({ where: { workspaceId }, include: { applicant: true, instrument: true }, orderBy: { dueAt: "asc" }, take: 6 }),
  ]);

  return NextResponse.json({ metrics: { openApplications, dueThisWeek, certificatesIssued, pendingReview }, applications });
}