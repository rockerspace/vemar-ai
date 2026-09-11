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
  AlertTriangle
} from 'lucide-react';
import { useNotificationToast } from '../context/NotificationToastContext';
import { ThreatNotificationToast } from '../types';

interface ToastItemProps {
  toast: ThreatNotificationToast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [remainingTime, setRemainingTime] = useState(toast.durationMs ?? 9500);
  const totalDuration = toast.durationMs ?? 9500;
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
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
  }, [isHovered, onDismiss, toast.id]);

  const progressPercent = Math.max(0, Math.min(100, (remainingTime / totalDuration) * 100));

  // Determine visual styling based on threat type and level
  const isVoiceSpoof = toast.type === 'voice_spoof';
  const isHighRiskEntity = toast.type === 'high_risk_entity';
  const isCritical = toast.threatLevel === 'CRITICAL';
  const isHigh = toast.threatLevel === 'HIGH';

  const borderColor = isVoiceSpoof || isCritical
    ? 'border-red-500/60 shadow-red-950/40'
    : isHighRiskEntity || isHigh
    ? 'border-amber-500/60 shadow-amber-950/40'
    : toast.type === 'pre_trade_halt'
    ? 'border-cyan-500/60 shadow-cyan-950/40'
    : 'border-slate-700/60 shadow-black/40';

  const accentColor = isVoiceSpoof || isCritical
    ? 'bg-red-500'
    : isHighRiskEntity || isHigh
    ? 'bg-amber-500'
    : 'bg-cyan-500';

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
      className={`pointer-events-auto relative w-full overflow-hidden rounded-xl border ${borderColor} bg-[#0c1322]/95 backdrop-blur-xl p-4 shadow-2xl text-slate-100 select-none group`}
    >
      {/* Top Threat Badge Bar */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Pulsing Alert Radar Beacon */}
          <div className="relative flex items-center justify-center">
            <span className={`absolute inline-flex h-6 w-6 animate-ping rounded-full ${accentColor} opacity-25`} />
            <div
              className={`relative flex h-8 w-8 items-center justify-center rounded-lg ${
                isVoiceSpoof
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : isHighRiskEntity
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              }`}
            >
              {isVoiceSpoof ? (
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
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${
                  isVoiceSpoof || isCritical
                    ? 'bg-red-500/15 text-red-300 border-red-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}
              >
                {isVoiceSpoof ? 'VOICE SPOOF INTERCEPT' : isHighRiskEntity ? 'HIGH-RISK ENTITY SPOOF' : 'SECURITY ALERT'}
              </span>

              {toast.riskScore !== undefined && (
                <span className="text-[11px] font-mono font-black text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/60">
                  {toast.riskScore}% RISK
                </span>
              )}
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-white mt-1 leading-snug">
              {toast.title}
            </h4>
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

      {/* Target Impersonation Highlight */}
      {toast.entityName && (
        <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] flex items-center justify-between gap-2">
          <span className="text-slate-400">Target Impersonated:</span>
          <span className="font-semibold text-white font-mono text-right truncate">
            {toast.entityName}
          </span>
        </div>
      )}

      {/* Context Details Message */}
      <p className="mt-2 text-xs text-slate-300 leading-relaxed line-clamp-2 font-normal">
        {toast.message}
      </p>

      {/* Acoustic / Biometric Forensic Markers */}
      {toast.acousticMarkers && toast.acousticMarkers.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {toast.acousticMarkers.slice(0, 3).map((marker, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400"
            >
              • {marker}
            </span>
          ))}
        </div>
      )}

      {/* Statutory Rule & Pre-Trade Quarantine Status */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
        {toast.haltStatus ? (
          <span className="text-cyan-400 flex items-center gap-1 font-semibold">
            <Lock className="w-3 h-3 text-cyan-400" />
            {toast.haltStatus}
          </span>
        ) : toast.statutoryRule ? (
          <span>{toast.statutoryRule}</span>
        ) : null}

        <span className="text-slate-500">Sub-16ms Edge ACK</span>
      </div>

      {/* Interactive Action Buttons */}
      {(toast.dossierAction || toast.pdfAction) && (
        <div className="mt-3 flex items-center gap-2 pt-1">
          {toast.dossierAction && (
            <button
              type="button"
              onClick={() => {
                toast.dossierAction?.();
                onDismiss(toast.id);
              }}
              className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Inspect Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {toast.pdfAction && (
            <button
              type="button"
              onClick={() => {
                toast.pdfAction?.();
              }}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Download SHA-256 sealed PDF audit report"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>PDF Audit</span>
            </button>
          )}
        </div>
      )}

      {/* Auto-Dismiss Progress Bar Timer */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/50">
        <div
          className={`h-full transition-all ease-linear ${
            isVoiceSpoof || isCritical ? 'bg-red-500' : isHighRiskEntity || isHigh ? 'bg-amber-500' : 'bg-cyan-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </motion.div>
  );
};

export const NotificationToastContainer: React.FC = () => {
  const { toasts, dismissToast, clearAll, soundEnabled, toggleSound } = useNotificationToast();

  if (toasts.length === 0) return null;

  return (
    <div
      id="notification-toast-overlay"
      className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-3 w-full max-w-sm sm:max-w-md pointer-events-none"
    >
      {/* Toast Stack Controls (Mute sound & Clear all) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs text-slate-300 shadow-lg mb-1"
      >
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="font-mono text-[11px] font-semibold text-white">
            Active Surveillance Radar ({toasts.length})
          </span>
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
            className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
        </div>
      </motion.div>

      {/* Stacked Toasts with Motion Exit Animation */}
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
