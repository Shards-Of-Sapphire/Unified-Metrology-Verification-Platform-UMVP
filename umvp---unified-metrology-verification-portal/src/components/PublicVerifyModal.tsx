import React, { useState, useEffect } from 'react';
import { VerificationCertificate } from '../types';
import { ShieldCheck, ShieldAlert, CheckCircle2, QrCode, Search, FileText, Lock, X, ExternalLink, Calendar, MapPin, Award } from 'lucide-react';

interface PublicVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCertId?: string;
}

export const PublicVerifyModal: React.FC<PublicVerifyModalProps> = ({
  isOpen,
  onClose,
  initialCertId = 'CERT-DL-2026-8819',
}) => {
  const [certInput, setCertInput] = useState(initialCertId);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    certificate?: VerificationCertificate;
    integrityDetails?: any;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && initialCertId) {
      setCertInput(initialCertId);
      performVerification(initialCertId);
    }
  }, [isOpen, initialCertId]);

  if (!isOpen) return null;

  const performVerification = async (idToVerify: string, simulatedTamperedSig?: string) => {
    if (!idToVerify.trim()) return;
    setIsLoading(true);
    setVerificationResult(null);

    try {
      const url = simulatedTamperedSig
        ? `/api/certificates/verify/${encodeURIComponent(idToVerify)}?sig=${simulatedTamperedSig}`
        : `/api/certificates/verify/${encodeURIComponent(idToVerify)}`;

      const res = await fetch(url);
      const data = await res.json();
      setVerificationResult(data);
    } catch {
      setVerificationResult({
        valid: false,
        error: 'Verification service unreachable. Check network status.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTamperTest = () => {
    // Inject corrupted signature to demonstrate tamper-proof rejection
    performVerification(certInput, 'corrupted_tampered_signature_999999');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">PUBLIC CERTIFICATE VERIFIER</h2>
              <p className="text-xs text-slate-400">Section 24 Legal Metrology Act 2009 Authenticity Check</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Input & Search Bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Enter Certificate ID or Scan QR Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  placeholder="e.g. CERT-DL-2026-8819 or LM-VERIF-DL-2026-08819"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => performVerification(certInput)}
                disabled={isLoading}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isLoading ? 'Verifying...' : 'Verify Authenticity'}
              </button>
            </div>
          </div>

          {/* Verification Results */}
          {verificationResult && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {verificationResult.valid && verificationResult.certificate ? (
                <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-4">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-800/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                            GENUINE & ACTIVE CERTIFICATE
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {verificationResult.certificate.certificateNumber}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-200 mt-0.5">
                          Cryptographically signed by Legal Metrology Department
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono text-slate-400 block">Official Seal No.</span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {verificationResult.certificate.sealNumber}
                      </span>
                    </div>
                  </div>

                  {/* Instrument & Owner Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 block">Instrument Category</span>
                      <span className="font-semibold text-white">
                        {verificationResult.certificate.instrumentCategory.replace(/_/g, ' ')}
                      </span>
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                        Model: <span className="text-slate-200">{verificationResult.certificate.modelNumber}</span> | Serial: <span className="font-mono text-emerald-300">{verificationResult.certificate.serialNumber}</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 block">Verified Owner / Premise</span>
                      <span className="font-semibold text-white">{verificationResult.certificate.businessName}</span>
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{verificationResult.certificate.installationAddress}</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 block">Issuing Officer</span>
                      <span className="font-semibold text-amber-300">
                        {verificationResult.certificate.issuingLmoName} ({verificationResult.certificate.issuingLmoBadge})
                      </span>
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                        Jurisdiction: {verificationResult.certificate.jurisdiction}
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 block">Validity Period</span>
                      <div className="flex items-center gap-1.5 font-mono text-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{new Date(verificationResult.certificate.issuedAt).toLocaleDateString()}</span>
                        <span className="text-slate-500">→</span>
                        <span className="text-emerald-300 font-bold">{new Date(verificationResult.certificate.validUntil).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic Proof Details */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1.5 font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Lock className="w-3 h-3" /> HMAC-SHA256 Digital Signature Verified
                      </span>
                      <span className="text-slate-500">Algorithm: FIPS-198 HMAC-SHA256</span>
                    </div>
                    <div className="text-slate-400 break-all bg-slate-900 p-2 rounded border border-slate-800 text-[10px]">
                      {verificationResult.certificate.hmacSignature}
                    </div>
                    <div className="text-slate-500 text-[10px] flex justify-between">
                      <span>Tamper-Proof Ledger Hash: {verificationResult.certificate.tamperProofHash.slice(0, 24)}...</span>
                      <span className="text-emerald-400">Status: ZERO TAMPER DETECTED</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-emerald-900/50">
                    <span className="text-xs text-slate-400">Security Audit Verification Demonstration:</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/certificates/${verificationResult.certificate.id}/download.pdf?sig=${encodeURIComponent(verificationResult.certificate.hmacSignature)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-200 hover:bg-emerald-500/20"
                      >
                        <FileText className="h-3.5 w-3.5" /> Open PDF
                      </a>
                      <button
                        type="button"
                        onClick={handleTamperTest}
                        className="px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        Simulate Signature Tampering Test
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-rose-950/50 border border-rose-600/60 space-y-3">
                  <div className="flex items-center gap-3 text-rose-300">
                    <ShieldAlert className="w-8 h-8 text-rose-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-rose-200 tracking-wide">
                        CERTIFICATE VERIFICATION FAILED / TAMPER DETECTED
                      </h4>
                      <p className="text-xs text-rose-300/90 mt-0.5">
                        {verificationResult.error || 'The cryptographic signature did not match the Government Central Registry records.'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-rose-900/60 text-xs text-slate-300 space-y-1">
                    <div className="font-semibold text-rose-400">Enforcement Advisory:</div>
                    <p className="text-slate-400">
                      Do not trust this instrument. Operating with a fraudulent or forged certificate is a non-bailable offense under Section 30 of the Legal Metrology Act, 2009.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => performVerification(certInput)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors"
                  >
                    Reset & Re-verify Standard Certificate
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Central Repository: DoCA National Metrology Ledger</span>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white px-3 py-1 bg-slate-800 rounded-lg text-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
