import React from 'react';
import { UserSession, UserRole } from '../types';
import { Shield, Lock, ShieldAlert, CheckCircle2, User, FileText, QrCode, LogOut, Sparkles, UserPlus } from 'lucide-react';

interface HeaderProps {
  currentSession: UserSession | null;
  onOpenLogin: () => void;
  onOpenSignUp?: () => void;
  onOpenAccount: () => void;
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
  onOpenSignUp,
  onOpenAccount,
  onLogout,
  onOpenPublicVerify,
  onOpenAiAssistant,
  activePortal,
  onSwitchPortalTab,
  securityIncidentsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 text-white backdrop-blur-md">
      <div className="border-b border-slate-800/60 bg-slate-950/80 px-4 py-1.5 text-[11px] text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="inline-flex items-center gap-1.5 font-medium text-amber-300">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              GOVERNMENT OF INDIA
            </span>
            <span className="hidden text-slate-600 md:inline">|</span>
            <span className="hidden md:inline">Ministry of Consumer Affairs</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <Lock className="h-3 w-3" /> E2EE
            </span>
            <span className="inline-flex items-center gap-1 text-sky-400">
              <Shield className="h-3 w-3" /> DPDP
            </span>
            {securityIncidentsCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-700/50 bg-amber-950/60 px-2 py-0.5 text-amber-300">
                <ShieldAlert className="h-3 w-3" /> {securityIncidentsCount} blocked
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/40 bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-900/30">
            <Shield className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <h1 className="flex items-center gap-2 text-base font-bold tracking-tight text-white">
              UMVP
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-300">
                Portal
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Unified metrology verification</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/75 p-1 text-[11px]">
          <button
            onClick={() => onSwitchPortalTab('CITIZEN')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activePortal === 'CITIZEN'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Citizen
            </span>
          </button>
          <button
            onClick={() => onSwitchPortalTab('LMO')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activePortal === 'LMO'
                ? 'bg-amber-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> LMO
            </span>
          </button>
          <button
            onClick={() => onSwitchPortalTab('CONTROLLER_ADMIN')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activePortal === 'CONTROLLER_ADMIN'
                ? 'bg-rose-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Controls
            </span>
          </button>
          <button
            onClick={() => onSwitchPortalTab('GATC')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activePortal === 'GATC'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> GATC Lab
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPublicVerify}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:border-slate-600 hover:text-white"
            title="Verify Certificate"
          >
            <QrCode className="h-3.5 w-3.5 text-emerald-400" /> Verify
          </button>

          <button
            onClick={onOpenAiAssistant}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-700/40 bg-amber-950/40 px-3 py-1.5 text-[11px] font-medium text-amber-200 hover:bg-amber-900/50"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> AI
          </button>

          {currentSession ? (
            <div className="flex items-center gap-2 border-l border-slate-800 pl-2">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-slate-200">
                  {currentSession.name}
                  {currentSession.mfaVerified && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                </div>
                <div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">
                  {currentSession.role}
                </div>
              </div>
              <button
                onClick={onOpenAccount}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-[10px] font-semibold text-slate-200 hover:text-white"
              >
                Account
              </button>
              <button
                onClick={onLogout}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-300"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:text-white"
              >
                Sign In
              </button>
              <button
                onClick={onOpenSignUp || onOpenLogin}
                className="rounded-lg bg-amber-400 px-3 py-1.5 text-[11px] font-semibold text-slate-950 hover:bg-amber-300"
              >
                Create
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
