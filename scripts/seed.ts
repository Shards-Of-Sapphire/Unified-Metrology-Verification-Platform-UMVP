import { createHash, randomBytes, scryptSync } from "node:crypto";
import { PrismaClient, RoleCode } from "@prisma/client";

const db = new PrismaClient();
const passwordHash = (password: string) => { const salt = randomBytes(16).toString("hex"); return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`; };

async function main() {
  const workspace = await db.workspace.upsert({ where: { code: "AP-LM" }, update: {}, create: { code: "AP-LM", name: "Andhra Pradesh Legal Metrology", state: "Andhra Pradesh" } });
  const permissions = ["applications.read", "applications.write", "inspections.read", "inspections.write", "certificates.read", "certificates.issue", "reports.read", "reports.create", "users.manage"].map((code) => ({ code, description: `Permission to ${code.replace(".", " ")}` }));
  for (const permission of permissions) await db.permission.upsert({ where: { code: permission.code }, update: {}, create: permission });
  const rolePermissions: Record<RoleCode, string[]> = {
    SUPER_ADMIN: permissions.map(({ code }) => code), STATE_ADMIN: permissions.map(({ code }) => code).filter((code) => code !== "users.manage"), DISTRICT_LMO: ["applications.read", "applications.write", "inspections.read", "inspections.write", "certificates.read", "reports.read"], GATC_MANAGER: ["applications.read", "inspections.read", "inspections.write", "certificates.read"], INSPECTOR: ["applications.read", "inspections.read", "inspections.write", "certificates.read"], APPLICANT: ["applications.read", "applications.write", "certificates.read"], AUDITOR: ["applications.read", "inspections.read", "certificates.read", "reports.read"],
  };
  for (const [code, codes] of Object.entries(rolePermissions)) {
    const role = await db.role.upsert({ where: { workspaceId_code: { workspaceId: workspace.id, code: code as RoleCode } }, update: {}, create: { workspaceId: workspace.id, code: code as RoleCode, name: code.replaceAll("_", " ") } });
    for (const permissionCode of codes) { const permission = await db.permission.findUniqueOrThrow({ where: { code: permissionCode } }); await db.rolePermission.upsert({ where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } }, update: {}, create: { roleId: role.id, permissionId: permission.id } }); }
  }
  const accounts = [["admin@umvp.gov.in", "Ministry Admin", "SUPER_ADMIN"], ["lmo@umvp.gov.in", "Ananya Sharma", "DISTRICT_LMO"], ["inspector@umvp.gov.in", "Ravi Kumar", "INSPECTOR"], ["applicant@umvp.gov.in", "Demo Applicant", "APPLICANT"]] as const;
  for (const [email, name, code] of accounts) { const role = await db.role.findUniqueOrThrow({ where: { workspaceId_code: { workspaceId: workspace.id, code } } }); await db.user.upsert({ where: { workspaceId_email: { workspaceId: workspace.id, email } }, update: { roleId: role.id, active: true }, create: { workspaceId: workspace.id, roleId: role.id, name, email, passwordHash: passwordHash("ChangeMe123!") } }); }
  const lmo = await db.user.findUniqueOrThrow({ where: { workspaceId_email: { workspaceId: workspace.id, email: "lmo@umvp.gov.in" } } });
  const inspector = await db.user.findUniqueOrThrow({ where: { workspaceId_email: { workspaceId: workspace.id, email: "inspector@umvp.gov.in" } } });
  const applicantData = [
    ["Ravi Engineering Works", "REG-AP-24081", "Ravi Mehta", "ravi@example.com", "9000000001", "Hyderabad"],
    ["Aarav Retail Pvt. Ltd.", "REG-AP-24078", "Aarav Shah", "aarav@example.com", "9000000002", "Secunderabad"],
    ["Sree Lakshmi Traders", "REG-AP-24074", "Lakshmi Devi", "lakshmi@example.com", "9000000003", "Warangal"],
    ["Metro Cold Storage", "REG-AP-24069", "Meera Rao", "meera@example.com", "9000000004", "Medchal"],
    ["Gowtham Fuels", "REG-AP-24064", "Gowtham Reddy", "gowtham@example.com", "9000000005", "Hyderabad"],
  ] as const;
  const applicants = new Map<string, string>();
  for (const [legalName, registrationNo, contactName, email, phone, address] of applicantData) {
    const record = await db.applicant.findFirst({ where: { legalName } }) ?? await db.applicant.create({ data: { legalName, registrationNo, contactName, email, phone, address } });
    applicants.set(legalName, record.id);
  }
  const instrumentData = [
    ["Platform scale", "INS-PL-24081"],
    ["Retail weighing scale", "INS-RW-24078"],
    ["Fuel dispenser", "INS-FD-24074"],
    ["Temperature recorder", "INS-TR-24069"],
  ] as const;
  const instruments = new Map<string, string>();
  for (const [category, serialNumber] of instrumentData) {
    const record = await db.instrument.upsert({ where: { serialNumber }, update: { category }, create: { serialNumber, category } });
    instruments.set(category, record.id);
  }
  const applicationData = [
    ["LM-24081", "Ravi Engineering Works", "Platform scale", "SCHEDULED", "2026-08-25T10:30:00.000Z"],
    ["LM-24078", "Aarav Retail Pvt. Ltd.", "Retail weighing scale", "SCHEDULED", "2026-08-25T14:00:00.000Z"],
    ["LM-24074", "Sree Lakshmi Traders", "Fuel dispenser", "SCHEDULED", "2026-08-26T09:00:00.000Z"],
    ["LM-24069", "Metro Cold Storage", "Temperature recorder", "DOCUMENT_REVIEW", "2026-08-25T11:30:00.000Z"],
    ["LM-24064", "Gowtham Fuels", "Fuel dispenser", "INSPECTION", "2026-08-24T15:00:00.000Z"],
  ] as const;
  const applications = new Map<string, string>();
  for (const [referenceNo, legalName, category, status, dueAt] of applicationData) {
    const record = await db.application.upsert({
      where: { referenceNo },
      update: { status, dueAt: new Date(dueAt) },
      create: { referenceNo, workspaceId: workspace.id, applicantId: applicants.get(legalName)!, submittedById: lmo.id, instrumentId: instruments.get(category)!, status, serviceType: "Verification and stamping", submittedAt: new Date("2026-08-20T09:00:00.000Z"), dueAt: new Date(dueAt) },
    });
    applications.set(referenceNo, record.id);
  }
  const testCentre = await db.testCentre.upsert({ where: { accreditationNo: "GATC-AP-001" }, update: {}, create: { workspaceId: workspace.id, name: "Hyderabad Government Approved Test Centre", accreditationNo: "GATC-AP-001", address: "Industrial Estate, Hyderabad" } });
  const inspectionData = [["LM-24081", "ASSIGNED", "2026-08-25T10:30:00.000Z"], ["LM-24078", "ASSIGNED", "2026-08-25T14:00:00.000Z"], ["LM-24064", "REVIEWED", "2026-08-24T15:00:00.000Z"]] as const;
  for (const [referenceNo, status, scheduledAt] of inspectionData) {
    const existing = await db.inspection.findFirst({ where: { applicationId: applications.get(referenceNo)! } });
    if (existing) await db.inspection.update({ where: { id: existing.id }, data: { status, scheduledAt, officerId: inspector.id, testCentreId: testCentre.id } });
    else await db.inspection.create({ data: { applicationId: applications.get(referenceNo)!, officerId: inspector.id, testCentreId: testCentre.id, status, scheduledAt } });
  }
  const certificateData = [["LM-24081", "LM-2026-000184"], ["LM-24064", "LM-2026-000183"], ["LM-24078", "LM-2026-000177"]] as const;
  for (const [referenceNo, certificateNo] of certificateData) {
    const applicationId = applications.get(referenceNo)!;
    const validFrom = new Date("2026-08-25T00:00:00.000Z");
    const validUntil = new Date("2027-08-25T00:00:00.000Z");
    const qrPayload = `https://umvp.gov.in/verify/${certificateNo}`;
    const dataHash = createHash("sha256").update(JSON.stringify({ certificateNo, applicationId, validFrom: validFrom.toISOString(), validUntil: validUntil.toISOString(), qrPayload })).digest("hex");
    await db.certificate.upsert({ where: { certificateNo }, update: { dataHash }, create: { certificateNo, applicationId, issuerId: lmo.id, validFrom, validUntil, qrPayload, dataHash } });
  }
  const reportData = [["PENDENCY", "reports/pendency.pdf"], ["CERTIFICATE_ACTIVITY", "reports/certificates-august.pdf"], ["INSPECTION_PERFORMANCE", "reports/inspection-performance.pdf"]] as const;
  for (const [type, fileKey] of reportData) {
    const existing = await db.report.findFirst({ where: { workspaceId: workspace.id, type, fileKey } });
    if (!existing) await db.report.create({ data: { workspaceId: workspace.id, requestedById: lmo.id, type, status: "READY", fileKey, completedAt: new Date("2026-08-25T12:00:00.000Z") } });
  }
  console.log("Seeded UMVP roles, demo logins, and operational records. Password: ChangeMe123!");
}

main().finally(() => db.$disconnect());