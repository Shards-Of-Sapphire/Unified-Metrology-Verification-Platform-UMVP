"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import usePolling from "@/hooks/usePolling";

type Inspection = { id: string; scheduledAt: string; status: string; application: { applicant: { legalName: string }; instrument: { category: string } } };

export default function InspectionsPage() {
  const [records, setRecords] = useState<Inspection[]>([]);
  const [error, setError] = useState("");
  async function loadInspections() {
    try {
      const response = await fetch("/api/inspections", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load inspections.");
      setRecords(await response.json() as Inspection[]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load inspections.");
    }
  }
  useEffect(() => { const initialLoad = window.setTimeout(() => void loadInspections(), 0); return () => window.clearTimeout(initialLoad); }, []);
  usePolling(() => { void loadInspections(); });
  const columns = [
    { key: "id", label: "Inspection", render: (row: Inspection) => <span className="font-mono text-xs text-blue-700">{row.id.slice(-8).toUpperCase()}</span> },
    { key: "applicant", label: "Applicant", render: (row: Inspection) => row.application.applicant.legalName },
    { key: "instrument", label: "Instrument", render: (row: Inspection) => row.application.instrument.category },
    { key: "scheduledAt", label: "Appointment", render: (row: Inspection) => <span className="text-xs">{new Date(row.scheduledAt).toLocaleString("en-IN")}</span> },
    { key: "status", label: "Status", render: (row: Inspection) => <StatusBadge status={row.status.toLowerCase()} /> },
  ];
  return <AppShell title="Inspections" breadcrumbs={[{ label: "Inspections" }]}>{error ? <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div> : <DataTable columns={columns} data={records as unknown as Record<string, unknown>[]} keyExtractor={(row) => String((row as unknown as Inspection).id)} searchKeys={["status"]} searchPlaceholder="Search inspections..." emptyMessage="No inspections found" />}</AppShell>;
}
