import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function ApplicationsRoute() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const routes: Record<string, string> = { APPLICANT: "/user/applications", DISTRICT_LMO: "/lmo/applications", INSPECTOR: "/lmo/applications", SUPER_ADMIN: "/admin/applications", STATE_ADMIN: "/admin/applications", AUDITOR: "/admin/applications", GATC_MANAGER: "/gatc/applications" };
  redirect(routes[user.role.code] ?? "/dashboard");
}
