"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ClipboardList, FlaskConical } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import StatsCard from "@/components/ui/StatsCard";
import usePolling from "@/hooks/usePolling";

type Dashboard = { metrics: { openApplications: number; dueThisWeek: number; certificatesIssued: number; pendingReview: number } };

export default function GatcDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  async function loadDashboard() {
    try {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load GATC metrics.");
      setData(await response.json() as Dashboard);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load GATC metrics.");
    }
  }
  useEffect(() => { const initialLoad = window.setTimeout(() => void loadDashboard(), 0); return () => window.clearTimeout(initialLoad); }, []);
  usePolling(() => { void loadDashboard(); });
  return <AppShell title="GATC Dashboard" requiredRoutePrefix="/gatc">{error ? <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div> : !data ? <div className="text-slate-500 text-sm">Loading dashboard...</div> : <><div className="bg-gradient-navy rounded-2xl p-6 mb-6 text-white"><p className="text-white/60 text-sm">Government Approved Test Centre</p><h2 className="text-2xl font-bold font-display mt-1">Testing workspace</h2><div className="flex gap-3 mt-4"><Link href="/gatc/applications" className="bg-white/15 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2"><ClipboardList size={14} /> Assigned Applications</Link><Link href="/gatc/testing" className="bg-white/15 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2"><FlaskConical size={14} /> Testing Queue</Link></div></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"><StatsCard title="Open Applications" value={data.metrics.openApplications} icon={<ClipboardList size={18} />} accent="blue" /><StatsCard title="Due This Week" value={data.metrics.dueThisWeek} icon={<FlaskConical size={18} />} accent="saffron" /><StatsCard title="Certificates Issued" value={data.metrics.certificatesIssued} icon={<FlaskConical size={18} />} accent="teal" /><StatsCard title="Pending Review" value={data.metrics.pendingReview} icon={<ClipboardList size={18} />} accent="violet" /></div><div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-amber-700 text-sm">The current backend exposes workspace metrics, but no GATC assignment or test-result API.</div><Link href="/applications" className="inline-flex items-center gap-2 mt-5 text-sm text-blue-600">Open workspace applications <ArrowRight size={14} /></Link></>}</AppShell>;
}