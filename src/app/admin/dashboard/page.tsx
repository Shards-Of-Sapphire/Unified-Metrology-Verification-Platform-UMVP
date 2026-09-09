"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Award, ArrowRight, FileText, Search, Users } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import StatsCard from "@/components/ui/StatsCard";
import StatusBadge from "@/components/ui/StatusBadge";
import usePolling from "@/hooks/usePolling";

type Dashboard = { metrics: { openApplications: number; dueThisWeek: number; certificatesIssued: number; pendingReview: number }; applications: Array<{ id: string; referenceNo: string; status: string; applicant: { legalName: string }; instrument: { category: string } }> };

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  async function loadDashboard() {
    try {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load administration metrics.");
      setData(await response.json() as Dashboard);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load administration metrics.");
    }
  }
  useEffect(() => { const initialLoad = window.setTimeout(() => void loadDashboard(), 0); return () => window.clearTimeout(initialLoad); }, []);
  usePolling(() => { void loadDashboard(); });
  return <AppShell title="Admin Dashboard" requiredRoutePrefix="/admin">{error ? <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div> : !data ? <div className="text-slate-500 text-sm">Loading dashboard...</div> : <><div className="bg-gradient-navy rounded-2xl p-6 mb-6 text-white"><p className="text-white/60 text-sm mb-1">System Overview</p><h2 className="text-2xl font-bold font-display mb-4">UMVP Platform Analytics</h2><div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[["Open applications", data.metrics.openApplications], ["Due this week", data.metrics.dueThisWeek], ["Certificates issued", data.metrics.certificatesIssued], ["Pending review", data.metrics.pendingReview]].map(([label, value]) => <div key={label} className="bg-white/8 border border-white/10 rounded-xl px-4 py-3"><p className="text-2xl font-bold font-display text-teal-300">{value}</p><p className="text-white/50 text-xs mt-0.5">{label}</p></div>)}</div></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"><StatsCard title="Open Applications" value={data.metrics.openApplications} icon={<FileText size={18} />} accent="blue" /><StatsCard title="Pending Review" value={data.metrics.pendingReview} icon={<Search size={18} />} accent="saffron" /><StatsCard title="Certificates Issued" value={data.metrics.certificatesIssued} icon={<Award size={18} />} accent="teal" /><StatsCard title="Management" value="-" icon={<Users size={18} />} accent="violet" /></div><section className="bg-white rounded-xl border border-slate-200 shadow-sm"><div className="flex items-center justify-between px-5 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-800 font-display text-sm">Recent Applications</h3><Link href="/admin/applications" className="text-xs text-blue-600 flex items-center gap-1">View all <ArrowRight size={12} /></Link></div><div className="divide-y divide-slate-50">{data.applications.slice(0, 6).map((application) => <div key={application.id} className="flex items-start gap-3 px-5 py-4"><div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><FileText size={14} className="text-blue-600" /></div><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-800 truncate">{application.instrument.category}</p><p className="text-xs text-slate-400">{application.applicant.legalName} · {application.referenceNo}</p></div><StatusBadge status={application.status.toLowerCase()} size="sm" /></div>)}</div></section><div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-xs">Management, audit, and report-generation APIs are not currently present in the backend repository.</div></>}</AppShell>;
}