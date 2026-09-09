"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

type Application = { id: string; referenceNo: string; status: string; submittedAt: string | null; applicant: { legalName: string }; instrument: { category: string } };

export default function AdminApplicationsPage() {
  const [records, setRecords] = useState<Application[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/applications").then(async (response) => { if (!response.ok) throw new Error("Unable to load applications."); setRecords(await response.json() as Application[]); }).catch((reason: Error) => setError(reason.message)); }, []);
  const columns = [
    { key: "referenceNo", label: "Reference", render: (row: Application) => <span className="font-mono text-xs text-blue-700 font-medium">{row.referenceNo}</span> },
    { key: "applicant", label: "Applicant", render: (row: Application) => row.applicant.legalName },
    { key: "instrument", label: "Instrument", render: (row: Application) => row.instrument.category },
    { key: "status", label: "Status", render: (row: Application) => <StatusBadge status={row.status.toLowerCase()} /> },
    { key: "submittedAt", label: "Submitted", render: (row: Application) => <span className="text-xs text-slate-500">{row.submittedAt ? new Date(row.submittedAt).toLocaleDateString("en-IN") : "-"}</span> },
  ];
  return <AppShell title="Applications" breadcrumbs={[{ label: "Applications" }]} requiredRoutePrefix="/admin">{error ? <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div> : <DataTable columns={columns} data={records as unknown as Record<string, unknown>[]} keyExtractor={(row) => String((row as unknown as Application).id)} searchKeys={["referenceNo", "status"]} searchPlaceholder="Search applications..." emptyMessage="No applications found" />}</AppShell>;
}
