import React, { useState } from 'react';
import { MetrologyApplication, VerificationCertificate, UserSession } from '../types';
import {
  FileText,
  PlusCircle,
  QrCode,
  Shield,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Download,
  Building2,
  RefreshCw,
  Search,
} from 'lucide-react';

interface CitizenPortalProps {
  currentSession: UserSession;
  applications: MetrologyApplication[];
  certificates: VerificationCertificate[];
  onOpenNewAppModal: () => void;
  onOpenE2EE: (appId: string, appNumber: string) => void;
  onOpenCertificate: (cert: VerificationCertificate) => void;
  onOpenGdpr: () => void;
  onRefresh: () => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  currentSession,
  applications,
  certificates,
  onOpenNewAppModal,
  onOpenE2EE,
  onOpenCertificate,
  onOpenGdpr,
  onRefresh,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Filter only applications belonging to current citizen
  const myApplications = applications.filter((app) => app.applicantId === currentSession.id);
  const myCertificates = certificates.filter((c) => c.ownerName === currentSession.name);

  const certifiedCount = myApplications.filter((a) => a.status === 'CERTIFIED').length;
  const pendingCount = myApplications.filter((a) => a.status !== 'CERTIFIED').length;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-5 text-white shadow-lg shadow-slate-950/30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 font-semibold uppercase tracking-[0.12em] text-blue-300">
                Citizen Portal
              </span>
              <span className="font-mono text-slate-400">
                {currentSession.gstin ? `GSTIN: ${currentSession.gstin}` : `ID: ${currentSession.maskedId}`}
              </span>
              {currentSession.phone && <span className="font-mono text-slate-400">• {currentSession.phone}</span>}
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Welcome, {currentSession.name}
              </h2>
              {currentSession.businessName && (
                <p className="text-sm text-amber-300">{currentSession.businessName}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenGdpr}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-[11px] font-medium text-slate-200 hover:border-slate-600 hover:text-white"
            >
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400" /> Privacy
              </span>
            </button>
            <button
              onClick={onOpenNewAppModal}
              className="rounded-xl bg-amber-400 px-4 py-2 text-[11px] font-semibold text-slate-950 shadow-lg shadow-amber-900/20 hover:bg-amber-300"
            >
              <span className="inline-flex items-center gap-1.5">
                <PlusCircle className="h-4 w-4" /> New application
              </span>
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Instruments</div>
            <div className="mt-2 text-xl font-bold text-white">{myApplications.length}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Certs</div>
            <div className="mt-2 text-xl font-bold text-emerald-400">{certifiedCount}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Pending</div>
            <div className="mt-2 text-xl font-bold text-amber-400">{pendingCount}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Security</div>
            <div className="mt-2 inline-flex items-center gap-1 text-lg font-bold text-blue-400">
              <Lock className="h-3.5 w-3.5 text-emerald-400" /> Active
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-white">
              <FileText className="h-4 w-4 text-blue-400" /> My applications
            </h3>
            <p className="text-xs text-slate-400">Applications are kept private and only shared with assigned officers.</p>
          </div>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-2 text-[11px] text-slate-300 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>

        {myApplications.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800/80 space-y-3">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No applications on record for this citizen identity.</p>
            <button
              onClick={onOpenNewAppModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Submit First Application
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myApplications.map((app) => {
              const matchedCert = myCertificates.find((c) => c.applicationId === app.id);
              return (
                <div
                  key={app.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition-all text-xs space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-amber-400">{app.applicationNumber}</span>
                      <span className="text-slate-500">|</span>
                      <span className="font-semibold text-white">
                        {app.instrumentCategory.replace(/_/g, ' ')}
                      </span>
                      <span className="text-slate-400">({app.modelNumber})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
                          app.status === 'CERTIFIED'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : app.status === 'INSPECTION_SCHEDULED'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : app.status === 'ALLOCATED'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Serial & Capacity</span>
                      <span className="font-mono text-slate-200">{app.serialNumber}</span>
                      <span className="text-slate-400 block text-[11px]">{app.capacityOrRange}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Installation Site</span>
                      <span className="text-slate-200">{app.installationAddress}</span>
                      <span className="text-slate-400 block text-[11px]">{app.city}, {app.pincode}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Assigned Officer</span>
                      {app.allocatedLmoName ? (
                        <span className="text-amber-300 font-medium">{app.allocatedLmoName}</span>
                      ) : (
                        <span className="text-slate-500 italic">Pending Allocation Algorithm</span>
                      )}
                      {app.scheduledInspectionDate && (
                        <span className="text-slate-400 block text-[11px]">
                          Scheduled: {app.scheduledInspectionDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Tools for this application */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px]">Submitted: {app.submissionDate}</span>
                      {app.gdprConsentRecorded && (
                        <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> GDPR Consent Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* E2EE Secure Dispatch with assigned LMO */}
                      <button
                        onClick={() => onOpenE2EE(app.id, app.applicationNumber)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                        title="Send encrypted gate access codes or technical notes"
                      >
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        E2EE Secure Dispatch
                      </button>

                      {/* View Certificate if certified */}
                      {matchedCert && (
                        <button
                          onClick={() => onOpenCertificate(matchedCert)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          View Digital Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
