"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

type Certificate = { id: string; certificateNo: string; validUntil: string; status: string; application: { applicant: { legalName: string }; instrument: { category: string; serialNumber: string } } };

export default function CertificatesPage() {
  const [records, setRecords] = useState<Certificate[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/certificates").then(async (response) => { if (!response.ok) throw new Error("Unable to load certificates."); setRecords(await response.json() as Certificate[]); }).catch((reason: Error) => setError(reason.message)); }, []);
  const columns = [
    { key: "certificateNo", label: "Certificate No.", render: (row: Certificate) => <span className="font-mono text-xs text-teal-700 font-medium">{row.certificateNo}</span> },
    { key: "applicant", label: "Holder", render: (row: Certificate) => <span>{row.application.applicant.legalName}<small className="block text-xs text-slate-400">{row.application.instrument.category}</small></span> },
    { key: "serialNumber", label: "Serial No.", render: (row: Certificate) => <span className="font-mono text-xs text-slate-500">{row.application.instrument.serialNumber}</span> },
    { key: "validUntil", label: "Valid Until", render: (row: Certificate) => <span className="text-xs text-slate-500">{new Date(row.validUntil).toLocaleDateString("en-IN")}</span> },
    { key: "status", label: "Status", render: (row: Certificate) => <StatusBadge status={row.status.toLowerCase()} /> },
  ];
  return <AppShell title="Certificates" breadcrumbs={[{ label: "Certificates" }]}>{error ? <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div> : <DataTable columns={columns} data={records as unknown as Record<string, unknown>[]} keyExtractor={(row) => String((row as unknown as Certificate).id)} searchKeys={["certificateNo", "status"]} searchPlaceholder="Search certificates..." emptyMessage="No certificates found" />}</AppShell>;
}
