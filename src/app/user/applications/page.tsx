"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, PlusCircle } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import DataTable from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import usePolling from "@/hooks/usePolling";

type Application = { id: string; referenceNo: string; status: string; submittedAt: string | null; applicant: { legalName: string }; instrument: { category: string; manufacturer: string | null; model: string | null } };

export default function UserApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState("");

  async function loadApplications() {
    try {
      const response = await fetch("/api/applications", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load applications.");
      setApplications(await response.json() as Application[]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load applications.");
    }
  }
  useEffect(() => { const initialLoad = window.setTimeout(() => void loadApplications(), 0); return () => window.clearTimeout(initialLoad); }, []);
  usePolling(() => { void loadApplications(); });

  const columns = [
    { key: "referenceNo", label: "Reference", render: (row: Application) => <span className="font-mono text-xs text-blue-700 font-medium">{row.referenceNo}</span> },
    { key: "instrument", label: "Instrument", render: (row: Application) => row.instrument.category },
    { key: "applicant", label: "Applicant", render: (row: Application) => <span className="text-slate-500">{row.applicant.legalName}</span> },
    { key: "status", label: "Status", render: (row: Application) => <StatusBadge status={row.status.toLowerCase()} /> },
    { key: "submittedAt", label: "Submitted", render: (row: Application) => <span className="text-slate-500 text-xs">{row.submittedAt ? new Date(row.submittedAt).toLocaleDateString("en-IN") : "-"}</span> },
  ];

  return <AppShell title="My Applications" breadcrumbs={[{ label: "Applications" }]} requiredRoutePrefix="/user">
    {error ? <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div> : applications.length === 0 ? <EmptyState icon={<FileText size={28} />} title="No applications yet" description="Start your first instrument verification application." action={<Link href="/user/applications/new" className="bg-gradient-royal text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2"><PlusCircle size={14} /> New Application</Link>} /> : <><div className="flex justify-end mb-4"><Link href="/user/applications/new" className="flex items-center gap-2 bg-gradient-royal text-white text-sm font-semibold px-4 py-2 rounded-xl"><PlusCircle size={15} /> New Application</Link></div><DataTable columns={columns} data={applications as unknown as Record<string, unknown>[]} keyExtractor={(row) => String((row as unknown as Application).id)} searchKeys={["referenceNo", "status"]} searchPlaceholder="Search applications..." /></>}
  </AppShell>;
}