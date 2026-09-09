import React from 'react';
import { UserSession, UserRole } from '../types';
import { Shield, Lock, ShieldAlert, CheckCircle2, User, FileText, QrCode, LogOut, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentSession: UserSession | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenPublicVerify: () => void;
  onOpenAiAssistant: () => void;
  activePortal: UserRole | 'PUBLIC';
  onSwitchPortalTab: (role: UserRole) => void;
  securityIncidentsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentSession,
  onOpenLogin,
  onLogout,
  onOpenPublicVerify,
  onOpenAiAssistant,
  activePortal,
  onSwitchPortalTab,
  securityIncidentsCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      {/* Top Gov Bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-amber-400">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            GOVERNMENT OF INDIA
          </span>
          <span className="text-slate-500">|</span>
          <span>Ministry of Consumer Affairs, Food & Public Distribution</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-300">Department of Legal Metrology (UMVP v2.6)</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-emerald-400 font-mono">
            <Lock className="w-3 h-3" /> E2EE AES-256 Enabled
          </span>
          <span className="flex items-center gap-1 text-blue-400 font-mono">
            <Shield className="w-3 h-3" /> GDPR / DPDP Compliant
          </span>
          {securityIncidentsCount > 0 && (
            <span className="flex items-center gap-1 text-amber-300 font-mono bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800/50">
              <ShieldAlert className="w-3 h-3 text-amber-400" /> {securityIncidentsCount} Threats Blocked
            </span>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center shadow-md shadow-amber-900/30 border border-amber-400/40">
            <Shield className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                UMVP
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  National Portal
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">Unified Metrology Verification & Tamper-Proof Audit System</p>
          </div>
        </div>

        {/* Stakeholder Portal Switcher Tabs (With strict abstraction indicator) */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onSwitchPortalTab('CITIZEN')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activePortal === 'CITIZEN'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Citizen Portal
          </button>
          <button
            onClick={() => onSwitchPortalTab('LMO')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activePortal === 'LMO'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            LMO Field Portal
          </button>
          <button
            onClick={() => onSwitchPortalTab('CONTROLLER_ADMIN')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activePortal === 'CONTROLLER_ADMIN'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Controller & Admin
          </button>
        </div>

        {/* Right Tools & User Info */}
        <div className="flex items-center gap-2.5">
          {/* Public QR Verification */}
          <button
            onClick={onOpenPublicVerify}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Scan or Verify Certificate QR"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
            Verify Certificate
          </button>

          {/* AI Saathi Assistant */}
          <button
            onClick={onOpenAiAssistant}
            className="px-3 py-1.5 text-xs font-medium text-amber-200 hover:text-amber-100 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/50 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            DoCA AI Saathi
          </button>

          {/* Active Stakeholder Profile */}
          {currentSession ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-200 flex items-center justify-end gap-1">
                  {currentSession.name}
                  {currentSession.mfaVerified && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" title="MFA Verified Session" />
                  )}
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  Role: <span className="text-amber-400 font-bold">{currentSession.role}</span>
                  {currentSession.badgeNumber && ` • ${currentSession.badgeNumber}`}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Switch Stakeholder / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              Secure Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
