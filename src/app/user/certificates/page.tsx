"use client";

import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import DataTable from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import usePolling from "@/hooks/usePolling";

type Certificate = { id: string; certificateNo: string; issuedAt: string; validUntil: string; status: string; application: { applicant: { email: string }; instrument: { category: string; serialNumber: string } } };

export default function UserCertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [error, setError] = useState("");

  async function loadCertificates() {
    try {
      const response = await fetch("/api/certificates", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load certificates.");
      setCertificates(await response.json() as Certificate[]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load certificates.");
    }
  }
  useEffect(() => { const initialLoad = window.setTimeout(() => void loadCertificates(), 0); return () => window.clearTimeout(initialLoad); }, []);
  usePolling(() => { void loadCertificates(); });

  const ownCertificates = certificates.filter((certificate) => certificate.application.applicant.email === user?.email);
  const columns = [
    { key: "certificateNo", label: "Certificate No.", render: (row: Certificate) => <span className="font-mono text-xs text-teal-700 font-medium">{row.certificateNo}</span> },
    { key: "instrument", label: "Instrument", render: (row: Certificate) => row.application.instrument.category },
    { key: "serialNumber", label: "Serial No.", render: (row: Certificate) => <span className="font-mono text-xs text-slate-500">{row.application.instrument.serialNumber}</span> },
    { key: "issuedAt", label: "Issued", render: (row: Certificate) => <span className="text-xs text-slate-500">{new Date(row.issuedAt).toLocaleDateString("en-IN")}</span> },
    { key: "validUntil", label: "Valid Until", render: (row: Certificate) => <span className="text-xs text-slate-500">{new Date(row.validUntil).toLocaleDateString("en-IN")}</span> },
    { key: "status", label: "Status", render: (row: Certificate) => <StatusBadge status={row.status.toLowerCase()} /> },
  ];

  return <AppShell title="My Certificates" breadcrumbs={[{ label: "Certificates" }]} requiredRoutePrefix="/user">{error ? <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div> : ownCertificates.length === 0 ? <EmptyState icon={<Award size={28} />} title="No certificates yet" description="Certificates will appear here once your instruments are verified." /> : <DataTable columns={columns} data={ownCertificates as unknown as Record<string, unknown>[]} keyExtractor={(row) => String((row as unknown as Certificate).id)} searchKeys={["certificateNo", "status"]} searchPlaceholder="Search certificates..." />}</AppShell>;
}