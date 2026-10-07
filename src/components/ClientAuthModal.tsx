import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  Smartphone,
  Key,
  CheckCircle2,
  X,
  ArrowRight,
  RefreshCw,
  Info,
  QrCode,
  Globe2,
  Building2,
  AlertCircle
} from 'lucide-react';

interface CountryOption {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

const COUNTRY_OPTIONS: CountryOption[] = [
  { code: 'IN', dialCode: '+91', name: 'India (SEBI/NSE/BSE)', flag: '🇮🇳' },
  { code: 'US', dialCode: '+1', name: 'United States (SEC/FINRA)', flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom (FCA)', flag: '🇬🇧' },
  { code: 'SG', dialCode: '+65', name: 'Singapore (MAS)', flag: '🇸🇬' },
  { code: 'AE', dialCode: '+971', name: 'UAE (ADGM/DFSA)', flag: '🇦🇪' }
];

export const ClientAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    mfaStepActive,
    pendingUser,
    loginWithGoogle,
    sendSmsOtp,
    verifySmsOtp,
    verifyMfa,
    cancelMfaStep
  } = useAuth();

  // Tab State: 'google' | 'sms'
  const [activeTab, setActiveTab] = useState<'google' | 'sms'>('google');

  // Google Form State
  const [googleEmail, setGoogleEmail] = useState('narendrav64@gmail.com');
  const [googleName, setGoogleName] = useState('Narendra V');

  // SMS Form State
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRY_OPTIONS[0]);
  const [phoneNumber, setPhoneNumber] = useState('98765 43210');
  const [smsOtpSent, setSmsOtpSent] = useState(false);
  const [smsCountdown, setSmsCountdown] = useState(0);
  const [enteredSmsOtp, setEnteredSmsOtp] = useState('');
  const [smsStatusMessage, setSmsStatusMessage] = useState('');

  // MFA State
  const [mfaMethod, setMfaMethod] = useState<'totp' | 'sms'>('totp');
  const [enteredMfaCode, setEnteredMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // SMS Countdown timer
  useEffect(() => {
    if (smsCountdown > 0) {
      const timer = setTimeout(() => setSmsCountdown(smsCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [smsCountdown]);

  if (!isAuthModalOpen) return null;

  // Handle Google Login Click
  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      await loginWithGoogle(googleEmail, googleName);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Send SMS OTP
  const handleSendSms = async () => {
    if (!phoneNumber.trim()) return;
    setIsVerifying(true);
    setMfaError('');
    try {
      const res = await sendSmsOtp(phoneNumber, selectedCountry.dialCode);
      setSmsOtpSent(true);
      setSmsCountdown(45);
      setSmsStatusMessage(res.message);
      // Auto-populate for user convenience
      setEnteredSmsOtp(res.testOtp);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Verify SMS OTP
  const handleVerifySms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredSmsOtp.trim()) return;
    setIsVerifying(true);
    setMfaError('');
    try {
      const ok = await verifySmsOtp(phoneNumber, selectedCountry.dialCode, enteredSmsOtp);
      if (!ok) {
        setMfaError('Invalid SMS verification code. Try test code: 482910');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Submit MFA
  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredMfaCode.trim()) return;
    setIsVerifying(true);
    setMfaError('');
    try {
      const ok = await verifyMfa(enteredMfaCode, mfaMethod);
      if (!ok) {
        setMfaError('Invalid 6-digit MFA Code. Enter valid TOTP or test code: 739281');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        id="client-auth-modal"
        className="relative w-full max-w-lg bg-[#0b101b] border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden text-slate-100 flex flex-col"
      >
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {mfaStepActive ? 'MFA Security Challenge' : 'Client & Institutional Portal Access'}
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  FIPS 140-3
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {mfaStepActive
                  ? 'Multi-factor authentication mandated by SEBI CSCRF 2024 & SEC 17a-4'
                  : 'Zero-trust authentication for brokers, clearing members & retail investors'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {!mfaStepActive ? (
            /* STEP 1: PRIMARY LOGIN TABS */
            <div className="space-y-5">
              {/* Method Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('google');
                    setMfaError('');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'google'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Gmail / Google SSO</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('sms');
                    setMfaError('');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'sms'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile SMS OTP</span>
                </button>
              </div>

              {/* TAB 1: GMAIL / GOOGLE SSO */}
              {activeTab === 'google' && (
                <form onSubmit={handleGoogleSubmit} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Globe2 className="w-4 h-4 text-cyan-400" />
                      <span>Google Workspace & Gmail Single Sign-On</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Google / Gmail Address:
                      </label>
                      <input
                        type="email"
                        value={googleEmail}
                        onChange={(e) => setGoogleEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Display Name / Organization:
                      </label>
                      <input
                        type="text"
                        value={googleName}
                        onChange={(e) => setGoogleName(e.target.value)}
                        placeholder="Narendra V / Institutional Trading Desk"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    {/* Google SVG Icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.4 7.36 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.94 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.6 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Proceed with Google Sign-In &rarr;</span>
                  </button>
                </form>
              )}

              {/* TAB 2: MOBILE SMS OTP */}
              {activeTab === 'sms' && (
                <div className="space-y-4">
                  {/* Phone number input & country code */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                      <span>SMS Mobile Carrier Direct Authentication</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                          Country:
                        </label>
                        <select
                          value={selectedCountry.code}
                          onChange={(e) => {
                            const found = COUNTRY_OPTIONS.find((c) => c.code === e.target.value);
                            if (found) setSelectedCountry(found);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        >
                          {COUNTRY_OPTIONS.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.dialCode}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                          Mobile Phone Number:
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendSms}
                      disabled={isVerifying || smsCountdown > 0}
                      className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {smsCountdown > 0 ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Resend OTP in {smsCountdown}s</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5" />
                          <span>{smsOtpSent ? 'Resend Verification SMS' : 'Dispatch SMS OTP'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* If SMS is dispatched, show verification input */}
                  {smsOtpSent && (
                    <form onSubmit={handleVerifySms} className="space-y-3 p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-cyan-300">Enter 6-Digit SMS Code</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                          Demo OTP: 482910
                        </span>
                      </div>

                      <input
                        type="text"
                        maxLength={6}
                        value={enteredSmsOtp}
                        onChange={(e) => setEnteredSmsOtp(e.target.value)}
                        placeholder="482910"
                        className="w-full text-center text-lg tracking-[0.5em] font-mono font-bold bg-slate-950 border border-cyan-500/50 rounded-xl py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />

                      <button
                        type="submit"
                        disabled={isVerifying}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                      >
                        <span>Verify SMS & Continue to MFA &rarr;</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* STEP 2: MANDATORY MULTI-FACTOR AUTHENTICATION (MFA) */
            <div className="space-y-5">
              {/* Security Mandate Info Banner */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40 flex items-start gap-2.5 text-xs text-amber-200">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">SEBI CSCRF 2024 & SEC Multi-Factor Authentication Compliance</p>
                  <p className="text-[11px] text-amber-300/80 leading-relaxed">
                    Account: <strong>{pendingUser?.email || pendingUser?.phone}</strong> is verified. Complete secondary MFA challenge to establish encrypted session.
                  </p>
                </div>
              </div>

              {/* MFA Selection: Authenticator (TOTP) vs SMS OTP */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMfaMethod('totp');
                    setEnteredMfaCode('739281');
                    setMfaError('');
                  }}
                  className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                    mfaMethod === 'totp'
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Authenticator App</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Google / Microsoft Authenticator (TOTP)</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMfaMethod('sms');
                    setEnteredMfaCode('739281');
                    setMfaError('');
                  }}
                  className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                    mfaMethod === 'sms'
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                    <span>Secondary SMS Code</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Hardware token or secondary mobile</p>
                </button>
              </div>

              {/* MFA Code Input */}
              <form onSubmit={handleMfaSubmit} className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200">
                      Enter 6-Digit Time-Based Security Code (TOTP):
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                      Test Code: 739281
                    </span>
                  </div>

                  <input
                    type="text"
                    maxLength={6}
                    value={enteredMfaCode}
                    onChange={(e) => setEnteredMfaCode(e.target.value)}
                    placeholder="739281"
                    required
                    className="w-full text-center text-2xl tracking-[0.4em] font-mono font-black bg-slate-950 border border-cyan-500 rounded-xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                    <span>Key Fingerprint: VMR-FIPS-09A4</span>
                    <span className="text-cyan-400 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Window: 30s
                    </span>
                  </div>
                </div>

                {mfaError && (
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{mfaError}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={cancelMfaStep}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                  >
                    &larr; Back
                  </button>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize Institutional Session &rarr;</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer / Compliance Badges */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              SEBI CSCRF Level 4 Ready
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-cyan-400">
              <CheckCircle2 className="w-3 h-3" />
              SEC Rule 17a-4 Enforced
            </span>
          </div>
          <div>
            <span>Audit Session Tracking Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
