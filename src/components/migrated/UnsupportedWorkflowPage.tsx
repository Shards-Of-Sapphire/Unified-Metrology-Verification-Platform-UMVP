"use client";

import AppShell from "@/components/layout/AppShell";

export default function UnsupportedWorkflowPage({ title, role }: { title: string; role: "/user" | "/lmo" | "/gatc" | "/admin" }) {
  return <AppShell title={title} breadcrumbs={[{ label: title }]} requiredRoutePrefix={role}><section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-2xl"><p className="eyebrow">BACKEND CAPABILITY REQUIRED</p><h2 className="text-xl font-bold text-slate-800 font-display">{title}</h2><p className="text-slate-500 text-sm mt-2">The visual workflow exists in the desired frontend, but a corresponding backend API is not currently present in the authoritative repository. No mock records are shown here.</p></section></AppShell>;
}
