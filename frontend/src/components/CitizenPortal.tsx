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
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
                APPLICANT WORKSPACE • CITIZEN STAKEHOLDER
              </span>
              <span className="text-xs text-slate-400 font-mono">
                GSTIN: {currentSession.maskedId}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Welcome, {currentSession.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Manage commercial weighing & measuring instrument verifications under the Legal Metrology Act, 2009. All applications carry end-to-end encrypted communication and tamper-proof digital certificates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenGdpr}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              Privacy & GDPR Rights
            </button>
            <button
              onClick={onOpenNewAppModal}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              New Verification Application
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-700/60 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Total Instruments</span>
            <span className="text-lg font-bold font-mono text-white mt-0.5 block">{myApplications.length}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Active Verified Certs</span>
            <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">{certifiedCount}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Pending Inspection</span>
            <span className="text-lg font-bold font-mono text-amber-400 mt-0.5 block">{pendingCount}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">E2EE Channels Active</span>
            <span className="text-lg font-bold font-mono text-blue-400 mt-0.5 block">
              <Lock className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
              Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              My Registered Metrology Instruments
            </h3>
            <p className="text-xs text-slate-400">
              Only accessible to you. LMOs can only see records allocated to them; other citizens cannot access your dossier.
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Queue
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
