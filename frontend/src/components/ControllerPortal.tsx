import React, { useState, useEffect } from 'react';
import {
  MetrologyApplication,
  VerificationCertificate,
  AuditBlock,
  SecurityThreatEvent,
  SystemAnalytics,
  UserSession,
} from '../types';
import {
  Shield,
  Lock,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  BarChart3,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  ExternalLink,
  Server,
  Layers,
} from 'lucide-react';
import { DatabaseBrowser } from './DatabaseBrowser.tsx';

interface ControllerPortalProps {
  currentSession: UserSession;
  applications: MetrologyApplication[];
  certificates: VerificationCertificate[];
  auditLogs: AuditBlock[];
  securityThreats: SecurityThreatEvent[];
  analytics: SystemAnalytics;
  onRefresh: () => void;
  onAllocateLmo: (appId: string, lmoId: string, lmoName: string, date: string) => Promise<void>;
}

export const ControllerPortal: React.FC<ControllerPortalProps> = ({
  currentSession,
  applications,
  certificates,
  auditLogs,
  securityThreats,
  analytics,
  onRefresh,
  onAllocateLmo,
}) => {
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'AUDIT_TRAIL' | 'THREATS' | 'ALLOCATIONS' | 'POSTGRESQL_DB'>('ANALYTICS');

  // Database Status State
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isLoadingDbStatus, setIsLoadingDbStatus] = useState(false);

  useEffect(() => {
    fetchDbStatus();
  }, []);

  const fetchDbStatus = async () => {
    setIsLoadingDbStatus(true);
    try {
      const res = await fetch('/api/database/status');
      const data = await res.json();
      setDbStatus(data);
    } catch (e) {
      console.warn('Failed to load DB status:', e);
    } finally {
      setIsLoadingDbStatus(false);
    }
  };

  // Chain Verification State
  const [isVerifyingChain, setIsVerifyingChain] = useState(false);
  const [chainVerifyResult, setChainVerifyResult] = useState<any>(null);

  // Allocation State
  const [allocatingAppId, setAllocatingAppId] = useState<string | null>(null);
  const [selectedLmoId, setSelectedLmoId] = useState('lmo-malhotra-4091');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmittingAllocation, setIsSubmittingAllocation] = useState(false);

  // Search in audit logs
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  const handleVerifyChain = async () => {
    setIsVerifyingChain(true);
    setChainVerifyResult(null);

    try {
      const res = await fetch('/api/audit/verify-chain', {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentSession.token}` },
      });
      const data = await res.json();
      setChainVerifyResult(data);
    } catch {
      console.error('Chain verification failed');
    } finally {
      setIsVerifyingChain(false);
    }
  };

  const handleAllocateSubmit = async (appId: string) => {
    setIsSubmittingAllocation(true);
    try {
      await onAllocateLmo(
        appId,
        selectedLmoId,
        selectedLmoId === 'lmo-malhotra-4091' ? 'Inspector Vikram Malhotra (Badge: DL-LMO-4091)' : 'Inspector Priya Sen (Badge: DL-LMO-3012)',
        scheduledDate
      );
      setAllocatingAppId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingAllocation(false);
    }
  };

  const pendingAllocations = applications.filter((a) => a.status === 'PENDING_ALLOCATION');

  const filteredAuditLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.actorRole.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(auditSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold">
                CENTRAL REGULATORY CONTROLLER • HIGH-PRIVILEGE ENCLAVE
              </span>
              <span className="text-xs text-rose-300 font-mono">
                Jurisdiction: {currentSession.jurisdiction}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Controller Portal: {currentSession.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Executive oversight of India's Legal Metrology verification network. Monitor stakeholder access boundaries, detect fraud anomalies, inspect append-only cryptographic audit trails, and review non-compliance geographical heatmaps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Ledger & Threat Feeds
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'ANALYTICS'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            System Analytics & Heatmaps
          </button>
          <button
            onClick={() => setActiveTab('AUDIT_TRAIL')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'AUDIT_TRAIL'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            Cryptographic Audit Ledger ({auditLogs.length} Blocks)
          </button>
          <button
            onClick={() => setActiveTab('THREATS')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'THREATS'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Threats & Abstraction Violations ({securityThreats.length})
          </button>
          <button
            onClick={() => setActiveTab('ALLOCATIONS')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'ALLOCATIONS'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            LMO Allocation Queue ({pendingAllocations.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('POSTGRESQL_DB');
              fetchDbStatus();
            }}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'POSTGRESQL_DB'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4 text-emerald-400" />
            Cloud SQL (PostgreSQL)
          </button>
        </div>
      </div>

      {/* TAB 1: Analytics & Geographical Heatmap */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 block">Total Active Certificates</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                {analytics.activeCertificates.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Tamper-Proof & Sealed</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 block">Current Pendency Queue</span>
              <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
                {analytics.pendingInspections}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Under 5 business days</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 block">Rejection / Non-Conformity Rate</span>
              <span className="text-2xl font-bold font-mono text-rose-400 mt-1 block">
                {analytics.rejectionRatePercent}%
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Seal tampering / MPE exceed</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 block">Average Inspection Latency</span>
              <span className="text-2xl font-bold font-mono text-blue-400 mt-1 block">
                {analytics.averageInspectionDays} Days
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Target SLA: ≤ 4.0 Days</span>
            </div>
          </div>

          {/* Geographical Non-Compliance Heatmap */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-400" />
                  Geographical Non-Compliance Cluster Heatmap
                </h3>
                <p className="text-xs text-slate-400">
                  Clusters violation and complaint data geographically to guide Legal Metrology enforcement flying squads.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs border border-rose-500/30">
                Live Enforcement Feed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-2">
              {analytics.heatmaps.map((zone, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 space-y-2.5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 truncate">{zone.zone}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        zone.riskLevel === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : zone.riskLevel === 'MODERATE'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {zone.riskLevel} RISK
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Inspections Carried Out:</span>
                    <span className="font-mono text-white font-semibold">{zone.inspectionsCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Violation Rate:</span>
                    <span className="font-mono text-rose-400 font-bold">{zone.violationRate}%</span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        zone.riskLevel === 'HIGH'
                          ? 'bg-rose-500'
                          : zone.riskLevel === 'MODERATE'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${zone.violationRate * 8}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Hash-Chained Audit Ledger */}
      {activeTab === 'AUDIT_TRAIL' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Append-Only Hash-Chained Audit Ledger (SHA-256)
              </h3>
              <p className="text-xs text-slate-400">
                Every user interaction, allocation, and certification forms a cryptographic block linked by previous hash. Tampering is mathematically impossible to conceal.
              </p>
            </div>

            {/* Cryptographic Verifier Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleVerifyChain}
                disabled={isVerifyingChain}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow transition-all"
              >
                {isVerifyingChain ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Calculating SHA-256 Chain Hashes...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Verify Cryptographic Chain Integrity
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Chain Integrity Result Card */}
          {chainVerifyResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in ${
                chainVerifyResult.chainValid
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {chainVerifyResult.chainValid ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      LEDGER INTEGRITY MATHEMATICALLY VERIFIED: 100% UNTAMPERED
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                      CHAIN INTEGRITY VIOLATION DETECTED AT BLOCK #{chainVerifyResult.brokenIndex}
                    </>
                  )}
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  {chainVerifyResult.totalBlocksChecked} Blocks Verified
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 flex flex-wrap gap-4 pt-1 border-t border-emerald-800/40">
                <span>Genesis: {chainVerifyResult.genesisHash?.slice(0, 16)}...</span>
                <span>Merkle Head: {chainVerifyResult.latestMerkleRoot?.slice(0, 16)}...</span>
                <span>Verified At: {new Date(chainVerifyResult.verifiedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          )}

          {/* Search Filter */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={auditSearchQuery}
              onChange={(e) => setAuditSearchQuery(e.target.value)}
              placeholder="Search audit actions, actors, or resource IDs..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400 font-mono"
            />
          </div>

          {/* Blocks Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Block #</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor / Role</th>
                  <th className="p-3">Action Event</th>
                  <th className="p-3">Resource</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {filteredAuditLogs.map((block) => (
                  <tr key={block.index} className="hover:bg-slate-950/60 transition-colors">
                    <td className="p-3 font-bold text-amber-400">#{block.index}</td>
                    <td className="p-3 text-slate-400 whitespace-nowrap">
                      {new Date(block.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          block.actorRole === 'CONTROLLER_ADMIN'
                            ? 'bg-rose-500/20 text-rose-300'
                            : block.actorRole === 'LMO'
                            ? 'bg-amber-500/20 text-amber-300'
                            : block.actorRole === 'CITIZEN'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {block.actorRole}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-200">{block.action}</td>
                    <td className="p-3 text-slate-400">{block.resourceId}</td>
                    <td className="p-3 font-sans text-slate-300 max-w-xs truncate" title={block.details}>
                      {block.details}
                    </td>
                    <td className="p-3 text-emerald-400 text-[10px]" title={block.hash}>
                      {block.hash.slice(0, 10)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Security Threats & Stakeholder Abstraction Violations */}
      {activeTab === 'THREATS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              Real-Time Security Threats & Stakeholder Isolation Violations
            </h3>
            <p className="text-xs text-slate-400">
              Monitors unauthorized portal breach attempts (e.g. Citizen trying to view LMO portal or LMO attempting to view Controller portal), failed login spikes, and token anomalies.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {securityThreats.map((threat) => (
              <div
                key={threat.id}
                className="p-4 rounded-xl bg-slate-950 border border-rose-900/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold text-[10px] border border-rose-500/40">
                      {threat.severity} SEVERITY
                    </span>
                    <span className="font-bold text-white">{threat.threatType}</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">
                    {new Date(threat.timestamp).toLocaleTimeString()} • IP: {threat.actorIp}
                  </span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">{threat.description}</p>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Automatic Mitigation:</strong> {threat.mitigationAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LMO Allocation Queue */}
      {activeTab === 'ALLOCATIONS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              LMO Workload Scheduling & Inspection Allocation
            </h3>
            <p className="text-xs text-slate-400">
              Assign unallocated verification applications to qualified Legal Metrology Officers based on jurisdiction and workload.
            </p>
          </div>

          {pendingAllocations.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              All applications are currently allocated to enforcement officers.
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {pendingAllocations.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-amber-400">{app.applicationNumber}</span>
                      <h4 className="font-semibold text-white mt-0.5">
                        {app.instrumentCategory.replace(/_/g, ' ')} ({app.modelNumber})
                      </h4>
                      <p className="text-slate-400 text-[11px]">
                        Premise: {app.businessName} • Site: {app.installationAddress} ({app.city})
                      </p>
                    </div>

                    <button
                      onClick={() => setAllocatingAppId(allocatingAppId === app.id ? null : app.id)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow transition-all self-start sm:self-auto"
                    >
                      {allocatingAppId === app.id ? 'Cancel' : 'Allocate Officer'}
                    </button>
                  </div>

                  {allocatingAppId === app.id && (
                    <div className="p-4 bg-slate-900 rounded-xl border border-amber-500/40 space-y-3 animate-in fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 text-[11px] mb-1">Select Available LMO</label>
                          <select
                            value={selectedLmoId}
                            onChange={(e) => setSelectedLmoId(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs"
                          >
                            <option value="lmo-malhotra-4091">Inspector Vikram Malhotra (Badge: DL-LMO-4091)</option>
                            <option value="lmo-sen-3012">Inspector Priya Sen (Badge: DL-LMO-3012)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-300 text-[11px] mb-1">Scheduled Inspection Date</label>
                          <input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs font-mono"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleAllocateSubmit(app.id)}
                        disabled={isSubmittingAllocation}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow transition-all flex items-center gap-1.5"
                      >
                        {isSubmittingAllocation ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        Confirm Officer Allocation & Notify Stakeholder
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Cloud SQL PostgreSQL Database Management */}
      {activeTab === 'POSTGRESQL_DB' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Card */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Google Cloud SQL (PostgreSQL 15)</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ACTIVE INSTANCE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Relational data persistence tier with Drizzle ORM and resilient connection pooling.
                  </p>
                </div>
              </div>

              <button
                onClick={fetchDbStatus}
                disabled={isLoadingDbStatus}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDbStatus ? 'animate-spin' : ''}`} />
                Check DB Connection
              </button>
            </div>

            {/* Architecture Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800 text-xs">
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">Instance ID</span>
                <span className="text-white font-mono font-bold mt-1 block">
                  {dbStatus?.instance || 'ai-studio-d7d8e55d'}
                </span>
                <span className="text-[10px] text-emerald-400 mt-0.5 block">Developer Edition</span>
              </div>
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">Google Cloud Region</span>
                <span className="text-white font-mono font-bold mt-1 block">
                  {dbStatus?.region || 'asia-southeast1'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Singapore (Low Latency)</span>
              </div>
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">Database Engine</span>
                <span className="text-white font-mono font-bold mt-1 block">PostgreSQL 15</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">ACID Compliant</span>
              </div>
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">ORM & Connection</span>
                <span className="text-white font-mono font-bold mt-1 block">Drizzle ORM</span>
                <span className="text-[10px] text-emerald-400 mt-0.5 block">pg.Pool (Object Config)</span>
              </div>
            </div>
          </div>

          {/* Relational Tables Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              Provisioned PostgreSQL Schemas & Tables
            </h4>
            <p className="text-xs text-slate-400 mb-5">
              Production schema synchronized via Drizzle Kit migrations with strict foreign-key integrity and indexing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Table 1: Applications */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-rose-300">applications</span>
                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded font-mono text-[10px]">
                    {applications.length} rows
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Verification dossiers, instrument serial numbers, geotags, and LMO assignments.
                </p>
                <div className="mt-3 text-[10px] font-mono text-slate-500 space-y-0.5">
                  <div>Primary Key: id (varchar 64)</div>
                  <div>Indexes: applicant_id, status</div>
                </div>
              </div>

              {/* Table 2: Certificates */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-emerald-300">certificates</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono text-[10px]">
                    {certificates.length} rows
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Cryptographically sealed legal certificates with HMAC-SHA256 signatures and QR payloads.
                </p>
                <div className="mt-3 text-[10px] font-mono text-slate-500 space-y-0.5">
                  <div>Primary Key: id (varchar 64)</div>
                  <div>Unique: certificate_number</div>
                </div>
              </div>

              {/* Table 3: Audit Ledger */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-amber-300">audit_ledger</span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-mono text-[10px]">
                    {auditLogs.length} blocks
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Append-only cryptographic audit blockchain tracking all actions, logins, and verifications.
                </p>
                <div className="mt-3 text-[10px] font-mono text-slate-500 space-y-0.5">
                  <div>Primary Key: block_index (integer)</div>
                  <div>Hash-Chained: previous_hash → hash</div>
                </div>
              </div>

              {/* Table 4: Users */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-blue-300">users</span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded font-mono text-[10px]">
                    Synced
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  RBAC identity mapping linking Firebase Auth UIDs and officer badges.
                </p>
                <div className="mt-3 text-[10px] font-mono text-slate-500 space-y-0.5">
                  <div>Primary Key: id (uuid)</div>
                  <div>Unique: uid, email</div>
                </div>
              </div>

              {/* Table 5: E2EE Messages */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-purple-300">e2ee_messages</span>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded font-mono text-[10px]">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  AES-256-GCM zero-knowledge encrypted stakeholder communications between applicants and LMOs.
                </p>
                <div className="mt-3 text-[10px] font-mono text-slate-500 space-y-0.5">
                  <div>Primary Key: id (varchar 64)</div>
                  <div>Index: application_id</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live PostgreSQL Table Browser */}
          <DatabaseBrowser />
        </div>
      )}
    </div>
  );
};
