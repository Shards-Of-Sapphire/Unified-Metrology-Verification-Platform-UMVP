import React, { useEffect, useState } from 'react';
import { UserRole, UserSession } from '../types';
import {
  Shield,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle2,
  X,
  RefreshCw,
  UserPlus,
  Building2,
  Phone,
  MapPin,
  Mail,
  User,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
  targetRole?: UserRole;
  currentSession: UserSession | null;
  initialMode?: 'SIGN_IN' | 'SIGN_UP' | 'ACCOUNT_SETTINGS';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  targetRole = 'CITIZEN',
  currentSession,
  initialMode = 'SIGN_IN',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(targetRole);
  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'SIGN_UP' | 'ACCOUNT_SETTINGS' | 'FORGOT_PASSWORD'>(initialMode);
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  // Common authentication credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign up profile information fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gdprConsent, setGdprConsent] = useState(true);

  // Account settings fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // MFA OTP for LMO, GATC & Controller
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(targetRole);
      setAuthMode(targetRole === 'CITIZEN' ? initialMode : 'SIGN_IN');
      setErrorMessage('');
      setResetSuccessMessage('');

      if (initialMode === 'ACCOUNT_SETTINGS' && currentSession) {
        setEmail(currentSession.email || '');
        setNewEmail(currentSession.email || '');
      } else if (initialMode === 'SIGN_IN') {
        if (targetRole === 'LMO') {
          setEmail('v.malhotra@doca.gov.in');
          setPassword('GovtSecure@2026');
          setMfaCode('123456');
        } else if (targetRole === 'GATC') {
          setEmail('gatc.lab04@doca.gov.in');
          setPassword('GovtSecure@2026');
          setMfaCode('123456');
        } else if (targetRole === 'CONTROLLER_ADMIN') {
          setEmail('controller.skn@doca.gov.in');
          setPassword('GovtSecure@2026');
          setMfaCode('999888');
        } else {
          setEmail(currentSession?.email || '');
          setPassword('');
          setMfaCode('');
        }
      } else if (initialMode === 'SIGN_UP') {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }

      // Reset visibility states
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
    }
  }, [currentSession, initialMode, isOpen, targetRole]);

  if (!isOpen) return null;

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    setResetSuccessMessage('');
    if (role !== 'CITIZEN') {
      setAuthMode('SIGN_IN');
    }
    if (role === 'CITIZEN') {
      setEmail(currentSession?.email || '');
      setPassword('');
      setMfaCode('');
    } else if (role === 'LMO') {
      setEmail('v.malhotra@doca.gov.in');
      setPassword('GovtSecure@2026');
      setMfaCode('123456');
    } else if (role === 'GATC') {
      setEmail('gatc.lab04@doca.gov.in');
      setPassword('GovtSecure@2026');
      setMfaCode('123456');
    } else {
      setEmail('controller.skn@doca.gov.in');
      setPassword('GovtSecure@2026');
      setMfaCode('999888');
    }
  };

  const handleFillDemoCitizen = () => {
    setSelectedRole('CITIZEN');
    setAuthMode('SIGN_IN');
    setEmail('rahul.sharma@apexlogistics.in');
    setPassword('GovtSecure@2026');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const isAccountSettings = authMode === 'ACCOUNT_SETTINGS';
      const isSignUp = authMode === 'SIGN_UP';
      const isForgotPassword = authMode === 'FORGOT_PASSWORD';

      if (isForgotPassword) {
        if (!email.trim()) {
          setErrorMessage('Please enter your registered email address.');
          setIsLoading(false);
          return;
        }

        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMessage(data.error || 'Could not send password reset request.');
          setIsLoading(false);
          return;
        }
        setResetSuccessMessage(data.message || 'Password reset link sent to your email.');
        setIsLoading(false);
        return;
      }

      if (isSignUp) {
        if (!fullName.trim() || !email.trim()) {
          setErrorMessage('Full name and a valid email address are required.');
          setIsLoading(false);
          return;
        }
        if (password.length < 8) {
          setErrorMessage('Password must be at least 8 characters in length.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match. Please re-enter your password.');
          setIsLoading(false);
          return;
        }
        if (!gdprConsent) {
          setErrorMessage('You must accept the statutory consent under DPDP & Legal Metrology Act.');
          setIsLoading(false);
          return;
        }
      }

      const res = await fetch(
        isAccountSettings ? '/api/auth/account' : isSignUp ? '/api/auth/signup' : '/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(isAccountSettings && currentSession?.token
              ? { Authorization: `Bearer ${currentSession.token}` }
              : {}),
          },
          body: JSON.stringify({
            role: selectedRole,
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            businessName: businessName.trim(),
            gstin: gstin.trim().toUpperCase(),
            address: address.trim(),
            city: city.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
            password,
            mfaCode,
            currentEmail: currentSession?.email,
            currentPassword,
            newEmail,
            newPassword,
          }),
        }
      );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              {authMode === 'SIGN_UP' ? <UserPlus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                {authMode === 'ACCOUNT_SETTINGS'
                  ? 'CITIZEN ACCOUNT SETTINGS'
                  : authMode === 'SIGN_UP'
                  ? 'CREATE NEW CITIZEN ACCOUNT'
                  : 'SECURE UMVP AUTHENTICATION'}
              </h2>
              <p className="text-xs text-slate-400">
                {authMode === 'SIGN_UP'
                  ? 'Unified Metrology Verification Portal • Commercial User Registration'
                  : 'Zero-Trust Role Verification & Cryptographic Token Issuance'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Sign In vs Sign Up Tabs for Citizen */}
          {selectedRole === 'CITIZEN' && authMode !== 'ACCOUNT_SETTINGS' && (
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('SIGN_IN');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  authMode === 'SIGN_IN'
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('SIGN_UP');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  authMode === 'SIGN_UP'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Create Account
              </button>
            </div>
          )}

          {authMode === 'ACCOUNT_SETTINGS' && (
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200">
              Update your registered citizen email address, password, or both. Your current password is required to save changes.
            </div>
          )}

          {/* Role Selector Tabs (Only in Sign In mode) */}
          {authMode === 'SIGN_IN' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Stakeholder Domain
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleRoleChange('CITIZEN')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all text-center ${
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
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all text-center ${
                    selectedRole === 'LMO'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  LMO Officer
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('GATC')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all text-center ${
                    selectedRole === 'GATC'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  GATC Lab
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('CONTROLLER_ADMIN')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all text-center ${
                    selectedRole === 'CONTROLLER_ADMIN'
                      ? 'bg-rose-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Controller Admin
                </button>
              </div>
            </div>
          )}

          {/* Stakeholder Abstraction Notice */}
          {authMode !== 'ACCOUNT_SETTINGS' && (
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Strict Stakeholder Abstraction: </span>
                <span className="text-slate-400">
                  {selectedRole === 'CITIZEN' &&
                    'Applicants can only access personal applications and encrypted chat. LMO and Controller portals are strictly forbidden.'}
                  {selectedRole === 'LMO' &&
                    'Field Officers have jurisdiction-scoped verification authority. Access to Controller portal and central config is strictly forbidden.'}
                  {selectedRole === 'CONTROLLER_ADMIN' &&
                    'High-privilege regulator oversight with tamper-proof audit trails, anomaly analytics, and LMO allocation.'}
                </span>
              </div>
            </div>
          )}

          {/* Quick Demo Autofill Helper for Testing */}
          {authMode === 'SIGN_IN' && selectedRole === 'CITIZEN' && (
            <div className="flex items-center justify-between p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Want to test with a pre-configured account?
              </span>
              <button
                type="button"
                onClick={handleFillDemoCitizen}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-semibold transition-colors"
              >
                Use Demo (Rahul Sharma)
              </button>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* =========================================
                CREATE ACCOUNT (SIGN_UP) FULL FIELDS
               ========================================= */}
            {authMode === 'SIGN_UP' && (
              <div className="space-y-4">
                {/* 1. Personal & Contact Information */}
                <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    1. Applicant Identity & Contact Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="e.g. Priya Patel"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Official Email Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="e.g. priya.patel@patelagri.in"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Mobile / Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="+91 98220 12345"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Commercial Enterprise Information */}
                <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    2. Commercial Enterprise / Establishment Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Business / Enterprise Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                        placeholder="e.g. Patel Agri Logistics Pvt Ltd"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        GSTIN / Business Reg No <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        required
                        placeholder="e.g. 24AABCP9912K1Z8"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Premise & Installation Address */}
                <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    3. Premise & Installation Address
                  </span>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Street / Industrial Premise Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="e.g. Plot 12, GIDC Industrial Estate Phase-II"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        City / District <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="Ahmedabad"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        State / UT <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        placeholder="Gujarat"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Pincode <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        required
                        maxLength={6}
                        placeholder="380015"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Security Passwords */}
                <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    4. Account Credentials & Security
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Create Password (min. 8 chars) <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={8}
                          placeholder="At least 8 characters"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-9 py-2 text-sm text-white focus:outline-none focus:border-purple-400 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Confirm Password <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                          placeholder="Re-enter password"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-9 py-2 text-sm text-white focus:outline-none focus:border-purple-400 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statutory DPDP & Legal Metrology Consent */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gdprConsent}
                      onChange={(e) => setGdprConsent(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-0 w-4 h-4 shrink-0"
                    />
                    <span className="text-slate-300 text-[11px] leading-relaxed">
                      I declare that all information entered is authentic. I agree to digital registration and verification under the <strong>Legal Metrology Act, 2009</strong> and consent to identity processing under the <strong>Digital Personal Data Protection Act, 2023</strong>.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* =========================================
                SIGN IN VIEW FIELDS
               ========================================= */}
            {authMode === 'SIGN_IN' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Official Identifier / Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={
                        selectedRole === 'CITIZEN'
                          ? 'Enter your registered citizen email'
                          : selectedRole === 'LMO'
                          ? 'v.malhotra@doca.gov.in'
                          : selectedRole === 'GATC'
                          ? 'gatc.lab04@doca.gov.in'
                          : 'controller.skn@doca.gov.in'
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Password (Cryptographically verified)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('FORGOT_PASSWORD');
                        setErrorMessage('');
                        setResetSuccessMessage('');
                      }}
                      className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your account password"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-9 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* MFA OTP for LMO, GATC and Controller Admin */}
                {(selectedRole === 'LMO' || selectedRole === 'GATC' || selectedRole === 'CONTROLLER_ADMIN') && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-amber-300 flex items-center gap-1">
                        <Key className="w-3.5 h-3.5" /> Mandatory MFA Security OTP
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Demo OTP: {selectedRole === 'CONTROLLER_ADMIN' ? '999888' : '123456'}
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      placeholder={selectedRole === 'CONTROLLER_ADMIN' ? '999888' : '123456'}
                      required
                      className="w-full bg-slate-950 border border-amber-500/50 rounded-lg px-3 py-2 text-sm text-amber-200 tracking-widest font-mono text-center focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>
            )}

            {/* =========================================
                FORGOT PASSWORD VIEW FIELDS
               ========================================= */}
            {authMode === 'FORGOT_PASSWORD' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-blue-300">
                    <Key className="w-4 h-4 text-blue-400" />
                    Statutory Password Recovery Procedure
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Enter your registered official email address below. A cryptographically signed verification link and password reset OTP will be dispatched immediately.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Registered Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="e.g. rahul.sharma@apexlogistics.in"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                {resetSuccessMessage && (
                  <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{resetSuccessMessage}</span>
                  </div>
                )}
              </div>
            )}

            {/* =========================================
                ACCOUNT SETTINGS VIEW FIELDS
               ========================================= */}
            {authMode === 'ACCOUNT_SETTINGS' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-9 py-2 text-sm text-white focus:outline-none focus:border-blue-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">New Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={8}
                      placeholder="Leave blank to keep current password"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-9 py-2 text-sm text-white focus:outline-none focus:border-blue-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                authMode === 'FORGOT_PASSWORD'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : selectedRole === 'CITIZEN'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : selectedRole === 'LMO'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : selectedRole === 'GATC'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing Request...
                </>
              ) : (
                <>
                  {authMode === 'SIGN_UP' ? (
                    <UserPlus className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {authMode === 'FORGOT_PASSWORD'
                    ? 'Send Password Reset Verification'
                    : authMode === 'SIGN_UP'
                    ? 'Create Citizen Account & Sign In'
                    : authMode === 'ACCOUNT_SETTINGS'
                    ? 'Save Account Changes'
                    : `Authenticate as ${
                        selectedRole === 'CITIZEN'
                          ? 'Citizen'
                          : selectedRole === 'LMO'
                          ? 'Legal Metrology Officer'
                          : selectedRole === 'GATC'
                          ? 'GATC Test Officer'
                          : 'Controller Admin'
                      }`}
                </>
              )}
            </button>

            {/* Helper links */}
            {authMode === 'FORGOT_PASSWORD' && (
              <div className="text-center pt-2 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('SIGN_IN');
                    setErrorMessage('');
                    setResetSuccessMessage('');
                  }}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  ← Return to Sign In
                </button>
              </div>
            )}

            {selectedRole === 'CITIZEN' && authMode !== 'ACCOUNT_SETTINGS' && authMode !== 'FORGOT_PASSWORD' && (
              <div className="text-center pt-2 text-xs text-slate-400">
                {authMode === 'SIGN_UP' ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('SIGN_IN');
                        setErrorMessage('');
                      }}
                      className="text-blue-400 hover:underline font-semibold"
                    >
                      Sign In here
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('SIGN_UP');
                        setErrorMessage('');
                      }}
                      className="text-blue-400 hover:underline font-semibold"
                    >
                      Create citizen account
                    </button>
                  </span>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-950/80 px-6 py-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
          <span>SHA-256 session signature</span>
          <span>Legal Metrology Act, 2009 Compliant</span>
        </div>
      </div>
    </div>
  );
};
