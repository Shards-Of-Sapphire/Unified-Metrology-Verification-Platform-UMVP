"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Award, ArrowRight, CheckCircle, Clock, FileText, PlusCircle } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import StatsCard from "@/components/ui/StatsCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import usePolling from "@/hooks/usePolling";

type Application = { id: string; referenceNo: string; status: string; applicant: { legalName: string }; instrument: { category: string } };
type Certificate = { id: string; certificateNo: string; status: string; validUntil: string; application: { instrument: { category: string } } };

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [error, setError] = useState("");

  async function loadRecords() {
    try {
      const [applicationsResponse, certificatesResponse] = await Promise.all([fetch("/api/applications", { cache: "no-store" }), fetch("/api/certificates", { cache: "no-store" })]);
      if (!applicationsResponse.ok || !certificatesResponse.ok) throw new Error("Unable to load your records.");
      setApplications(await applicationsResponse.json() as Application[]);
      setCertificates(await certificatesResponse.json() as Certificate[]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load your records.");
    }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadRecords(), 0);
    return () => window.clearTimeout(initialLoad);
  }, []);

  usePolling(() => {
    void loadRecords();
  });

  const pending = applications.filter(({ status }) => !["APPROVED", "REJECTED", "EXPIRED"].includes(status));
  const active = certificates.filter(({ status }) => status === "ACTIVE");

  return <AppShell title="Dashboard" requiredRoutePrefix="/user">
    {error ? <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div> : <>
      <div className="bg-gradient-navy rounded-2xl p-6 mb-6 text-white relative overflow-hidden"><p className="text-white/60 text-sm mb-1">Good morning,</p><h2 className="text-2xl font-bold font-display mb-1">{user?.name}</h2><p className="text-white/50 text-sm">{user?.organisation}</p><Link href="/user/applications/new" className="inline-flex items-center gap-2 mt-4 bg-white/15 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl"><PlusCircle size={15} /> New Application</Link></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"><StatsCard title="Total Applications" value={applications.length} icon={<FileText size={18} />} accent="blue" /><StatsCard title="Pending Review" value={pending.length} icon={<Clock size={18} />} accent="saffron" /><StatsCard title="Active Certificates" value={active.length} icon={<Award size={18} />} accent="teal" /><StatsCard title="Completed" value={certificates.length} icon={<CheckCircle size={18} />} accent="green" /></div>
      <div className="grid lg:grid-cols-2 gap-6"><section className="bg-white rounded-xl border border-slate-200 shadow-sm"><div className="flex items-center justify-between px-5 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-800 font-display text-sm">Recent Applications</h3><Link href="/applications" className="text-xs text-blue-600 flex items-center gap-1">View all <ArrowRight size={12} /></Link></div><div className="divide-y divide-slate-50">{applications.slice(0, 4).map((application) => <Link key={application.id} href={`/applications?reference=${application.referenceNo}`} className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50"><div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><FileText size={14} className="text-blue-600" /></div><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-800 truncate">{application.instrument.category}</p><p className="text-xs text-slate-400 mt-0.5">{application.referenceNo} · {application.applicant.legalName}</p></div><StatusBadge status={application.status.toLowerCase()} size="sm" /></Link>)}{!applications.length && <div className="py-10 text-center text-slate-400 text-sm">No applications yet</div>}</div></section>
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm"><div className="flex items-center justify-between px-5 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-800 font-display text-sm">My Certificates</h3><Link href="/certificates" className="text-xs text-blue-600 flex items-center gap-1">View all <ArrowRight size={12} /></Link></div><div className="divide-y divide-slate-50">{certificates.slice(0, 4).map((certificate) => <Link key={certificate.id} href="/certificates" className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50"><div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0"><Award size={14} className="text-teal-600" /></div><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-800 truncate">{certificate.application.instrument.category}</p><p className="text-xs text-slate-400 mt-0.5">{certificate.certificateNo}</p><p className="text-xs text-slate-400">Valid until {new Date(certificate.validUntil).toLocaleDateString("en-IN")}</p></div><StatusBadge status={certificate.status.toLowerCase()} size="sm" /></Link>)}{!certificates.length && <div className="py-10 text-center text-slate-400 text-sm">No certificates issued yet</div>}</div></section></div>
    </>}
  </AppShell>;
}