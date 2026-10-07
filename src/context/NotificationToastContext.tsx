import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThreatNotificationToast, NotificationToastType, ThreatLevel, Jurisdiction, ThreatChannel } from '../types';
import { playThreatChime } from '../utils/audioAlert';

export interface NotifyRegulatoryAlertOptions {
  title?: string;
  subtitle?: string;
  entityName: string;
  threatType?: 'voice_anomaly' | 'high_risk_trade' | 'disinformation_pump' | 'unregistered_broker' | 'forged_circular' | string;
  riskScore: number;
  threatLevel?: ThreatLevel;
  channel?: ThreatChannel | string;
  statutoryRule?: string;
  regulatoryBody?: string;
  jurisdiction?: Jurisdiction;
  message?: string;
  acousticMarkers?: string[];
  haltStatus?: string;
  persistent?: boolean;
  suggestedActions?: string[];
  onInspect?: () => void;
  onExportPDF?: () => void;
  onQuarantine?: () => void;
  onLogToAudit?: () => Promise<string | void> | void;
  durationMs?: number;
}

interface NotifyVoiceSpoofOptions {
  entityName?: string;
  confidence: number;
  message?: string;
  channel?: string;
  markers?: string[];
  haltStatus?: string;
  statutoryRule?: string;
  regulatoryBody?: string;
  persistent?: boolean;
  onInspect?: () => void;
  onExportPDF?: () => void;
  onLogToAudit?: () => Promise<string | void> | void;
  durationMs?: number;
}

interface NotifyHighRiskEntityOptions {
  entityName: string;
  riskScore: number;
  message?: string;
  channel?: string;
  violation?: string;
  statutoryRule?: string;
  regulatoryBody?: string;
  haltStatus?: string;
  persistent?: boolean;
  onInspect?: () => void;
  onExportPDF?: () => void;
  onQuarantine?: () => void;
  onLogToAudit?: () => Promise<string | void> | void;
  durationMs?: number;
}

interface NotificationToastContextType {
  toasts: ThreatNotificationToast[];
  soundEnabled: boolean;
  toggleSound: () => void;
  notifyThreat: (toast: Omit<ThreatNotificationToast, 'id' | 'timestamp'>) => string;
  notifyRegulatoryAlert: (options: NotifyRegulatoryAlertOptions) => string;
  notifyVoiceSpoof: (options: NotifyVoiceSpoofOptions) => string;
  notifyHighRiskEntity: (options: NotifyHighRiskEntityOptions) => string;
  notifyPreTradeHalt: (options: {
    symbol: string;
    reason: string;
    riskScore: number;
    rule?: string;
    persistent?: boolean;
    onInspect?: () => void;
    onLogToAudit?: () => Promise<string | void> | void;
  }) => string;
  notifyInfo: (title: string, message: string) => string;
  notifySuccess: (title: string, message: string) => string;
  markToastAsAuditLogged: (id: string, recordId?: string) => void;
  dismissToast: (id: string) => void;
  clearAll: () => void;
}

const NotificationToastContext = createContext<NotificationToastContextType | undefined>(undefined);

export const NotificationToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ThreatNotificationToast[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('vemar_alert_sound') !== 'false';
  });

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('vemar_alert_sound', next ? 'true' : 'false');
      if (next) {
        playThreatChime('info');
      }
      return next;
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const markToastAsAuditLogged = useCallback((id: string, recordId?: string) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, auditLogged: true, auditRecordId: recordId || 'AUDIT-LOGGED' } : t
      )
    );
  }, []);

  const notifyThreat = useCallback(
    (toastData: Omit<ThreatNotificationToast, 'id' | 'timestamp'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const isPersistent = Boolean(toastData.persistent);
      
      const newToast: ThreatNotificationToast = {
        ...toastData,
        id,
        timestamp: Date.now(),
        persistent: isPersistent,
        durationMs: isPersistent ? undefined : (toastData.durationMs ?? 9500)
      };

      // Play acoustic chime if enabled
      if (soundEnabled) {
        if (toastData.type === 'regulatory_alert') {
          playThreatChime('regulatory_alert');
        } else if (toastData.type === 'voice_spoof') {
          playThreatChime('voice_spoof');
        } else if (toastData.type === 'high_risk_entity') {
          playThreatChime('high_risk_entity');
        } else if (toastData.type === 'pre_trade_halt') {
          playThreatChime('pre_trade_halt');
        } else {
          playThreatChime('critical');
        }
      }

      // Keep max 5 concurrent toasts to avoid layout clutter
      setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
      return id;
    },
    [soundEnabled]
  );

  const notifyRegulatoryAlert = useCallback(
    (options: NotifyRegulatoryAlertOptions): string => {
      const isVoice = options.threatType === 'voice_anomaly' || (options.acousticMarkers && options.acousticMarkers.length > 0);
      const isTrade = options.threatType === 'high_risk_trade';
      
      const defaultTitle = isVoice
        ? 'REGULATORY ALERT: Critical Voice Anomaly Intercepted'
        : isTrade
        ? 'REGULATORY ALERT: High-Risk Pre-Trade Execution Spurt'
        : 'REGULATORY ALERT: Market Integrity & Synthetic Risk Surge';

      const defaultSubtitle = isVoice
        ? `Acoustic Biometric Forgery (${options.riskScore}% Confidence)`
        : `Surveillance Threshold Breached (${options.riskScore}% Risk)`;

      const defaultRule = options.statutoryRule || 
        (options.jurisdiction === 'US' 
          ? 'SEC Rule 10b-5 / FINRA Rule 2010 Market Integrity' 
          : 'SEBI CSCRF 2024 / PFUTP Reg 4(2)(k)');

      const defaultAuthority = options.regulatoryBody || 
        (options.jurisdiction === 'US' ? 'SEC Division of Enforcement / FINRA' : 'SEBI ISD / NSE Surveillance');

      const defaultMessage = options.message || 
        (isVoice
          ? `High-priority acoustic anomaly flagged in incoming executive telephonic communication for ${options.entityName}. Immediate statutory documentation required under CSCRF/SEC mandates.`
          : `High-risk synthetic market distortion detected on ${options.entityName}. Pre-trade order quarantine threshold active. Immediate compliance audit attestation required.`);

      const defaultHaltStatus = options.haltStatus || 
        (isTrade ? 'FIX Tag 35=D Pre-Trade Halt Active' : 'Clearing Settlement Quarantine (<16ms)');

      return notifyThreat({
        type: 'regulatory_alert',
        threatLevel: options.threatLevel || (options.riskScore >= 80 ? 'CRITICAL' : 'HIGH'),
        riskScore: options.riskScore,
        entityName: options.entityName,
        channel: options.channel || (isVoice ? 'VoIP Telephonic Order Feed' : 'Surveillance Radar Feeds'),
        title: options.title || defaultTitle,
        subtitle: options.subtitle || defaultSubtitle,
        message: defaultMessage,
        acousticMarkers: options.acousticMarkers,
        haltStatus: defaultHaltStatus,
        statutoryRule: defaultRule,
        regulatoryBody: defaultAuthority,
        persistent: options.persistent !== false, // High-priority persistent by default
        suggestedActions: options.suggestedActions || [
          'Halt Pre-Trade Routing',
          'Document in Compliance Audit Ledger',
          'Export Cryptographic PDF Dossier'
        ],
        dossierAction: options.onInspect,
        pdfAction: options.onExportPDF,
        quarantineAction: options.onQuarantine,
        auditLogAction: options.onLogToAudit,
        durationMs: options.persistent ? undefined : (options.durationMs ?? 15000)
      });
    },
    [notifyThreat]
  );

  const notifyVoiceSpoof = useCallback(
    (options: NotifyVoiceSpoofOptions): string => {
      const target = options.entityName && options.entityName !== 'None' 
        ? options.entityName 
        : 'Securities Executive / Regulatory Officer';

      return notifyThreat({
        type: 'voice_spoof',
        threatLevel: 'CRITICAL',
        riskScore: options.confidence,
        entityName: target,
        channel: options.channel || 'AI Voice Clone (Vishing)',
        title: 'CRITICAL: Voice Spoofing Attempt Intercepted',
        subtitle: `Acoustic Biometric Forgery Detected (${options.confidence}% Confidence)`,
        message: options.message || `Synthetic neural voice clone impersonating ${target}. Spectral analysis detected high-frequency vocoder cutoff and LPCC discontinuity.`,
        acousticMarkers: options.markers || [
          'Vocoder Phase Incoherence (42ms)',
          'High-Frequency Cutoff (>7.8 kHz)',
          'Monotonic Pitch Prosody (F0 Flatline)'
        ],
        haltStatus: options.haltStatus || 'Pre-Trade Telephonic Order Quarantined (<16ms)',
        statutoryRule: options.statutoryRule || 'SEBI PFUTP Reg 4(2)(k) / SEC Rule 10b-5',
        regulatoryBody: options.regulatoryBody || 'SEBI Surveillance Division',
        persistent: options.persistent ?? false,
        dossierAction: options.onInspect,
        pdfAction: options.onExportPDF,
        auditLogAction: options.onLogToAudit,
        durationMs: options.persistent ? undefined : (options.durationMs ?? 10000)
      });
    },
    [notifyThreat]
  );

  const notifyHighRiskEntity = useCallback(
    (options: NotifyHighRiskEntityOptions): string => {
      return notifyThreat({
        type: 'high_risk_entity',
        threatLevel: options.riskScore >= 80 ? 'CRITICAL' : 'HIGH',
        riskScore: options.riskScore,
        entityName: options.entityName,
        channel: options.channel || 'Official Circular / Identity Gateway',
        title: 'ALERT: High-Risk Unregistered Entity Detected',
        subtitle: `Entity Impersonation / Regulatory Mismatch (${options.riskScore}% Risk)`,
        message: options.message || `Suspicious market actor attempting deceptive inducement. Entity "${options.entityName}" is NOT found in SEBI/SEC authorized registry archives.`,
        haltStatus: options.haltStatus || 'Clearing Settlement Hold Enforced',
        statutoryRule: options.statutoryRule || options.violation || 'SEBI Act Sec 11B / FINRA Rule 2010',
        regulatoryBody: options.regulatoryBody || 'SEBI Market Intermediaries Regulation (MIRSD)',
        persistent: options.persistent ?? false,
        dossierAction: options.onInspect,
        pdfAction: options.onExportPDF,
        quarantineAction: options.onQuarantine,
        auditLogAction: options.onLogToAudit,
        durationMs: options.persistent ? undefined : (options.durationMs ?? 9500)
      });
    },
    [notifyThreat]
  );

  const notifyPreTradeHalt = useCallback(
    (options: {
      symbol: string;
      reason: string;
      riskScore: number;
      rule?: string;
      persistent?: boolean;
      onInspect?: () => void;
      onLogToAudit?: () => Promise<string | void> | void;
    }): string => {
      return notifyThreat({
        type: 'pre_trade_halt',
        threatLevel: 'CRITICAL',
        riskScore: options.riskScore,
        entityName: options.symbol,
        title: 'PRE-TRADE HALT: FIX Tag 35=D Execution Blocked',
        subtitle: `Sub-16ms Interception at Gateway (${options.symbol})`,
        message: options.reason || `Automated surveillance prevented execution of unverified order linked to synthetic media manipulation.`,
        haltStatus: 'FIX 4.4 Tag 35=D Rejected (Tag 58: SYNTHETIC_FRAUD_ALERT)',
        statutoryRule: options.rule || 'SEBI Master Circular / SEC Rule 15c3-5 Market Access',
        regulatoryBody: 'Exchange Clearing Surveillance Engine',
        persistent: options.persistent ?? false,
        dossierAction: options.onInspect,
        auditLogAction: options.onLogToAudit,
        durationMs: options.persistent ? undefined : 9000
      });
    },
    [notifyThreat]
  );

  const notifyInfo = useCallback(
    (title: string, message: string): string => {
      return notifyThreat({
        type: 'info',
        threatLevel: 'LOW',
        title,
        message,
        durationMs: 5000
      });
    },
    [notifyThreat]
  );

  const notifySuccess = useCallback(
    (title: string, message: string): string => {
      return notifyThreat({
        type: 'success',
        threatLevel: 'AUTHENTIC',
        title,
        message,
        durationMs: 5000
      });
    },
    [notifyThreat]
  );

  return (
    <NotificationToastContext.Provider
      value={{
        toasts,
        soundEnabled,
        toggleSound,
        notifyThreat,
        notifyRegulatoryAlert,
        notifyVoiceSpoof,
        notifyHighRiskEntity,
        notifyPreTradeHalt,
        notifyInfo,
        notifySuccess,
        markToastAsAuditLogged,
        dismissToast,
        clearAll
      }}
    >
      {children}
    </NotificationToastContext.Provider>
  );
};

export const useNotificationToast = (): NotificationToastContextType => {
  const context = useContext(NotificationToastContext);
  if (!context) {
    throw new Error('useNotificationToast must be used within a NotificationToastProvider');
  }
  return context;
};
