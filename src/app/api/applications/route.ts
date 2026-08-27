import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

type Submission = {
  legalName?: string;
  registrationNo?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  serialNumber?: string;
  category?: string;
  serviceType?: string;
  clientId?: string;
};

function validCoordinate(value: unknown, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

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

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const body = await request.json() as Submission;
  const required = [body.legalName, body.contactName, body.email, body.phone, body.address, body.serialNumber, body.category, body.serviceType];
  if (required.some((value) => typeof value !== "string" || !value.trim()) || !validCoordinate(body.latitude, -90, 90) || !validCoordinate(body.longitude, -180, 180)) {
    return NextResponse.json({ error: "Complete applicant, instrument, and location details are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email!)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  if (body.clientId) {
    const existing = await db.inspection.findFirst({ where: { clientId: body.clientId, application: { workspaceId: user.workspaceId } }, include: { application: true } });
    if (existing) return NextResponse.json({ application: existing.application, inspection: existing, replayed: true }, { status: 200 });
  }

  let nearestCentre: { id: string; name: string } | undefined;
  let nearestInspector: { id: string } | undefined;
  try {
    [nearestCentre] = await db.$queryRaw<Array<{ id: string; name: string }>>(Prisma.sql`SELECT "id", "name" FROM "TestCentre" WHERE "workspaceId" = ${user.workspaceId} AND "active" = true AND "latitude" IS NOT NULL AND "longitude" IS NOT NULL ORDER BY ST_DistanceSphere(ST_MakePoint("longitude"::double precision, "latitude"::double precision), ST_MakePoint(${body.longitude}, ${body.latitude})) LIMIT 1`);
    [nearestInspector] = await db.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT u."id" FROM "User" u JOIN "Role" r ON r."id" = u."roleId" WHERE u."workspaceId" = ${user.workspaceId} AND u."active" = true AND r."code" = 'INSPECTOR' AND u."latitude" IS NOT NULL AND u."longitude" IS NOT NULL ORDER BY ST_DistanceSphere(ST_MakePoint(u."longitude"::double precision, u."latitude"::double precision), ST_MakePoint(${body.longitude}, ${body.latitude})) LIMIT 1`);
  } catch {
    const [centres, inspectors] = await Promise.all([
      db.testCentre.findMany({ where: { workspaceId: user.workspaceId, active: true, latitude: { not: null }, longitude: { not: null } }, select: { id: true, name: true, latitude: true, longitude: true } }),
      db.user.findMany({ where: { workspaceId: user.workspaceId, active: true, role: { code: "INSPECTOR" }, latitude: { not: null }, longitude: { not: null } }, select: { id: true, latitude: true, longitude: true } }),
    ]);
    const distance = (latitude: number, longitude: number, otherLatitude: number, otherLongitude: number) => Math.hypot((latitude - otherLatitude) * 111, (longitude - otherLongitude) * 111 * Math.cos(latitude * Math.PI / 180));
    const centre = centres.sort((a, b) => distance(body.latitude!, body.longitude!, Number(a.latitude), Number(a.longitude)) - distance(body.latitude!, body.longitude!, Number(b.latitude), Number(b.longitude)))[0];
    const inspector = inspectors.sort((a, b) => distance(body.latitude!, body.longitude!, Number(a.latitude), Number(a.longitude)) - distance(body.latitude!, body.longitude!, Number(b.latitude), Number(b.longitude)))[0];
    nearestCentre = centre;
    nearestInspector = inspector;
  }
  const referenceNo = `LM-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const result = await db.$transaction(async (transaction) => {
    const applicant = await transaction.applicant.create({ data: { legalName: body.legalName!.trim(), registrationNo: body.registrationNo?.trim() || null, contactName: body.contactName!.trim(), email: body.email!.trim().toLowerCase(), phone: body.phone!.trim(), address: body.address!.trim(), latitude: body.latitude, longitude: body.longitude } });
    const instrument = await transaction.instrument.upsert({ where: { serialNumber: body.serialNumber!.trim() }, update: { category: body.category!.trim() }, create: { serialNumber: body.serialNumber!.trim(), category: body.category!.trim() } });
    const application = await transaction.application.create({ data: { referenceNo, workspaceId: user.workspaceId, applicantId: applicant.id, submittedById: user.id, instrumentId: instrument.id, status: nearestInspector ? "SCHEDULED" : "SUBMITTED", serviceType: body.serviceType!.trim(), submittedAt: new Date(), dueAt: nearestInspector ? new Date(Date.now() + 48 * 60 * 60 * 1000) : null, applicantLatitude: body.latitude, applicantLongitude: body.longitude } });
    const inspection = nearestInspector ? await transaction.inspection.create({ data: { applicationId: application.id, officerId: nearestInspector.id, testCentreId: nearestCentre?.id, scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000), clientId: body.clientId, syncedAt: new Date() } }) : null;
    return { application, inspection, assignedCentre: nearestCentre?.name ?? null };
  });
  return NextResponse.json(result, { status: 201 });
}