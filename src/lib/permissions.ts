import type { RoleCode } from "@prisma/client";
import { hasPermission } from "@/lib/auth";

export const permissions = {
  applicationsRead: "applications.read",
  applicationsWrite: "applications.write",

  inspectionsRead: "inspections.read",
  inspectionsWrite: "inspections.write",

  certificatesRead: "certificates.read",
  certificatesIssue: "certificates.issue",

  reportsRead: "reports.read",
  reportsCreate: "reports.create",

  usersManage: "users.manage",
} as const;

export type PermissionCode =
  (typeof permissions)[keyof typeof permissions];

export function can(
  user: Awaited<ReturnType<typeof import("@/lib/auth").getCurrentUser>>,
  permission: PermissionCode,
) {
  return hasPermission(user, permission);
}

export function isRole(
  user: Awaited<ReturnType<typeof import("@/lib/auth").getCurrentUser>>,
  role: RoleCode,
) {
  return user?.role.code === role;
}