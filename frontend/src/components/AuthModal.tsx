import React, { useState } from 'react';
import { UserRole, UserSession } from '../types';
import { Shield, Lock, Key, AlertTriangle, CheckCircle2, X, RefreshCw } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
  targetRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  targetRole = 'CITIZEN',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(targetRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('GovtSecure@2026');
  const [mfaCode, setMfaCode] = useState(selectedRole === 'LMO' ? '123456' : selectedRole === 'CONTROLLER_ADMIN' ? '999888' : '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'CITIZEN') {
      setEmail('rahul.sharma@apexlogistics.in');
      setMfaCode('');
    } else if (role === 'LMO') {
      setEmail('v.malhotra@doca.gov.in');
      setMfaCode('123456');
    } else {
      setEmail('controller.skn@doca.gov.in');
      setMfaCode('999888');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
          email: email || (selectedRole === 'CITIZEN' ? 'rahul.sharma@apexlogistics.in' : selectedRole === 'LMO' ? 'v.malhotra@doca.gov.in' : 'controller.skn@doca.gov.in'),
          password,
          mfaCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
        return;
      }

      onLoginSuccess(data.user);
      onClose();
    } catch {
      setErrorMessage('Network error during authentication handshake. Check backend connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">SECURE UMVP AUTHENTICATION</h2>
              <p className="text-xs text-slate-400">Zero-Trust Role Verification & Cryptographic Token Issuance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Select Stakeholder Domain
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
            <button
              type="button"
              onClick={() => handleRoleChange('CITIZEN')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-center ${
                selectedRole === 'CITIZEN'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Citizen / User
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('LMO')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-center ${
                selectedRole === 'LMO'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              LMO Officer
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('CONTROLLER_ADMIN')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-center ${
                selectedRole === 'CONTROLLER_ADMIN'
                  ? 'bg-rose-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Controller Admin
            </button>
          </div>

          {/* Abstraction Guarantee Notice */}
          <div className="mb-5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Strict Stakeholder Abstraction: </span>
              <span className="text-slate-400">
                {selectedRole === 'CITIZEN' && 'Applicants can only access personal applications and encrypted chat. LMO and Controller portals are strictly forbidden.'}
                {selectedRole === 'LMO' && 'Field Officers have jurisdiction-scoped verification authority. Access to Controller portal and central config is strictly forbidden.'}
                {selectedRole === 'CONTROLLER_ADMIN' && 'High-privilege regulator oversight with tamper-proof audit trails, anomaly analytics, and LMO allocation.'}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Official Identifier / Email
              </label>
              <input
                type="email"
                value={email || (selectedRole === 'CITIZEN' ? 'rahul.sharma@apexlogistics.in' : selectedRole === 'LMO' ? 'v.malhotra@doca.gov.in' : 'controller.skn@doca.gov.in')}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password (Hashed at rest)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* MFA code for LMO and Controller Admin */}
            {(selectedRole === 'LMO' || selectedRole === 'CONTROLLER_ADMIN') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-amber-300 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" /> Mandatory MFA Security OTP
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Demo OTP: {selectedRole === 'LMO' ? '123456' : '999888'}
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder={selectedRole === 'LMO' ? '123456' : '999888'}
                  required
                  className="w-full bg-slate-950 border border-amber-500/50 rounded-lg px-3 py-2 text-sm text-amber-200 tracking-widest font-mono text-center focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                selectedRole === 'CITIZEN'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : selectedRole === 'LMO'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Cryptographic Credentials...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Authenticate as {selectedRole === 'CITIZEN' ? 'Citizen' : selectedRole === 'LMO' ? 'Legal Metrology Officer' : 'Controller Admin'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-950/80 px-6 py-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>SHA-256 session signature</span>
          <span>Legal Metrology Act, 2009 Compliant</span>
        </div>
      </div>
    </div>
  );
};
