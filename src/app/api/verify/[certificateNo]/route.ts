import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ certificateNo: string }> }) {
  const { certificateNo } = await params;
  const certificate = await db.certificate.findUnique({ where: { certificateNo }, include: { application: { include: { applicant: true, instrument: true } } } });
  if (!certificate) return NextResponse.json({ valid: false, error: "Certificate not found." }, { status: 404 });

  const canonicalData = JSON.stringify({ certificateNo: certificate.certificateNo, applicationId: certificate.applicationId, validFrom: certificate.validFrom.toISOString(), validUntil: certificate.validUntil.toISOString(), qrPayload: certificate.qrPayload });
  const hashMatches = createHash("sha256").update(canonicalData).digest("hex") === certificate.dataHash;
  const active = certificate.status === "ACTIVE" && certificate.validUntil >= new Date();
  return NextResponse.json({ valid: hashMatches && active, hashMatches, status: certificate.status, certificateNo: certificate.certificateNo, holder: certificate.application.applicant.legalName, instrument: certificate.application.instrument.category, validFrom: certificate.validFrom, validUntil: certificate.validUntil });
}
