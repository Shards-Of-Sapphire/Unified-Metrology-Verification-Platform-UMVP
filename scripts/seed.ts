import { randomBytes, scryptSync } from "node:crypto";
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
  console.log("Seeded UMVP roles and demo logins. Password: ChangeMe123!");
}

main().finally(() => db.$disconnect());