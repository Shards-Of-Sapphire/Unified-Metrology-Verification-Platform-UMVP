"use client";

import { FormEvent, useState } from "react";

export default function VerifyPage() {
  const [certificateNo, setCertificateNo] = useState("");
  const [result, setResult] = useState<{ valid: boolean; error?: string; hashMatches?: boolean; holder?: string; instrument?: string; validUntil?: string } | null>(null);
  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`/api/verify/${encodeURIComponent(certificateNo.trim())}`);
    setResult(await response.json());
  }
  return <main className="verify-page"><section className="verify-card"><div className="brand-lockup"><div className="brand-mark">U</div><div><strong>UMVP</strong><span>Public certificate verification</span></div></div><p className="eyebrow">AUTHENTICITY CHECK</p><h1>Verify a certificate</h1><p className="lede">Confirm the certificate record and its cryptographic integrity.</p><form onSubmit={verify} className="verify-form"><label htmlFor="certificate-no">Certificate number</label><div className="verify-input"><input id="certificate-no" placeholder="LM-2026-000184" value={certificateNo} onChange={(event) => setCertificateNo(event.target.value)} required /><button aria-label="Verify certificate">-&gt;</button></div></form>{result && <div className={result.valid ? "verification-result valid" : "verification-result invalid"}><strong>{result.valid ? "Certificate verified" : "Certificate could not be verified"}</strong>{result.error ? <span>{result.error}</span> : <><span>{result.holder} · {result.instrument}</span><span>Valid until {result.validUntil ? new Date(result.validUntil).toLocaleDateString("en-IN") : "unknown"}</span><small>{result.hashMatches ? "Cryptographic hash matches the immutable record." : "Hash mismatch detected."}</small></>}</div>}</section></main>;
}
