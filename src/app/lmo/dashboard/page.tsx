"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, Calendar, CheckCircle, ClipboardList, Clock } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import StatsCard from "@/components/ui/StatsCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import usePolling from "@/hooks/usePolling";

type Application = { id: string; referenceNo: string; status: string; applicant: { legalName: string }; instrument: { category: string } };
type Inspection = { id: string; scheduledAt: string; status: string; application: { applicant: { legalName: string }; instrument: { category: string } } };

export default function LmoDashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [error, setError] = useState("");

  async function loadRecords() {
    try {
      const [applicationsResponse, inspectionsResponse] = await Promise.all([fetch("/api/applications", { cache: "no-store" }), fetch("/api/inspections", { cache: "no-store" })]);
      if (!applicationsResponse.ok || !inspectionsResponse.ok) throw new Error("Unable to load LMO records.");
      setApplications(await applicationsResponse.json() as Application[]);
      setInspections(await inspectionsResponse.json() as Inspection[]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load LMO records.");
    }
  }
  useEffect(() => { const initialLoad = window.setTimeout(() => void loadRecords(), 0); return () => window.clearTimeout(initialLoad); }, []);
  usePolling(() => { void loadRecords(); });
  const pending = applications.filter(({ status }) => ["SUBMITTED", "DOCUMENT_REVIEW"].includes(status));
  const scheduled = inspections.filter(({ status }) => status === "ASSIGNED");
  const completed = inspections.filter(({ status }) => status === "REVIEWED");

  return <AppShell title="LMO Dashboard" requiredRoutePrefix="/lmo">{error ? <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div> : <><div className="bg-gradient-navy rounded-2xl p-6 mb-6 text-white"><p className="text-white/60 text-sm mb-0.5">Legal Metrology Officer</p><h2 className="text-2xl font-bold font-display">{user?.name}</h2><p className="text-white/50 text-sm">{user?.organisation}</p><div className="flex gap-3 mt-4"><Link href="/lmo/applications" className="bg-white/15 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2"><ClipboardList size={14} /> Application Queue</Link><Link href="/lmo/inspections" className="bg-white/15 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2"><Calendar size={14} /> Inspections</Link></div></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"><StatsCard title="Applications" value={applications.length} icon={<ClipboardList size={18} />} accent="blue" /><StatsCard title="Pending Review" value={pending.length} icon={<Clock size={18} />} accent="saffron" /><StatsCard title="Scheduled Inspections" value={scheduled.length} icon={<Calendar size={18} />} accent="violet" /><StatsCard title="Completed Inspections" value={completed.length} icon={<CheckCircle size={18} />} accent="teal" /></div><div className="grid lg:grid-cols-2 gap-6"><section className="bg-white rounded-xl border border-slate-200 shadow-sm"><div className="flex items-center justify-between px-5 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-800 font-display text-sm">Application Queue</h3><Link href="/lmo/applications" className="text-xs text-blue-600 flex items-center gap-1">View all <ArrowRight size={12} /></Link></div><div className="divide-y divide-slate-50">{applications.slice(0, 4).map((application) => <Link key={application.id} href="/lmo/applications" className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50"><div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0"><ClipboardList size={14} className="text-violet-600" /></div><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-800 truncate">{application.instrument.category}</p><p className="text-xs text-slate-400">{application.applicant.legalName} · {application.referenceNo}</p></div><StatusBadge status={application.status.toLowerCase()} size="sm" /></Link>)}{!applications.length && <div className="py-8 text-center text-slate-400 text-sm">No applications found</div>}</div></section><section className="bg-white rounded-xl border border-slate-200 shadow-sm"><div className="flex items-center justify-between px-5 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-800 font-display text-sm">Upcoming Inspections</h3><Link href="/lmo/inspections" className="text-xs text-blue-600 flex items-center gap-1">View all <ArrowRight size={12} /></Link></div><div className="divide-y divide-slate-50">{scheduled.slice(0, 4).map((inspection) => <Link key={inspection.id} href="/lmo/inspections" className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50"><div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0"><Calendar size={14} className="text-amber-600" /></div><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-800 truncate">{inspection.application.instrument.category}</p><p className="text-xs text-slate-400">{inspection.application.applicant.legalName}</p><p className="text-xs text-amber-600 font-medium">{new Date(inspection.scheduledAt).toLocaleString("en-IN")}</p></div><StatusBadge status={inspection.status.toLowerCase()} size="sm" /></Link>)}{!scheduled.length && <div className="py-8 text-center text-slate-400 text-sm">No inspections scheduled</div>}</div></section></div>{applications.length > 0 && <div className="mt-5 flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-5 py-4"><AlertCircle size={18} className="text-orange-600" /><div><p className="text-sm font-semibold text-orange-800">Workspace queue</p><p className="text-xs text-orange-600">The current backend returns workspace records; officer assignment filtering is not available.</p></div></div>}</>}</AppShell>;
}