"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import usePolling from "@/hooks/usePolling";

type Report = { id: string; type: string; status: string; createdAt: string; fileKey: string | null };

export default function ReportsPage() {
  const [records, setRecords] = useState<Report[]>([]);
  const [error, setError] = useState("");
  async function loadReports() {
    try {
      const response = await fetch("/api/reports", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load reports.");
      setRecords(await response.json() as Report[]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load reports.");
    }
  }
  useEffect(() => { const initialLoad = window.setTimeout(() => void loadReports(), 0); return () => window.clearTimeout(initialLoad); }, []);
  usePolling(() => { void loadReports(); });
  const columns = [
    { key: "type", label: "Report", render: (row: Report) => <span className="font-medium text-slate-800">{row.type.replaceAll("_", " ")}</span> },
    { key: "createdAt", label: "Created", render: (row: Report) => <span className="text-xs text-slate-500">{new Date(row.createdAt).toLocaleDateString("en-IN")}</span> },
    { key: "status", label: "Status", render: (row: Report) => <StatusBadge status={row.status.toLowerCase()} /> },
    { key: "fileKey", label: "File", render: (row: Report) => <span className="text-xs text-slate-500">{row.fileKey ?? "Not available"}</span> },
  ];
  return <AppShell title="Reports & Analytics" breadcrumbs={[{ label: "Reports" }]}>{error ? <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div> : <><div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-xs">Reports are read-only. Report generation and download endpoints are not currently present.</div><DataTable columns={columns} data={records as unknown as Record<string, unknown>[]} keyExtractor={(row) => String((row as unknown as Report).id)} searchKeys={["type", "status"]} searchPlaceholder="Search reports..." emptyMessage="No reports found" /></>}</AppShell>;
}
