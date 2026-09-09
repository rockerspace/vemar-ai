import React, { useState, useEffect } from 'react';
import { Radar, AlertCircle, ShieldAlert, CheckCircle2, TrendingUp, Users, Cpu, Activity, Clock, ShieldCheck, ArrowUpRight, Zap, Globe2 } from 'lucide-react';
import { fetchThreatTelemetry } from '../services/api';
import { ThreatTelemetry, Jurisdiction } from '../types';

interface SurveillanceRadarProps {
  jurisdiction?: Jurisdiction;
}

export const SurveillanceRadar: React.FC<SurveillanceRadarProps> = ({ jurisdiction = 'IN' }) => {
  const [telemetry, setTelemetry] = useState<ThreatTelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterChannel, setFilterChannel] = useState<string>('all');

  const isUS = jurisdiction === 'US';

  useEffect(() => {
    fetchThreatTelemetry()
      .then((data) => {
        setTelemetry(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <Activity className="w-8 h-8 animate-spin mx-auto text-cyan-400 mb-3" />
        <p className="text-sm">Connecting to {isUS ? 'U.S. SEC / FINRA CATS & TRACE' : 'National Indian MII'} Surveillance Feeds...</p>
      </div>
    );
  }

  const defaultStats = isUS
    ? {
        totalAttacksAnalyzedToday: 2410,
        syntheticMediaDetected: 489,
        phishingAttacksPrevented: 1392,
        authenticCommunicationsValidated: 529,
        averageDetectionLatencyMs: 380,
        activeSurveillanceAlerts: 11,
        marketValueProtectedFormatted: '$680.4M'
      }
    : {
        totalAttacksAnalyzedToday: 1482,
        syntheticMediaDetected: 312,
        phishingAttacksPrevented: 894,
        authenticCommunicationsValidated: 276,
        averageDetectionLatencyMs: 410,
        activeSurveillanceAlerts: 7,
        marketValueProtectedFormatted: '₹428.5 Cr'
      };

  const stats = {
    ...defaultStats,
    ...telemetry?.statistics,
    marketValueProtectedFormatted: isUS ? '$680.4M' : `₹${telemetry?.statistics?.marketValueProtectedINR || '428.5 Cr'}`
  };

  const incidents = (telemetry?.recentIncidents || []).filter(
    (inc) => filterChannel === 'all' || inc.channel === filterChannel
  );

  return (
    <div id="surveillance-radar-dashboard" className="space-y-6">
      {/* MII & Surveillance Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-3">
              <Radar className="w-3.5 h-3.5 animate-pulse" />
              {isUS ? 'U.S. Market Infrastructure (SEC/FINRA/CISA Grid)' : 'MII & Regulatory Surveillance Grid'}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Real-Time Synthetic Threat Telemetry & Disinformation Radar
            </h2>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              {isUS
                ? 'Automated multi-venue market surveillance node cross-correlating SEC EDGAR spoofing attempts, synthetic executive earnings audio, and orchestrated algorithmic social manipulation across WallStreetBets and X.'
                : 'Automated multi-channel market surveillance node monitoring deepfake broadcasts, voice clone margin calls, and social syndicate pump-and-dump operations across NSE, BSE, and MCX.'}
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-xs">
              <span className="text-slate-400 block">Surveillance Status</span>
              <span className="text-white font-bold font-mono">
                {isUS ? 'ACTIVE SENSOR NETWORK (12 U.S. Nodes)' : 'ACTIVE SENSOR NETWORK (7 Nodes)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Market Value Protected</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {stats.marketValueProtectedFormatted}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            Panic selling & fraudulent wires intercepted
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Synthetic Media Intercepted</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 font-mono">
            {stats.syntheticMediaDetected}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Deepfake videos & voice clones flagged
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Phishing & Spoofing Blocked</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {stats.phishingAttacksPrevented}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Counterfeit settlement portals & emails
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Average Detection Latency</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            {stats.averageDetectionLatencyMs} ms
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Sub-second neural forensic inference
          </span>
        </div>
      </div>

      {/* Vector Distribution and Coordinated Disinformation Swarm */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Vector Breakdown */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Threat Attack Vector Distribution
          </h3>
          <p className="text-xs text-slate-400">
            Breakdown of AI generative attack modalities targeting market participants over the last 30 days:
          </p>

          <div className="space-y-3">
            {[
              { label: 'LLM Phishing & Spoofed Portals', pct: 44, count: 652, color: 'bg-amber-500' },
              { label: 'AI Voice Cloning (Executive Vishing)', pct: 24, count: 356, color: 'bg-red-500' },
              { label: 'Synthetic Video & Lip-Sync Deepfakes', pct: 18, count: 267, color: 'bg-purple-500' },
              { label: 'Syndicate Bot Swarms & Social Pumps', pct: 14, count: 207, color: 'bg-cyan-500' }
            ].map((v, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{v.label}</span>
                  <span className="text-slate-400 font-mono">{v.count} ({v.pct}%)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className={`h-full ${v.color}`} style={{ width: `${v.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-white block mb-1">Automated Mitigation Rate:</span>
            <span>
              99.2% of flagged payloads trigger automated DNS takedown referrals to CERT-In / CISA and instant trading desk quarantine alerts within 60 seconds.
            </span>
          </div>
        </div>

        {/* Right: Coordinated Disinformation Swarm Visualizer */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Syndicate Disinformation Bot Swarm Topology
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
              CLUSTER ACTIVE
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Real-time clustering graph tracking 38 synchronized AI agent personas posting coordinated pump-and-dump rumors across {isUS ? 'WallStreetBets, X, and Telegram' : 'Telegram, WhatsApp, and YouTube'}:
          </p>

          <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Simulated Radar Rings */}
            <div className="absolute w-48 h-48 rounded-full border border-slate-800/80 pointer-events-none" />
            <div className="absolute w-32 h-32 rounded-full border border-cyan-500/20 pointer-events-none" />
            <div className="absolute w-16 h-16 rounded-full border border-red-500/30 pointer-events-none" />

            {/* Target Central Node */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400 font-bold font-mono text-xs shadow-lg shadow-red-500/20">
                {isUS ? '$NVDA' : 'TATAMOTORS'}
              </div>
              <span className="text-[10px] font-mono text-red-300 mt-1 bg-black/60 px-1.5 py-0.5 rounded">
                Targeted Ticker
              </span>
            </div>

            {/* Orbiting Bot nodes */}
            {[
              { label: isUS ? 'WSB Bot #14' : 'Telegram Bot-A', angle: 30, dist: 75, color: 'bg-amber-400' },
              { label: isUS ? 'X FinTwit AI #8' : 'WhatsApp Bot-7', angle: 110, dist: 85, color: 'bg-red-400' },
              { label: isUS ? 'Discord Pump Leader' : 'Fake Finfluencer X', angle: 210, dist: 90, color: 'bg-purple-400' },
              { label: isUS ? 'Reddit Syndicate #3' : 'Discord Tip Node', angle: 310, dist: 70, color: 'bg-cyan-400' },
              { label: isUS ? 'Signal AI Whisper' : 'Signal Clone-9', angle: 170, dist: 65, color: 'bg-amber-400' }
            ].map((node, i) => {
              const rad = (node.angle * Math.PI) / 180;
              const x = Math.cos(rad) * node.dist;
              const y = Math.sin(rad) * node.dist;

              return (
                <div
                  key={i}
                  className="absolute z-20 flex flex-col items-center"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  <div className={`w-3.5 h-3.5 rounded-full ${node.color} ring-4 ring-slate-900 shadow-md animate-ping [animation-duration:3s]`} />
                  <span className="text-[9px] font-mono text-slate-300 bg-slate-900/90 px-1 py-0.2 rounded border border-slate-800 whitespace-nowrap mt-1">
                    {node.label}
                  </span>
                </div>
              );
            })}

            {/* Sweep Line */}
            <div
              className="absolute inset-0 origin-center pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, transparent 70%, rgba(6, 182, 212, 0.15) 100%)'
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Detection: <strong>Linguistic Perplexity Clustered Matching</strong></span>
            <span className="text-emerald-400 font-semibold font-mono">
              {isUS ? 'FINRA Market Manipulation Protocol Active' : 'SEBI Graded Surveillance Triggered'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Flagged Threat Incidents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {isUS ? 'U.S. National Market Threat Interception Log (Last 24 Hours)' : 'National Market Threat Interception Log (Last 24 Hours)'}
            </h3>
          </div>

          {/* Filter options */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {['all', 'video_frame', 'audio_call', 'email', 'social_post'].map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setFilterChannel(ch)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterChannel === ch ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {ch === 'all' ? 'All Channels' : ch.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Incident ID</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Target Asset / Entity</th>
                <th className="py-2.5 px-3">Threat Specifics</th>
                <th className="py-2.5 px-3 text-center">Risk Score</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Impact Mitigated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{inc.id}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-cyan-300 border border-slate-700">
                      {inc.channelLabel}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans font-medium text-slate-200">{inc.targetAsset}</td>
                  <td className="py-3 px-3 font-sans text-slate-400 max-w-xs">{inc.threatType}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        inc.riskScore > 90
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {inc.riskScore}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        inc.status === 'CONTAINED' || inc.status === 'BLOCKED'
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300 text-[11px]">{inc.impactPrevented}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
