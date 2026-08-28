"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle, Scale, Search, Shield, XCircle } from "lucide-react";
import QRCodeDisplay from "@/components/ui/QRCodeDisplay";

type Result = { valid: boolean; error?: string; hashMatches?: boolean; certificateNo?: string; holder?: string; instrument?: string; status?: string; validUntil?: string };

export default function VerifyCertificateView({ initialCertificateNo = "" }: { initialCertificateNo?: string }) {
  const [query, setQuery] = useState(initialCertificateNo === "demo" ? "" : initialCertificateNo);
  const [result, setResult] = useState<Result | null>(null);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const certificateNo = query.trim();
    if (!certificateNo) return;
    const response = await fetch(`/api/verify/${encodeURIComponent(certificateNo)}`);
    setResult(await response.json() as Result);
  }

  return <div className="min-h-screen bg-slate-50"><nav className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between"><Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-gradient-royal flex items-center justify-center"><Scale size={13} className="text-white" /></div><span className="font-bold text-slate-800 font-display">UMVP</span></Link><Link href="/login" className="text-sm text-blue-600 font-medium">Sign In</Link></nav><div className="max-w-2xl mx-auto px-4 py-12"><div className="text-center mb-8"><div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Shield size={28} className="text-blue-600" /></div><h1 className="text-2xl font-bold text-slate-800 font-display mb-2">Certificate Verification</h1><p className="text-slate-500 text-sm">Enter a certificate number to verify authenticity against the official record.</p></div><form onSubmit={verify} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6"><div className="flex gap-2"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. LM-2026-000184" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /><button className="bg-gradient-royal text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2" type="submit"><Search size={15} /> Verify</button></div></form>{result && (result.valid ? <div className="bg-white rounded-2xl border-2 border-green-200 shadow-sm overflow-hidden"><div className="bg-green-50 px-6 py-4 flex items-center gap-3 border-b border-green-100"><CheckCircle size={22} className="text-green-600" /><div><p className="font-bold text-green-800">Certificate Verified</p><p className="text-green-600 text-xs">This record passed the official authenticity check.</p></div></div><div className="p-6 flex gap-6"><div className="flex-1 space-y-3 text-sm"><div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Certificate No.</span><strong>{result.certificateNo}</strong></div><div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Instrument</span><strong>{result.instrument}</strong></div><div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Holder</span><strong>{result.holder}</strong></div><div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Valid Until</span><strong>{result.validUntil ? new Date(result.validUntil).toLocaleDateString("en-IN") : "-"}</strong></div></div><QRCodeDisplay value={`https://umvp.gov.in/verify/${result.certificateNo}`} size={130} certificateNumber={result.certificateNo ?? ""} /></div></div> : <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-6 text-center"><XCircle size={32} className="text-red-500 mx-auto mb-3" /><h3 className="font-bold text-slate-800 font-display mb-1">Certificate Not Found</h3><p className="text-slate-500 text-sm">{result.error ?? "This certificate could not be verified."}</p>{result.hashMatches === false && <p className="text-amber-600 text-xs mt-3"><AlertCircle size={13} className="inline mr-1" /> Cryptographic hash mismatch detected.</p>}</div>)}</div></div>;
}