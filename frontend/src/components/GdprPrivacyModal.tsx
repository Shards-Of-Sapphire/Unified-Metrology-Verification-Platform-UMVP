import React, { useState, useEffect } from 'react';
import { UserSession, GDPRConsentRecord } from '../types';
import { Shield, Download, Trash2, CheckCircle2, AlertTriangle, FileText, Lock, X, RefreshCw } from 'lucide-react';

interface GdprPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession: UserSession;
  onDataErased?: () => void;
}

export const GdprPrivacyModal: React.FC<GdprPrivacyModalProps> = ({
  isOpen,
  onClose,
  currentSession,
  onDataErased,
}) => {
  const [consents, setConsents] = useState<GDPRConsentRecord[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [erasureConfirmed, setErasureConfirmed] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchConsents();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fetchConsents = async () => {
    try {
      const res = await fetch('/api/gdpr/consents', {
        headers: { Authorization: `Bearer ${currentSession.token}` },
      });
      const data = await res.json();
      if (res.ok && data.consents) {
        setConsents(data.consents);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/gdpr/export', {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentSession.token}` },
      });
      const data = await res.json();
      if (res.ok && data.dossier) {
        // Trigger download of signed JSON
        const blob = new Blob([JSON.stringify(data.dossier, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `UMVP_GDPR_PORTABILITY_EXPORT_${currentSession.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setNotification('Data portability dossier exported successfully.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExecuteErasure = async () => {
    if (!window.confirm('Are you sure you want to exercise your Right to Erasure? Your personal contact details and GSTIN will be permanently anonymized in compliance with GDPR Art. 17 / DPDP Sec. 12.')) {
      return;
    }

    setIsErasing(true);
    try {
      const res = await fetch('/api/gdpr/erasure', {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentSession.token}` },
      });
      if (res.ok) {
        setErasureConfirmed(true);
        setNotification('Personal data has been pseudonymized. Audit hashes preserved for legal compliance.');
        if (onDataErased) onDataErased();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsErasing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">GDPR & DPDP PRIVACY CONTROL CENTER</h2>
              <p className="text-xs text-slate-400">Data Subject Rights Management (DPDP Act 2023 / GDPR)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {notification && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Encryption at Rest Status */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" /> PII Data-at-Rest Encryption Status
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-400/30">
                ACTIVE • AES-256
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Applicant Aadhaar tokens, GSTINs, phone numbers, and location coordinates are salted and encrypted at rest. Unauthenticated roles cannot access raw citizen identifiers.
            </p>
          </div>

          {/* Active Consent Log */}
          <div>
            <h3 className="font-bold text-slate-200 mb-2 uppercase tracking-wider text-[11px]">
              Active Consent & Purpose Log
            </h3>
            <div className="space-y-2">
              {consents.map((consent) => (
                <div
                  key={consent.id}
                  className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <span className="font-medium text-slate-200">{consent.purpose}</span>
                    <div className="text-[10px] font-mono text-slate-500">
                      Legal Basis: {consent.legalBasis} • Logged at: {new Date(consent.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono shrink-0">
                    {consent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action 1: Data Portability (Export) */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white text-xs">Right to Data Portability (GDPR Art. 20)</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Download a machine-readable JSON dossier containing all your submitted applications, certificates, and logged audit events.
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow transition-all shrink-0"
            >
              {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              Export Dossier
            </button>
          </div>

          {/* Action 2: Right to Erasure */}
          <div className="p-4 bg-rose-950/30 border border-rose-900/60 rounded-xl flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-rose-300 text-xs">Right to Erasure / Anonymization (GDPR Art. 17)</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Permanently redact all personal identifiable details (name, email, phone, GSTIN). In accordance with the Legal Metrology Act, 2009 statutory obligations, cryptographic audit block hashes are preserved in pseudonymized form.
              </p>
            </div>
            <button
              onClick={handleExecuteErasure}
              disabled={isErasing || erasureConfirmed}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-600 disabled:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow transition-all shrink-0"
            >
              {isErasing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              {erasureConfirmed ? 'Redacted' : 'Exercise Erasure'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Complies with Digital Personal Data Protection (DPDP) Act, 2023</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
          >
            Close Privacy Center
          </button>
        </div>
      </div>
    </div>
  );
};
