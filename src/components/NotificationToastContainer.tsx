import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  PhoneCall,
  AlertOctagon,
  FileDown,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  Radio,
  Zap,
  Activity,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Scale,
  FileSignature,
  BookCheck,
  Check,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useNotificationToast } from '../context/NotificationToastContext';
import { ThreatNotificationToast } from '../types';

interface ToastItemProps {
  toast: ThreatNotificationToast;
  onDismiss: (id: string) => void;
  onMarkLogged: (id: string, recordId?: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss, onMarkLogged }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPersistent = Boolean(toast.persistent);
  const totalDuration = toast.durationMs ?? 9500;
  const [remainingTime, setRemainingTime] = useState(totalDuration);
  const [isLoggingToAudit, setIsLoggingToAudit] = useState(false);
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    // Persistent alerts do not auto-dismiss
    if (isPersistent) return;

    lastTickRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      if (!isHovered) {
        const now = Date.now();
        const elapsed = now - lastTickRef.current;
        lastTickRef.current = now;

        setRemainingTime((prev) => {
          const next = prev - elapsed;
          if (next <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            onDismiss(toast.id);
            return 0;
          }
          return next;
        });
      } else {
        lastTickRef.current = Date.now();
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, isPersistent, onDismiss, toast.id]);

  const progressPercent = isPersistent
    ? 100
    : Math.max(0, Math.min(100, (remainingTime / totalDuration) * 100));

  // Determine visual styling based on threat type and level
  const isRegulatoryAlert = toast.type === 'regulatory_alert';
  const isVoiceSpoof = toast.type === 'voice_spoof';
  const isHighRiskEntity = toast.type === 'high_risk_entity';
  const isCritical = toast.threatLevel === 'CRITICAL';
  const isHigh = toast.threatLevel === 'HIGH';

  const borderColor = isRegulatoryAlert
    ? 'border-amber-400/80 shadow-[0_0_28px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50'
    : isVoiceSpoof || isCritical
    ? 'border-red-500/60 shadow-red-950/40'
    : isHighRiskEntity || isHigh
    ? 'border-amber-500/60 shadow-amber-950/40'
    : toast.type === 'pre_trade_halt'
    ? 'border-cyan-500/60 shadow-cyan-950/40'
    : 'border-slate-700/60 shadow-black/40';

  const accentColor = isRegulatoryAlert
    ? 'bg-amber-400'
    : isVoiceSpoof || isCritical
    ? 'bg-red-500'
    : isHighRiskEntity || isHigh
    ? 'bg-amber-500'
    : 'bg-cyan-500';

  const handleDocumentInAuditLog = async () => {
    if (toast.auditLogged || isLoggingToAudit) return;
    setIsLoggingToAudit(true);
    try {
      if (toast.auditLogAction) {
        const result = await toast.auditLogAction();
        const recordId = typeof result === 'string' ? result : undefined;
        onMarkLogged(toast.id, recordId);
      } else {
        onMarkLogged(toast.id);
      }
    } catch (e) {
      console.error('Failed to log alert to audit trail:', e);
      onMarkLogged(toast.id);
    } finally {
      setIsLoggingToAudit(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={`toast-alert-${toast.id}`}
      className={`pointer-events-auto relative w-full overflow-hidden rounded-xl border ${borderColor} bg-[#0c1322]/98 backdrop-blur-2xl p-4 shadow-2xl text-slate-100 select-none group`}
    >
      {/* Top Banner / Threat Badge Bar */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {/* Pulsing Alert Radar Beacon */}
          <div className="relative flex items-center justify-center mt-0.5">
            <span className={`absolute inline-flex h-7 w-7 animate-ping rounded-full ${accentColor} opacity-30`} />
            <div
              className={`relative flex h-8 w-8 items-center justify-center rounded-lg ${
                isRegulatoryAlert
                  ? 'bg-gradient-to-br from-amber-500/30 to-red-500/20 text-amber-300 border border-amber-400/50 shadow-md'
                  : isVoiceSpoof
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : isHighRiskEntity
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              }`}
            >
              {isRegulatoryAlert ? (
                <Scale className="h-4 w-4 animate-pulse text-amber-300" />
              ) : isVoiceSpoof ? (
                <PhoneCall className="h-4 w-4 animate-pulse" />
              ) : isHighRiskEntity ? (
                <AlertOctagon className="h-4 w-4" />
              ) : toast.type === 'pre_trade_halt' ? (
                <Zap className="h-4 w-4" />
              ) : (
                <ShieldAlert className="h-4 w-4" />
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-black tracking-wider uppercase border flex items-center gap-1 ${
                  isRegulatoryAlert
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                    : isVoiceSpoof || isCritical
                    ? 'bg-red-500/15 text-red-300 border-red-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}
              >
                {isRegulatoryAlert ? (
                  <>
                    <Scale className="w-3 h-3 text-amber-400" />
                    <span>REGULATORY STATUTORY ALERT</span>
                  </>
                ) : isVoiceSpoof ? (
                  'VOICE SPOOF INTERCEPT'
                ) : isHighRiskEntity ? (
                  'HIGH-RISK ENTITY SPOOF'
                ) : (
                  'SECURITY ALERT'
                )}
              </span>

              {isPersistent && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  PERSISTENT
                </span>
              )}

              {toast.riskScore !== undefined && (
                <span className="text-[11px] font-mono font-black text-red-400 bg-red-950/90 px-2 py-0.5 rounded border border-red-800/80 shadow-sm">
                  {toast.riskScore}% RISK
                </span>
              )}
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-white mt-1 leading-snug">
              {toast.title}
            </h4>

            {toast.subtitle && (
              <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                {toast.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Target Asset / Impersonation Highlight */}
      {toast.entityName && (
        <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] flex items-center justify-between gap-2">
          <span className="text-slate-400">Target Asset / Entity:</span>
          <span className="font-semibold text-white font-mono text-right truncate">
            {toast.entityName}
          </span>
        </div>
      )}

      {/* Context Details Message */}
      <p className="mt-2 text-xs text-slate-300 leading-relaxed font-normal">
        {toast.message}
      </p>

      {/* Acoustic / Biometric Forensic Markers */}
      {toast.acousticMarkers && toast.acousticMarkers.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {toast.acousticMarkers.slice(0, 3).map((marker, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
            >
              • {marker}
            </span>
          ))}
        </div>
      )}

      {/* Statutory Rule, Authority & Pre-Trade Quarantine Status */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
        <div className="flex flex-wrap items-center gap-2">
          {toast.regulatoryBody && (
            <span className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60 font-semibold">
              {toast.regulatoryBody}
            </span>
          )}

          {toast.haltStatus ? (
            <span className="text-cyan-400 flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3 text-cyan-400" />
              {toast.haltStatus}
            </span>
          ) : toast.statutoryRule ? (
            <span className="text-slate-300">{toast.statutoryRule}</span>
          ) : null}
        </div>

        <span className="text-slate-500">Sub-16ms Edge ACK</span>
      </div>

      {/* Audit Log Status Badge if already documented */}
      {toast.auditLogged && (
        <div className="mt-2.5 px-3 py-1 rounded-lg bg-emerald-950/70 border border-emerald-800/70 text-[11px] font-mono text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Documented in Immutable Audit Ledger</span>
          </span>
          <span className="font-bold">{toast.auditRecordId || 'FIPS 140-3 RECORDED'}</span>
        </div>
      )}

      {/* Interactive Action Controls Bar */}
      <div className="mt-3 flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
        {/* Document in Audit Log Action */}
        <button
          type="button"
          onClick={handleDocumentInAuditLog}
          disabled={toast.auditLogged || isLoggingToAudit}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            toast.auditLogged
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 cursor-default'
              : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black cursor-pointer shadow-amber-900/40'
          }`}
          title="Commit this threat event into the FIPS 140-3 immutable SHA-256 audit ledger"
        >
          {isLoggingToAudit ? (
            <>
              <Activity className="w-3.5 h-3.5 animate-spin" />
              <span>Logging to Ledger...</span>
            </>
          ) : toast.auditLogged ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ledger Documented</span>
            </>
          ) : (
            <>
              <FileSignature className="w-3.5 h-3.5" />
              <span>Document in Audit Log</span>
            </>
          )}
        </button>

        {/* Inspect Dossier Action */}
        {toast.dossierAction && (
          <button
            type="button"
            onClick={() => {
              toast.dossierAction?.();
              if (!isPersistent) onDismiss(toast.id);
            }}
            className="py-1.5 px-3 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm"
          >
            <span>Inspect</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* PDF Export Action */}
        {toast.pdfAction && (
          <button
            type="button"
            onClick={() => {
              toast.pdfAction?.();
            }}
            className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
            title="Download SHA-256 sealed PDF audit report"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        )}

        {/* Quarantine Action */}
        {toast.quarantineAction && (
          <button
            type="button"
            onClick={() => {
              toast.quarantineAction?.();
            }}
            className="py-1.5 px-2.5 rounded-lg bg-red-950/80 hover:bg-red-900/80 text-red-300 font-semibold text-xs flex items-center gap-1 border border-red-800 transition-colors cursor-pointer"
            title="Enforce pre-trade quarantine halt"
          >
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span>Halt</span>
          </button>
        )}
      </div>

      {/* Auto-Dismiss Progress Bar Timer / Persistent Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/50">
        <div
          className={`h-full transition-all ease-linear ${
            isRegulatoryAlert
              ? 'bg-gradient-to-r from-amber-400 to-red-500'
              : isVoiceSpoof || isCritical
              ? 'bg-red-500'
              : isHighRiskEntity || isHigh
              ? 'bg-amber-500'
              : 'bg-cyan-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </motion.div>
  );
};

export const NotificationToastContainer: React.FC = () => {
  const { toasts, dismissToast, clearAll, soundEnabled, toggleSound, markToastAsAuditLogged } = useNotificationToast();

  if (toasts.length === 0) return null;

  const persistentCount = toasts.filter((t) => t.persistent).length;

  return (
    <div
      id="notification-toast-overlay"
      className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-3 w-full max-w-sm sm:max-w-md pointer-events-none"
    >
      {/* Toast Stack Controls (Mute sound & Clear all) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/95 border border-slate-800 backdrop-blur-md text-xs text-slate-300 shadow-xl mb-1"
      >
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="font-mono text-[11px] font-semibold text-white">
            Surveillance Alerts ({toasts.length})
          </span>
          {persistentCount > 0 && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {persistentCount} Action Required
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSound}
            className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
              soundEnabled
                ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900/60'
                : 'text-slate-400 bg-slate-800/80 border border-slate-700/60 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Acoustic threat alert sound active (click to mute)' : 'Sound muted (click to unmute)'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Chime ON' : 'Muted'}</span>
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </motion.div>

      {/* Stacked Toasts with Motion Exit Animation */}
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={dismissToast}
            onMarkLogged={markToastAsAuditLogged}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
