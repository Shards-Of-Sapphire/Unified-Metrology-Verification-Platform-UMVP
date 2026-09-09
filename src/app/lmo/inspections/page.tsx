"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

type Inspection = { id: string; scheduledAt: string; status: string; application: { applicant: { legalName: string }; instrument: { category: string } } };

export default function LmoInspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/inspections").then(async (response) => { if (!response.ok) throw new Error("Unable to load inspections."); setInspections(await response.json() as Inspection[]); }).catch((reason: Error) => setError(reason.message)); }, []);
  const columns = [
    { key: "id", label: "Inspection", render: (row: Inspection) => <span className="font-mono text-xs text-blue-700">{row.id.slice(-8).toUpperCase()}</span> },
    { key: "applicant", label: "Applicant", render: (row: Inspection) => row.application.applicant.legalName },
    { key: "instrument", label: "Instrument", render: (row: Inspection) => row.application.instrument.category },
    { key: "scheduledAt", label: "Appointment", render: (row: Inspection) => <span className="text-xs">{new Date(row.scheduledAt).toLocaleString("en-IN")}</span> },
    { key: "status", label: "Status", render: (row: Inspection) => <StatusBadge status={row.status.toLowerCase()} /> },
  ];
  return <AppShell title="Inspections" breadcrumbs={[{ label: "Inspections" }]} requiredRoutePrefix="/lmo">{error ? <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div> : <><div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-xs">Backend contract note: inspections are currently read-only through the available API.</div><DataTable columns={columns} data={inspections as unknown as Record<string, unknown>[]} keyExtractor={(row) => String((row as unknown as Inspection).id)} searchKeys={["status"]} searchPlaceholder="Search inspections..." emptyMessage="No inspections found" /></>}</AppShell>;
}