import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClientUser, AuthProviderType, MfaMethodType, UserRole } from '../types';

interface AuthContextType {
  user: ClientUser | null;
  isAuthenticated: boolean;
  isMfaVerified: boolean;
  isAuthModalOpen: boolean;
  mfaStepActive: boolean;
  pendingUser: Partial<ClientUser> | null;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithGoogle: (customEmail?: string, customName?: string) => Promise<void>;
  sendSmsOtp: (phone: string, countryCode: string) => Promise<{ success: boolean; testOtp: string; message: string }>;
  verifySmsOtp: (phone: string, countryCode: string, otp: string) => Promise<boolean>;
  verifyMfa: (code: string, method: MfaMethodType) => Promise<boolean>;
  cancelMfaStep: () => void;
  logout: () => void;
  updateUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'vemar_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ClientUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to parse auth user from localStorage', e);
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mfaStepActive, setMfaStepActive] = useState(false);
  const [pendingUser, setPendingUser] = useState<Partial<ClientUser> | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    setMfaStepActive(false);
    setPendingUser(null);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setMfaStepActive(false);
    setPendingUser(null);
  };

  const cancelMfaStep = () => {
    setMfaStepActive(false);
    setPendingUser(null);
  };

  /**
   * Google / Gmail Single Sign-On flow
   */
  const loginWithGoogle = async (customEmail?: string, customName?: string) => {
    // Default to provided email or standard Google user
    const email = customEmail?.trim() || 'narendrav64@gmail.com';
    const name = customName?.trim() || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const partialUser: Partial<ClientUser> = {
      id: `usr_g_${Date.now().toString().slice(-6)}`,
      name,
      email,
      authProvider: 'google',
      organization: email.endsWith('@gmail.com') ? 'Private Capital Market Desk' : email.split('@')[1],
      role: 'broker_compliance',
      clearanceTier: 'TIER_1_SURVEILLANCE',
      mfaVerified: false,
      loginTime: new Date().toISOString()
    };

    setPendingUser(partialUser);
    setMfaStepActive(true); // Mandatory MFA prompt
  };

  /**
   * Phone SMS OTP request simulation
   */
  const sendSmsOtp = async (phone: string, countryCode: string) => {
    // Simulate carrier network dispatch
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      testOtp: '482910',
      message: `Verification SMS dispatched to ${countryCode} ${phone}. Standard SMS rates may apply.`
    };
  };

  /**
   * Phone SMS OTP verification
   */
  const verifySmsOtp = async (phone: string, countryCode: string, otp: string) => {
    // Accept valid 6-digit test OTPs
    const valid = otp.trim() === '482910' || (otp.trim().length === 6 && /^\d+$/.test(otp));
    if (!valid) return false;

    const fullPhone = `${countryCode} ${phone.trim()}`;
    const partialUser: Partial<ClientUser> = {
      id: `usr_sms_${Date.now().toString().slice(-6)}`,
      name: `Trader (+${phone.slice(-4)})`,
      email: `${phone.slice(-6)}@sms.vemar.internal`,
      phone: fullPhone,
      authProvider: 'sms',
      organization: countryCode === '+91' ? 'NSE / BSE Institutional Member' : 'US Broker-Dealer Member',
      role: 'retail_investor',
      clearanceTier: 'TIER_2_BROKER_EXECUTION',
      mfaVerified: false,
      loginTime: new Date().toISOString()
    };

    setPendingUser(partialUser);
    setMfaStepActive(true); // Mandatory MFA prompt
    return true;
  };

  /**
   * Multi-Factor Authentication (MFA) Verification
   * Required under SEBI CSCRF 2024 and SEC Cybersecurity terminal rules
   */
  const verifyMfa = async (code: string, method: MfaMethodType) => {
    const trimmed = code.trim();
    // Accept standard 6-digit TOTP (e.g. 739281, or any 6 digits for testing)
    const isValid = trimmed === '739281' || (trimmed.length === 6 && /^\d+$/.test(trimmed));
    if (!isValid) return false;

    if (!pendingUser) return false;

    const completeUser: ClientUser = {
      id: pendingUser.id || `usr_${Date.now()}`,
      name: pendingUser.name || 'Securities Analyst',
      email: pendingUser.email || 'trader@market.internal',
      phone: pendingUser.phone,
      authProvider: pendingUser.authProvider || 'google',
      mfaVerified: true,
      mfaMethod: method,
      role: pendingUser.role || 'broker_compliance',
      organization: pendingUser.organization || 'Institutional Market Desk',
      clearanceTier: pendingUser.clearanceTier || 'TIER_1_SURVEILLANCE',
      sessionToken: `VMR-TOK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      loginTime: new Date().toISOString()
    };

    setUser(completeUser);
    setMfaStepActive(false);
    setPendingUser(null);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setPendingUser(null);
    setMfaStepActive(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUserRole = (newRole: UserRole) => {
    if (user) {
      setUser({
        ...user,
        role: newRole
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && user.mfaVerified,
        isMfaVerified: !!user?.mfaVerified,
        isAuthModalOpen,
        mfaStepActive,
        pendingUser,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        sendSmsOtp,
        verifySmsOtp,
        verifyMfa,
        cancelMfaStep,
        logout,
        updateUserRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
