import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardRoute() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const routes: Record<string, string> = { APPLICANT: "/user/dashboard", DISTRICT_LMO: "/lmo/dashboard", INSPECTOR: "/lmo/dashboard", GATC_MANAGER: "/gatc/dashboard", SUPER_ADMIN: "/admin/dashboard", STATE_ADMIN: "/admin/dashboard", AUDITOR: "/admin/dashboard" };
  redirect(routes[user.role.code] ?? "/");
}
