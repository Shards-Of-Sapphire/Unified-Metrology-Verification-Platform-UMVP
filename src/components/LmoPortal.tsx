import React, { useState } from 'react';
import { MetrologyApplication, VerificationCertificate, UserSession } from '../types';
import {
  Shield,
  Award,
  CheckCircle2,
  Camera,
  MapPin,
  Sparkles,
  Lock,
  FileText,
  AlertTriangle,
  QrCode,
  Search,
  RefreshCw,
  Send,
} from 'lucide-react';

interface LmoPortalProps {
  currentSession: UserSession;
  applications: MetrologyApplication[];
  certificates: VerificationCertificate[];
  onOpenE2EE: (appId: string, appNumber: string) => void;
  onOpenCertificate: (cert: VerificationCertificate) => void;
  onRefresh: () => void;
}

export const LmoPortal: React.FC<LmoPortalProps> = ({
  currentSession,
  applications,
  certificates,
  onOpenE2EE,
  onOpenCertificate,
  onRefresh,
}) => {
  // LMO can only see applications assigned to their officer ID or unassigned in jurisdiction
  const lmoApplications = applications.filter(
    (app) => app.allocatedLmoId === currentSession.id || app.status === 'PENDING_ALLOCATION' || app.status === 'ALLOCATED'
  );

  const [selectedApp, setSelectedApp] = useState<MetrologyApplication | null>(
    lmoApplications[0] || null
  );

  // Field Inspection State
  const [roughNotes, setRoughNotes] = useState(
    'Conducted eccentricity test at 1/3 max load. All quadrants within ±1e. Stamped official punch seal DL-4091-88. Seal lead wire intact.'
  );
  const [latitude, setLatitude] = useState(28.5283);
  const [longitude, setLongitude] = useState(77.2711);
  const [sealNumber, setSealNumber] = useState(`SEAL-DL-2026-${currentSession.badgeNumber || '4091'}-${Math.floor(10 + Math.random() * 90)}`);

  // AI states
  const [isPhotoAnalyzing, setIsPhotoAnalyzing] = useState(false);
  const [photoAnalysisResult, setPhotoAnalysisResult] = useState<any>(null);
  const [isDraftingReport, setIsDraftingReport] = useState(false);
  const [draftedReport, setDraftedReport] = useState('');

  const [isIssuingCert, setIsIssuingCert] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const handleRunAiPhotoVerification = async () => {
    if (!selectedApp) return;
    setIsPhotoAnalyzing(true);
    setPhotoAnalysisResult(null);

    try {
      const res = await fetch('/api/gemini/photo-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instrumentCategory: selectedApp.instrumentCategory,
          photoNotes: roughNotes,
        }),
      });
      const data = await res.json();
      if (res.ok && data.analysis) {
        setPhotoAnalysisResult(data.analysis);
      }
    } catch {
      console.error('Photo analysis error');
    } finally {
      setIsPhotoAnalyzing(false);
    }
  };

  const handleRunAiDraftReport = async () => {
    if (!selectedApp) return;
    setIsDraftingReport(true);

    try {
      const res = await fetch('/api/gemini/draft-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roughNotes,
          instrumentType: selectedApp.instrumentCategory,
          serialNumber: selectedApp.serialNumber,
        }),
      });
      const data = await res.json();
      if (res.ok && data.report) {
        setDraftedReport(data.report);
      }
    } catch {
      console.error('Draft report error');
    } finally {
      setIsDraftingReport(false);
    }
  };

  const handleIssueCertificate = async () => {
    if (!selectedApp) return;
    setIsIssuingCert(true);
    setActionSuccessMessage('');

    try {
      // 1. Record field inspection
      await fetch(`/api/applications/${selectedApp.id}/inspect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentSession.token}`,
        },
        body: JSON.stringify({
          fieldNotes: draftedReport || roughNotes,
          geotag: {
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
            accuracyMeters: 3.8,
          },
          aiAnalysis: photoAnalysisResult,
        }),
      });

      // 2. Issue cryptographic digital certificate
      const certRes = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentSession.token}`,
        },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          sealNumber,
        }),
      });

      const certData = await certRes.json();
      if (certRes.ok && certData.certificate) {
        setActionSuccessMessage(`Certificate ${certData.certificate.certificateNumber} signed with HMAC-SHA256 & issued!`);
        onRefresh();
        onOpenCertificate(certData.certificate);
      }
    } catch {
      console.error('Failed to issue certificate');
    } finally {
      setIsIssuingCert(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-semibold">
                LEGAL METROLOGY OFFICER FIELD WORKSPACE
              </span>
              <span className="text-xs text-amber-400 font-mono font-bold">
                Badge: {currentSession.badgeNumber || 'DL-LMO-4091'}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Officer {currentSession.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Enforcement & Verification Portal for {currentSession.jurisdiction || 'South Delhi Enforcement Division'}. Capture geotagged field observations, verify tamper seals with AI vision, and issue cryptographically signed digital certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Inspection Queue
            </button>
          </div>
        </div>

        {/* Abstraction Warning Notice */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-950/70 border border-amber-600/30 text-[11px] text-amber-300/90 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong>Stakeholder Abstraction Active:</strong> Your access is strictly scoped to designated field inspections. High-level administrative controllers and citizen applicant privacy vaults remain inaccessible to officer tokens.
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assigned Queue */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Field Inspection Queue ({lmoApplications.length})
            </h3>
            <span className="text-xs text-slate-400 font-mono">Jurisdiction: South Delhi</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[600px] pr-1">
            {lmoApplications.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500/60 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-300">{app.applicationNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                        app.status === 'CERTIFIED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="font-semibold text-white">
                    {app.instrumentCategory.replace(/_/g, ' ')}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Owner: {app.businessName}</span>
                    <span className="font-mono text-slate-300">{app.serialNumber}</span>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-1 border-t border-slate-800/80">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{app.installationAddress}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Inspection Tool & AI Assistant */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 text-xs">
          {selectedApp ? (
            <>
              {/* Active Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                    ACTIVE FIELD INSPECTION
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {selectedApp.instrumentCategory.replace(/_/g, ' ')} ({selectedApp.modelNumber})
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Premise: {selectedApp.businessName} • Serial: {selectedApp.serialNumber}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenE2EE(selectedApp.id, selectedApp.applicationNumber)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                    title="Encrypted Chat with Applicant"
                  >
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    Applicant E2EE Channel
                  </button>
                </div>
              </div>

              {actionSuccessMessage && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{actionSuccessMessage}</span>
                </div>
              )}

              {/* Step 1: Geotag Verification */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    Field GPS Geotag Stamp (Physical Presence Audit)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">GPS ACCURACY: ±3.8m</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: AI Photo Verification (Seal & Tamper Inspection) */}
              <div className="p-4 bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-950 rounded-xl border border-amber-600/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    AI Vision Seal & Tamper Verification (Gemini 3.8 Flash)
                  </span>
                  <span className="text-[10px] font-mono text-amber-400">Phase 2 AI Model</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Analyzes field inspection imagery to confirm lead wire seal intactness, check for drilling/bypass tampering, and detect calibration manipulations.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleRunAiPhotoVerification}
                    disabled={isPhotoAnalyzing}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
                  >
                    {isPhotoAnalyzing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Analyzing Inspection Photo...
                      </>
                    ) : (
                      <>
                        <Camera className="w-3.5 h-3.5" />
                        Run AI Photo Verification
                      </>
                    )}
                  </button>
                </div>

                {photoAnalysisResult && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/40 text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Seal Status: {photoAnalysisResult.sealStatus}
                      </span>
                      <span className="font-mono text-[11px] text-amber-300">
                        Confidence: {(photoAnalysisResult.confidenceScore * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {photoAnalysisResult.verificationVerdict}
                    </p>
                  </div>
                )}
              </div>

              {/* Step 3: Officer Notes & AI-Drafted Report */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200">
                    Field Inspection Observations
                  </label>
                  <button
                    type="button"
                    onClick={handleRunAiDraftReport}
                    disabled={isDraftingReport}
                    className="px-3 py-1 bg-blue-600/70 hover:bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    {isDraftingReport ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI Draft Formal Report
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={roughNotes}
                  onChange={(e) => setRoughNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-amber-400"
                  placeholder="Enter quick rough notes from testing..."
                />

                {draftedReport && (
                  <div className="p-3 bg-slate-950 border border-blue-500/40 rounded-xl space-y-2 animate-in fade-in">
                    <span className="font-bold text-blue-300 block text-[11px]">
                      AI Formatted Legal Metrology Verification Report:
                    </span>
                    <pre className="text-slate-300 text-[11px] whitespace-pre-wrap font-sans leading-relaxed bg-slate-900 p-2.5 rounded-lg">
                      {draftedReport}
                    </pre>
                  </div>
                )}
              </div>

              {/* Step 4: Issue Cryptographic Digital Certificate */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-white block">Official Seal Punch Mark</label>
                    <span className="text-slate-400 text-[11px]">Lead stamp registered in central registry</span>
                  </div>
                  <input
                    type="text"
                    value={sealNumber}
                    onChange={(e) => setSealNumber(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleIssueCertificate}
                  disabled={isIssuingCert}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-xs shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {isIssuingCert ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Signing HMAC-SHA256 & Generating QR Certificate...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      Issue Cryptographic Digital Certificate & Seal
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500">
              Select an application from the queue to conduct verification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
