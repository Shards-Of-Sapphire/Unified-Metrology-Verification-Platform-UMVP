import React, { useState, useEffect } from 'react';
import {
  UserSession,
  UserRole,
  MetrologyApplication,
  VerificationCertificate,
  AuditBlock,
  SecurityThreatEvent,
  SystemAnalytics,
} from './types';
import { Header } from './components/Header';
import { CitizenPortal } from './components/CitizenPortal';
import { LmoPortal } from './components/LmoPortal';
import { ControllerPortal } from './components/ControllerPortal';
import { GatcPortal } from './components/GatcPortal';
import { AuthModal } from './components/AuthModal';
import { NewApplicationModal } from './components/NewApplicationModal';
import { CertificateViewModal } from './components/CertificateViewModal';
import { PublicVerifyModal } from './components/PublicVerifyModal';
import { E2EEMessagingModal } from './components/E2EEMessagingModal';
import { GdprPrivacyModal } from './components/GdprPrivacyModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import {
  Shield,
  Lock,
  ShieldAlert,
  Database,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
  ArrowRight,
  ExternalLink,
  UserPlus,
} from 'lucide-react';

async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const INITIAL_CITIZEN_SESSION: UserSession = {
  id: 'usr-cit-101',
  name: 'Rahul Sharma (Apex Logistics)',
  email: 'rahul.sharma@apexlogistics.in',
  role: 'CITIZEN',
  token: typeof btoa !== 'undefined'
    ? btoa('usr-cit-101:CITIZEN:Rahul Sharma (Apex Logistics)::1725790000000')
    : 'mock-token-citizen-101',
  mfaVerified: true,
  loginTimestamp: new Date().toISOString(),
  maskedId: '07AAACA1234F1Z5',
  businessName: 'Apex Logistics & Retail Hub',
  phone: '+91 98110 44552',
  address: 'Shed 14, Okhla Industrial Area Phase-III',
  city: 'New Delhi',
  state: 'Delhi NCT',
  pincode: '110020',
};

export default function App() {
  // Session & Stakeholder View (with localStorage persistence)
  const [currentSession, setCurrentSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('umvp_session');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [activePortal, setActivePortal] = useState<UserRole>('CITIZEN');

  // Backend Data
  const [applications, setApplications] = useState<MetrologyApplication[]>([]);
  const [certificates, setCertificates] = useState<VerificationCertificate[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditBlock[]>([]);
  const [securityThreats, setSecurityThreats] = useState<SecurityThreatEvent[]>([]);
  const [analytics, setAnalytics] = useState<SystemAnalytics>({
    totalApplications: 4,
    activeCertificates: 2,
    pendingInspections: 2,
    rejectionRatePercent: 4.8,
    averageInspectionDays: 3.2,
    securityIncidentsBlocked: 14,
    heatmaps: [],
  });

  // Modal Dialogs
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'SIGN_IN' | 'SIGN_UP' | 'ACCOUNT_SETTINGS'>('SIGN_IN');
  const [authTargetRole, setAuthTargetRole] = useState<UserRole>('CITIZEN');

  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [isPublicVerifyOpen, setIsPublicVerifyOpen] = useState(false);
  const [publicVerifyCertId, setPublicVerifyCertId] = useState('CERT-DL-2026-8819');

  const [isCertificateViewOpen, setIsCertificateViewOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<VerificationCertificate | null>(null);

  const [isE2EEOpen, setIsE2EEOpen] = useState(false);
  const [e2eeTargetApp, setE2eeTargetApp] = useState<{ id: string; number: string }>({ id: '', number: '' });

  const [isGdprOpen, setIsGdprOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Security Abstraction Warning Banner
  const [accessDeniedNotice, setAccessDeniedNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, [currentSession]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyCertId = params.get('verify');
    if (verifyCertId) {
      setPublicVerifyCertId(verifyCertId);
      setIsPublicVerifyOpen(true);
    }
  }, []);

  const fetchAllData = async () => {
    try {
      const authHeader = currentSession?.token ? { Authorization: `Bearer ${currentSession.token}` } : {};

      // 1. Applications (filtered on server if authenticated)
      if (currentSession) {
        const appsData = await safeFetchJson<{ applications: MetrologyApplication[] }>('/api/applications', {
          headers: authHeader,
        });
        if (appsData?.applications) {
          setApplications(appsData.applications);
        }
      } else {
        setApplications([]);
      }

      // 2. Certificates (Public or Authenticated)
      const certsData = await safeFetchJson<{ certificates: VerificationCertificate[] }>('/api/certificates', {
        headers: authHeader,
      });
      if (certsData?.certificates) {
        setCertificates(certsData.certificates);
      }

      // 3. Audit Logs (Filtered by role)
      if (currentSession) {
        const auditData = await safeFetchJson<{ logs: AuditBlock[] }>('/api/audit/logs', {
          headers: authHeader,
        });
        if (auditData?.logs) {
          setAuditLogs(auditData.logs);
        }

        // 4. Threats
        const threatsData = await safeFetchJson<{ threats: SecurityThreatEvent[] }>('/api/threats', {
          headers: authHeader,
        });
        if (threatsData?.threats) {
          setSecurityThreats(threatsData.threats);
        }
      }

      // 5. Analytics
      const analyticsData = await safeFetchJson<{ analytics: SystemAnalytics }>('/api/analytics', {
        headers: authHeader,
      });
      if (analyticsData?.analytics) {
        setAnalytics(analyticsData.analytics);
      }
    } catch (err) {
      console.warn('Data sync notice:', err);
    }
  };

  // Stakeholder Abstraction Enforcer:
  // "The user shouldn't be able to view LMO portal and LMO can't access Controller portal. This strict role-based access control must be strictly enforced throughout the system."
  const handleSwitchPortalTab = (requestedRole: UserRole) => {
    setAccessDeniedNotice(null);

    // If user's active token role does not permit this portal, block direct viewing and initiate secure auth
    if (requestedRole === 'LMO' && currentSession?.role !== 'LMO') {
      setAccessDeniedNotice(
        'STAKEHOLDER ABSTRACTION ENFORCED: Citizen tokens are cryptographically forbidden from accessing the LMO Field Inspection Portal. Please authenticate with officer credentials.'
      );
      setAuthTargetRole('LMO');
      setAuthModalMode('SIGN_IN');
      setIsAuthModalOpen(true);
      return;
    }

    if (requestedRole === 'CONTROLLER_ADMIN' && currentSession?.role !== 'CONTROLLER_ADMIN') {
      setAccessDeniedNotice(
        'STAKEHOLDER ABSTRACTION ENFORCED: Strict separation of concerns forbids LMO and Citizen stakeholders from accessing the Controller Regulatory Command Enclave. Please authenticate with Administrator credentials.'
      );
      setAuthTargetRole('CONTROLLER_ADMIN');
      setAuthModalMode('SIGN_IN');
      setIsAuthModalOpen(true);
      return;
    }

    if (requestedRole === 'GATC' && currentSession?.role !== 'GATC') {
      setAccessDeniedNotice(
        'STAKEHOLDER ABSTRACTION ENFORCED: Strict separation of concerns forbids non-laboratory personnel from accessing the GATC Dashboard. Please authenticate with GATC credentials.'
      );
      setAuthTargetRole('GATC');
      setAuthModalMode('SIGN_IN');
      setIsAuthModalOpen(true);
      return;
    }

    setActivePortal(requestedRole);
  };

  const handleLoginSuccess = (newSession: UserSession) => {
    try {
      localStorage.removeItem('umvp_logged_out');
      localStorage.setItem('umvp_session', JSON.stringify(newSession));
    } catch {}
    setCurrentSession(newSession);
    setActivePortal(newSession.role);
    setAccessDeniedNotice(null);
  };

  const openSignIn = () => {
    setAuthTargetRole(activePortal === 'CITIZEN' ? 'CITIZEN' : activePortal);
    setAuthModalMode('SIGN_IN');
    setIsAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthTargetRole('CITIZEN');
    setAuthModalMode('SIGN_UP');
    setIsAuthModalOpen(true);
  };

  const openAccountSettings = () => {
    setAuthModalMode('ACCOUNT_SETTINGS');
    setAuthTargetRole('CITIZEN');
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('umvp_session');
      localStorage.setItem('umvp_logged_out', 'true');
    } catch {}
    setCurrentSession(null);
    setApplications([]);
    setActivePortal('CITIZEN');
    setAccessDeniedNotice(null);
  };

  const handleOpenCertificate = (cert: VerificationCertificate) => {
    setSelectedCertificate(cert);
    setIsCertificateViewOpen(true);
  };

  const handleOpenE2EE = (appId: string, appNumber: string) => {
    setE2eeTargetApp({ id: appId, number: appNumber });
    setIsE2EEOpen(true);
  };

  const handleAllocateLmo = async (appId: string, lmoId: string, lmoName: string, date: string) => {
    await fetch(`/api/applications/${appId}/allocate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentSession.token}`,
      },
      body: JSON.stringify({ lmoId, lmoName, scheduledDate: date }),
    });
    fetchAllData();
  };

  const latestAuditBlock = auditLogs[auditLogs.length - 1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header Navigation */}
      <Header
        currentSession={currentSession}
        onOpenLogin={() => {
          setAuthTargetRole(activePortal === 'PUBLIC' ? 'CITIZEN' : activePortal);
          openSignIn();
        }}
        onOpenSignUp={openSignUp}
        onOpenAccount={openAccountSettings}
        onLogout={handleLogout}
        onOpenPublicVerify={() => {
          setPublicVerifyCertId('CERT-DL-2026-8819');
          setIsPublicVerifyOpen(true);
        }}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        activePortal={activePortal}
        onSwitchPortalTab={handleSwitchPortalTab}
        securityIncidentsCount={analytics.securityIncidentsBlocked}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stakeholder Abstraction Violation Notice */}
        {accessDeniedNotice && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-600/80 text-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold block tracking-wide text-rose-300">
                  ZERO-TRUST STAKEHOLDER ISOLATION ACTIVE
                </span>
                <p className="text-slate-300 text-[11px] mt-0.5">{accessDeniedNotice}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setAuthTargetRole(activePortal === 'CITIZEN' ? 'LMO' : 'CONTROLLER_ADMIN');
                setIsAuthModalOpen(true);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow shrink-0 self-start sm:self-auto"
            >
              Verify Authorized Identity
            </button>
          </div>
        )}

        {/* Stakeholder Portal Views */}
        {activePortal === 'CITIZEN' && (
          currentSession ? (
            <CitizenPortal
              currentSession={currentSession}
              applications={applications}
              certificates={certificates}
              onOpenNewAppModal={() => setIsNewAppModalOpen(true)}
              onOpenE2EE={handleOpenE2EE}
              onOpenCertificate={handleOpenCertificate}
              onOpenGdpr={() => setIsGdprOpen(true)}
              onRefresh={fetchAllData}
            />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 text-center max-w-4xl mx-auto animate-in fade-in">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  OFFICIAL METROLOGY VERIFICATION PORTAL
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome to UMVP Citizen Portal
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  The national unified gateway for commercial weights and measuring instrument verifications under Section 24 of the Legal Metrology Act, 2009.
                </p>
              </div>

              {/* Action Cards: Sign In or Create Account */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl space-y-4 flex flex-col justify-between transition-all">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">Existing Citizen / Business</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Already registered? Sign in with your registered email and password to track instrument inspections, view digital certificates, and manage applications.
                    </p>
                  </div>
                  <button
                    onClick={openSignIn}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    Sign In to Your Account
                  </button>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 p-6 rounded-2xl space-y-4 flex flex-col justify-between transition-all">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">New User / First-Time Applicant</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Register your personal and enterprise details, GSTIN, and premise location to start submitting weighing or measuring instrument verification applications.
                    </p>
                  </div>
                  <button
                    onClick={openSignUp}
                    className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-slate-950" />
                    Create New Citizen Account
                  </button>
                </div>
              </div>

              {/* Quick Demo Login Option */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
                <span>Looking for quick testing?</span>
                <button
                  onClick={() => {
                    handleLoginSuccess(INITIAL_CITIZEN_SESSION);
                  }}
                  className="text-amber-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  One-Click Demo Citizen Login (Rahul Sharma)
                </button>
              </div>
            </div>
          )
        )}

        {activePortal === 'LMO' && (
          currentSession?.role === 'LMO' ? (
            <LmoPortal
              currentSession={currentSession}
              applications={applications}
              certificates={certificates}
              onOpenE2EE={handleOpenE2EE}
              onOpenCertificate={handleOpenCertificate}
              onRefresh={fetchAllData}
            />
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                Legal Metrology Officer (LMO) Portal Restricted
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                As mandated by the Department of Consumer Affairs, citizens are strictly abstracted from internal LMO field inspection workflows.
              </p>
              <button
                onClick={() => {
                  setAuthTargetRole('LMO');
                  setAuthModalMode('SIGN_IN');
                  setIsAuthModalOpen(true);
                }}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
              >
                Sign In as Legal Metrology Officer
              </button>
            </div>
          )
        )}

        {activePortal === 'CONTROLLER_ADMIN' && (
          currentSession?.role === 'CONTROLLER_ADMIN' ? (
            <ControllerPortal
              currentSession={currentSession}
              applications={applications}
              certificates={certificates}
              auditLogs={auditLogs}
              securityThreats={securityThreats}
              analytics={analytics}
              onRefresh={fetchAllData}
              onAllocateLmo={handleAllocateLmo}
            />
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                Central Regulatory Controller Portal Restricted
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Neither citizens nor LMO field officers possess permission to view system-wide regulatory analytics, threat feeds, or the master cryptographic ledger.
              </p>
              <button
                onClick={() => {
                  setAuthTargetRole('CONTROLLER_ADMIN');
                  setAuthModalMode('SIGN_IN');
                  setIsAuthModalOpen(true);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
              >
                Sign In as Controller & Administrator
              </button>
            </div>
          )
        )}

        {activePortal === 'GATC' && (
          currentSession?.role === 'GATC' ? (
            <GatcPortal />
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                Government Approved Test Centre (GATC) Portal Restricted
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Only authorized testing laboratories have access to this command centre to process incoming verification requests and update equipment calibration logs.
              </p>
              <button
                onClick={() => {
                  setAuthTargetRole('GATC');
                  setAuthModalMode('SIGN_IN');
                  setIsAuthModalOpen(true);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
              >
                Sign In as GATC Lab
              </button>
            </div>
          )
        )}      </main>

      {/* Cryptographic Ledger Live Footer Ticker */}
      <footer className="bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400 py-4 px-4 sm:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200">IMMUTABLE HASH-CHAINED AUDIT LEDGER</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CHAIN INTEGRITY: VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Latest Head Hash: {latestAuditBlock ? `${latestAuditBlock.hash.slice(0, 24)}...` : '7a9c81b2...'} • Total Blocks: {auditLogs.length}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span>Section 24 Legal Metrology Act, 2009</span>
            <span>•</span>
            <span>Digital Personal Data Protection Act, 2023</span>
            <span>•</span>
            <button
              onClick={() => {
                setPublicVerifyCertId('CERT-DL-2026-8819');
                setIsPublicVerifyOpen(true);
              }}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5" /> Public Verifier
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Action Button for DoCA Saathi AI */}
      <button
        onClick={() => setIsAiAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-2xl shadow-2xl flex items-center gap-2 text-xs transition-transform hover:scale-105"
      >
        <Sparkles className="w-4 h-4 text-slate-950" />
        <span>Ask DoCA Saathi AI</span>
      </button>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        targetRole={authTargetRole}
        currentSession={currentSession}
        initialMode={authModalMode}
      />

      {currentSession && (
        <NewApplicationModal
          isOpen={isNewAppModalOpen}
          onClose={() => setIsNewAppModalOpen(false)}
          currentSession={currentSession}
          onApplicationCreated={fetchAllData}
        />
      )}

      <PublicVerifyModal
        isOpen={isPublicVerifyOpen}
        onClose={() => setIsPublicVerifyOpen(false)}
        initialCertId={publicVerifyCertId}
      />

      <CertificateViewModal
        isOpen={isCertificateViewOpen}
        onClose={() => setIsCertificateViewOpen(false)}
        certificate={selectedCertificate}
        authToken={currentSession?.token || ''}
      />

      {currentSession && (
        <E2EEMessagingModal
          isOpen={isE2EEOpen}
          onClose={() => setIsE2EEOpen(false)}
          applicationId={e2eeTargetApp.id}
          applicationNumber={e2eeTargetApp.number}
          currentSession={currentSession}
        />
      )}

      {currentSession && (
        <GdprPrivacyModal
          isOpen={isGdprOpen}
          onClose={() => setIsGdprOpen(false)}
          currentSession={currentSession}
          onDataErased={fetchAllData}
        />
      )}

      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />
    </div>
  );
}
