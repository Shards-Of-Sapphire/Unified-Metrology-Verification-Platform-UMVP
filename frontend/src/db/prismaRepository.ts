import { PrismaClient, ApplicationStatus as PrismaApplicationStatus, CertificateStatus as PrismaCertificateStatus, RoleCode } from '@prisma/client';
import type { MetrologyApplication, VerificationCertificate } from '../types.ts';

declare global {
  var _umvpPrisma: PrismaClient | undefined;
}

export const prisma = global._umvpPrisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') global._umvpPrisma = prisma;

const WORKSPACE_CODE = 'AP-LM';

const applicationStatusToPrisma: Record<string, PrismaApplicationStatus> = {
  PENDING_PAYMENT: 'DRAFT', PENDING_ALLOCATION: 'SUBMITTED', ALLOCATED: 'SCHEDULED', INSPECTION_SCHEDULED: 'SCHEDULED',
  INSPECTION_COMPLETED: 'INSPECTION', CERTIFIED: 'APPROVED', REJECTED: 'REJECTED', SUBMITTED: 'SUBMITTED',
  DOCUMENT_REVIEW: 'DOCUMENT_REVIEW', SCHEDULED: 'SCHEDULED', INSPECTION: 'INSPECTION', APPROVED: 'APPROVED',
};
const applicationStatusToUi: Record<string, MetrologyApplication['status']> = {
  DRAFT: 'PENDING_PAYMENT', SUBMITTED: 'PENDING_ALLOCATION', DOCUMENT_REVIEW: 'PENDING_ALLOCATION', SCHEDULED: 'INSPECTION_SCHEDULED',
  INSPECTION: 'INSPECTION_COMPLETED', APPROVED: 'CERTIFIED', REJECTED: 'REJECTED', REWORK: 'PENDING_ALLOCATION', EXPIRED: 'REJECTED',
};

function toIso(value: Date | null | undefined) { return value?.toISOString() || undefined; }

async function getWorkspace() {
  return prisma.workspace.upsert({ where: { code: WORKSPACE_CODE }, update: {}, create: { code: WORKSPACE_CODE, name: 'Andhra Pradesh Legal Metrology', state: 'Andhra Pradesh' } });
}

async function getOrCreateUser(email: string, name: string, roleCode: RoleCode) {
  const workspace = await getWorkspace();
  const role = await prisma.role.upsert({ where: { workspaceId_code: { workspaceId: workspace.id, code: roleCode } }, update: {}, create: { workspaceId: workspace.id, code: roleCode, name: roleCode.replaceAll('_', ' ') } });
  return prisma.user.upsert({ where: { workspaceId_email: { workspaceId: workspace.id, email } }, update: { name, roleId: role.id, active: true }, create: { workspaceId: workspace.id, roleId: role.id, name, email, passwordHash: 'managed-by-frontend-auth' } });
}

function mapApplication(row: any): MetrologyApplication {
  const inspection = row.assignments?.[0];
  return {
    id: row.id, applicationNumber: row.referenceNo, applicantId: row.applicantId, applicantName: row.applicant.contactName,
    businessName: row.applicant.legalName, maskedAadhaarOrGstin: row.applicant.registrationNo || 'NOT PROVIDED', contactEmail: row.applicant.email,
    contactPhone: row.applicant.phone, instrumentCategory: row.instrument.category as MetrologyApplication['instrumentCategory'],
    modelNumber: row.instrument.model || 'NOT PROVIDED', serialNumber: row.instrument.serialNumber, capacityOrRange: row.instrument.capacity || 'NOT PROVIDED',
    manufacturer: row.instrument.manufacturer || 'NOT PROVIDED', installationAddress: row.applicant.address, city: row.applicant.address,
    state: row.workspace.state, pincode: 'NOT PROVIDED', status: applicationStatusToUi[row.status] || 'PENDING_ALLOCATION',
    submissionDate: toIso(row.submittedAt) || row.createdAt.toISOString(), allocatedLmoId: inspection?.officerId, allocatedLmoName: inspection?.officer?.name,
    scheduledInspectionDate: toIso(inspection?.scheduledAt), fieldNotes: inspection?.observations || undefined,
    inspectionGeotag: inspection?.evidence?.[0]?.latitude && inspection?.evidence?.[0]?.longitude ? {
      latitude: Number(inspection.evidence[0].latitude), longitude: Number(inspection.evidence[0].longitude), timestamp: toIso(inspection.evidence[0].capturedAt) || '', accuracyMeters: 4,
    } : undefined,
    certificateId: row.certificate?.id, feesPaid: true, gdprConsentRecorded: true,
  };
}

const applicationInclude = {
  applicant: true, instrument: true, workspace: true, certificate: true,
  assignments: { include: { officer: true, evidence: true }, orderBy: { scheduledAt: 'desc' as const }, take: 1 },
};

export async function prismaGetApplications(role?: string, userId?: string) {
  const rows = await prisma.application.findMany({ include: applicationInclude, where: role === 'CITIZEN' && userId ? { submittedById: userId } : undefined, orderBy: { createdAt: 'desc' } });
  return rows.map(mapApplication);
}

export async function prismaCreateApplication(data: Partial<MetrologyApplication>) {
  const workspace = await getWorkspace();
  const applicant = await prisma.applicant.create({ data: { legalName: data.businessName || 'Trading Enterprise', registrationNo: data.maskedAadhaarOrGstin, contactName: data.applicantName || 'Applicant', email: data.contactEmail || 'applicant@example.com', phone: data.contactPhone || 'NOT PROVIDED', address: data.installationAddress || 'NOT PROVIDED' } });
  const instrument = await prisma.instrument.upsert({ where: { serialNumber: data.serialNumber || `SN-${Date.now()}` }, update: { category: data.instrumentCategory || 'ELECTRONIC_WEIGHING_SCALE', manufacturer: data.manufacturer, model: data.modelNumber, capacity: data.capacityOrRange }, create: { serialNumber: data.serialNumber || `SN-${Date.now()}`, category: data.instrumentCategory || 'ELECTRONIC_WEIGHING_SCALE', manufacturer: data.manufacturer, model: data.modelNumber, capacity: data.capacityOrRange } });
  const submittedBy = await getOrCreateUser(data.contactEmail || 'applicant@example.com', data.applicantName || 'Applicant', 'APPLICANT');
  const row = await prisma.application.create({ data: { referenceNo: data.applicationNumber || `UMVP/${Date.now()}`, workspaceId: workspace.id, applicantId: applicant.id, submittedById: submittedBy.id, instrumentId: instrument.id, status: applicationStatusToPrisma[data.status || 'PENDING_ALLOCATION'], serviceType: 'Verification and stamping', submittedAt: data.submissionDate ? new Date(data.submissionDate) : new Date() }, include: applicationInclude });
  return mapApplication(row);
}

export async function prismaUpdateApplication(id: string, data: Partial<MetrologyApplication>) {
  const legacyData = data as Partial<MetrologyApplication> & { allocatedLmoId?: string; allocatedLmoName?: string; scheduledInspectionDate?: string; fieldNotes?: string; inspectionGeotag?: MetrologyApplication['inspectionGeotag'] };
  await prisma.application.update({ where: { id }, data: { status: data.status ? applicationStatusToPrisma[data.status] : undefined } });

  if (legacyData.allocatedLmoId || legacyData.scheduledInspectionDate || legacyData.fieldNotes || legacyData.inspectionGeotag) {
    const officer = await getOrCreateUser(`${legacyData.allocatedLmoId || 'lmo'}@umvp.local`, legacyData.allocatedLmoName || 'Legal Metrology Officer', 'DISTRICT_LMO');
    const existingInspection = await prisma.inspection.findFirst({ where: { applicationId: id }, orderBy: { createdAt: 'desc' } });
    const inspection = existingInspection
      ? await prisma.inspection.update({ where: { id: existingInspection.id }, data: { officerId: officer.id, scheduledAt: legacyData.scheduledInspectionDate ? new Date(legacyData.scheduledInspectionDate) : undefined, observations: legacyData.fieldNotes } })
      : await prisma.inspection.create({ data: { applicationId: id, officerId: officer.id, status: 'ASSIGNED', scheduledAt: legacyData.scheduledInspectionDate ? new Date(legacyData.scheduledInspectionDate) : new Date(), observations: legacyData.fieldNotes } });
    if (legacyData.inspectionGeotag) {
      await prisma.inspectionEvidence.create({ data: { inspectionId: inspection.id, fileKey: 'frontend-geotag', latitude: legacyData.inspectionGeotag.latitude, longitude: legacyData.inspectionGeotag.longitude, capturedAt: new Date(legacyData.inspectionGeotag.timestamp || Date.now()) } });
    }
  }

  const row = await prisma.application.findUniqueOrThrow({ where: { id }, include: applicationInclude });
  return mapApplication(row);
}

export async function prismaGetCertificates() {
  const rows = await prisma.certificate.findMany({ include: { application: { include: { applicant: true, instrument: true } }, issuer: true }, orderBy: { issuedAt: 'desc' } });
  return rows.map((row) => ({ id: row.id, certificateNumber: row.certificateNo, applicationId: row.applicationId, instrumentCategory: row.application.instrument.category as VerificationCertificate['instrumentCategory'], modelNumber: row.application.instrument.model || 'NOT PROVIDED', serialNumber: row.application.instrument.serialNumber, ownerName: row.application.applicant.contactName, businessName: row.application.applicant.legalName, installationAddress: row.application.applicant.address, issuingLmoId: row.issuerId, issuingLmoName: row.issuer.name, issuingLmoBadge: 'DATABASE-ISSUER', jurisdiction: 'Andhra Pradesh', issuedAt: row.issuedAt.toISOString(), validUntil: row.validUntil.toISOString(), sealNumber: 'DATABASE-CERTIFICATE', hmacSignature: row.dataHash, qrPayload: row.qrPayload, tamperProofHash: row.dataHash, status: row.status as VerificationCertificate['status'] }));
}

export async function prismaGetCertificateById(id: string) { return (await prismaGetCertificates()).find((certificate) => certificate.id === id || certificate.certificateNumber === id) || null; }

export async function prismaCreateCertificate(data: Partial<VerificationCertificate>) {
  const application = await prisma.application.findUniqueOrThrow({ where: { id: data.applicationId } });
  const issuer = await getOrCreateUser(data.issuingLmoId ? `${data.issuingLmoId}@umvp.local` : 'lmo@umvp.gov.in', data.issuingLmoName || 'Legal Metrology Officer', 'DISTRICT_LMO');
  await prisma.certificate.create({ data: { id: data.id, certificateNo: data.certificateNumber || `CERT-${Date.now()}`, applicationId: application.id, issuerId: issuer.id, validFrom: data.issuedAt ? new Date(data.issuedAt) : new Date(), validUntil: data.validUntil ? new Date(data.validUntil) : new Date(Date.now() + 31536000000), qrPayload: data.qrPayload || `https://umvp.gov.in/verify/${data.id}`, dataHash: data.tamperProofHash || data.hmacSignature || `hash-${Date.now()}`, status: (data.status || 'ACTIVE') as PrismaCertificateStatus } });
  return prismaGetCertificateById(data.id!);
}