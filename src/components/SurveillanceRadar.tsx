import React, { useState, useEffect } from 'react';
import {
  Radar,
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  Users,
  Cpu,
  Activity,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Zap,
  Globe2,
  Bell,
  Radio,
  BarChart3,
  Layers,
  Pause,
  Play,
  SlidersHorizontal,
  TrendingDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell
} from 'recharts';
import { fetchThreatTelemetry } from '../services/api';
import { ThreatTelemetry, Jurisdiction, AssetClassThreat } from '../types';
import { useNotificationToast } from '../context/NotificationToastContext';

interface SurveillanceRadarProps {
  jurisdiction?: Jurisdiction;
}

const getDefaultAssetClassThreats = (jurisdiction: Jurisdiction): AssetClassThreat[] => {
  if (jurisdiction === 'US') {
    return [
      {
        id: 'act-us-equities',
        assetClass: 'Equities (NYSE/NASDAQ)',
        shortName: 'Equities',
        marketCode: 'NYSE / NASDAQ',
        riskScore: 93,
        benchmarkScore: 70,
        incidentCount: 340,
        riskTrend: 5.2,
        threatLevel: 'CRITICAL',
        primaryVector: 'Executive Deepfake Earnings Audio & 8-K Forgery',
        prominentTarget: 'NVDA, AAPL, MSFT, TSLA',
        regulatoryAction: 'FINRA Rule 2010 Trading Halt & SEC EDGAR Lock',
        protectedVolume: '$420M'
      },
      {
        id: 'act-us-derivatives',
        assetClass: 'Index Derivatives (CME)',
        shortName: 'Index F&O',
        marketCode: 'CME SPX / VIX',
        riskScore: 89,
        benchmarkScore: 64,
        incidentCount: 215,
        riskTrend: 6.8,
        threatLevel: 'CRITICAL',
        primaryVector: 'Algorithmic Flash-Spoofing & Synthetic Fed Minutes',
        prominentTarget: 'Zero-DTE S&P 500 Options & CME E-mini Futures',
        regulatoryAction: 'CME Market Integrity Automated Sensor #1 Order Throttling',
        protectedVolume: '$310M'
      },
      {
        id: 'act-us-treasuries',
        assetClass: 'U.S. Treasuries & Debt',
        shortName: 'Treasuries',
        marketCode: 'UST 10Y / 2Y',
        riskScore: 52,
        benchmarkScore: 45,
        incidentCount: 44,
        riskTrend: -0.8,
        threatLevel: 'MEDIUM',
        primaryVector: 'Spoofed Fed Reserve Wire Authorizations & Yield Notices',
        prominentTarget: 'UST 10-Year Benchmark & Fed Funds Repo',
        regulatoryAction: 'Fedwire Authentication & Primary Dealer Registry Check',
        protectedVolume: '$580M'
      },
      {
        id: 'act-us-credit',
        assetClass: 'Corporate Credit & Bonds',
        shortName: 'Corp Credit',
        marketCode: 'TRACE / HY Bonds',
        riskScore: 71,
        benchmarkScore: 58,
        incidentCount: 68,
        riskTrend: 3.1,
        threatLevel: 'HIGH',
        primaryVector: 'Counterfeit Credit Rating Downgrade Press Releases',
        prominentTarget: 'High-Yield Energy & Tech Debentures',
        regulatoryAction: 'TRACE Trade Reporting Verification Shield',
        protectedVolume: '$190M'
      },
      {
        id: 'act-us-commodities',
        assetClass: 'Commodities & Energy',
        shortName: 'Commodities',
        marketCode: 'NYMEX / COMEX',
        riskScore: 76,
        benchmarkScore: 56,
        incidentCount: 92,
        riskTrend: 2.9,
        threatLevel: 'HIGH',
        primaryVector: 'Synthetic OPEC Production Leak Audio & Satellite Spoofs',
        prominentTarget: 'WTI Light Sweet Crude & COMEX Gold Futures',
        regulatoryAction: 'CFTC Dynamic Position Limits & Physical Storage Audit',
        protectedVolume: '$240M'
      },
      {
        id: 'act-us-forex',
        assetClass: 'Forex & Eurodollars',
        shortName: 'Forex / FX',
        marketCode: 'EUR/USD / FX Spot',
        riskScore: 65,
        benchmarkScore: 52,
        incidentCount: 61,
        riskTrend: 1.1,
        threatLevel: 'HIGH',
        primaryVector: 'Spoofed G10 Central Bank Rate Decision Bulletins',
        prominentTarget: 'EUR/USD, USD/JPY Spot & OTC Forwards',
        regulatoryAction: 'CLS Multi-Currency Settlement Firewall',
        protectedVolume: '$280M'
      }
    ];
  }

  // Default Indian Market (NSE/BSE/MCX)
  return [
    {
      id: 'act-in-equities',
      assetClass: 'Equities (NSE/BSE Large-Cap)',
      shortName: 'Equities',
      marketCode: 'NSE/BSE',
      riskScore: 92,
      benchmarkScore: 68,
      incidentCount: 312,
      riskTrend: 4.8,
      threatLevel: 'CRITICAL',
      primaryVector: 'Executive Deepfake Videos & Spoofed LODR Disclosures',
      prominentTarget: 'TATAMOTORS, RELIANCE, INFY',
      regulatoryAction: 'SEBI Graded Surveillance Measure (GSM) Stage 2',
      protectedVolume: '₹1,250 Cr'
    },
    {
      id: 'act-in-derivatives',
      assetClass: 'Index & Equity F&O',
      shortName: 'Derivatives',
      marketCode: 'NIFTY / BANKNIFTY',
      riskScore: 88,
      benchmarkScore: 62,
      incidentCount: 198,
      riskTrend: 6.2,
      threatLevel: 'CRITICAL',
      primaryVector: 'Syndicate Botnet Weekly Expiry Pumps & Fake Calls',
      prominentTarget: 'Weekly Expiry Zero-DTE Options & BankNifty Calls',
      regulatoryAction: 'Exchange Dynamic Order Limit & Margin Spike Guard',
      protectedVolume: '₹980 Cr'
    },
    {
      id: 'act-in-primary-ipo',
      assetClass: 'Primary Market & IPOs',
      shortName: 'IPOs & SME',
      marketCode: 'Mainboard / SME',
      riskScore: 94,
      benchmarkScore: 71,
      incidentCount: 245,
      riskTrend: 7.9,
      threatLevel: 'CRITICAL',
      primaryVector: 'Counterfeit Grey Market (GMP) Portals & Phishing UPI Mandates',
      prominentTarget: 'High-Demand Retail IPO Allotments (Waaree Energies)',
      regulatoryAction: 'Registrar DNS Takedown (CERT-In) & ASBA Payment Shield',
      protectedVolume: '₹520 Cr'
    },
    {
      id: 'act-in-commodities',
      assetClass: 'Commodities & Energy',
      shortName: 'Commodities',
      marketCode: 'MCX Bullion/Crude',
      riskScore: 74,
      benchmarkScore: 55,
      incidentCount: 86,
      riskTrend: 2.4,
      threatLevel: 'HIGH',
      primaryVector: 'Fabricated Supply Shocks & Synthetic Diplomatic Voice Audio',
      prominentTarget: 'Crude Oil Delivery & MCX Gold / Silver Bullion',
      regulatoryAction: 'Margin Real-Time Recalibration & Warehouse Verification',
      protectedVolume: '₹640 Cr'
    },
    {
      id: 'act-in-fixed-income',
      assetClass: 'Sovereign Debt & G-Secs',
      shortName: 'Govt Debt',
      marketCode: 'RBI NDS-OM',
      riskScore: 49,
      benchmarkScore: 42,
      incidentCount: 38,
      riskTrend: -1.2,
      threatLevel: 'MEDIUM',
      primaryVector: 'Spoofed Central Bank Yield Auction Notices & Wire Diversion',
      prominentTarget: '10-Year Benchmark Sovereign Paper & Clearing',
      regulatoryAction: 'mTLS Primary Dealer Authentication & RTGS Shield',
      protectedVolume: '₹1,800 Cr'
    },
    {
      id: 'act-in-forex',
      assetClass: 'Forex & Cross-Border FX',
      shortName: 'Forex / FX',
      marketCode: 'USD/INR OTC',
      riskScore: 63,
      benchmarkScore: 50,
      incidentCount: 57,
      riskTrend: 0.8,
      threatLevel: 'HIGH',
      primaryVector: 'Phishing Interbank SWIFT Confirmations & Fake Intervention Rumors',
      prominentTarget: 'RBI Reference Rates & OTC Currency Forwards',
      regulatoryAction: 'Continuous Linked Settlement (CLS) Gateway Cross-Check',
      protectedVolume: '₹890 Cr'
    }
  ];
};

export const SurveillanceRadar: React.FC<SurveillanceRadarProps> = ({ jurisdiction = 'IN' }) => {
  const { notifyVoiceSpoof, notifyHighRiskEntity } = useNotificationToast();
  const [telemetry, setTelemetry] = useState<ThreatTelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterChannel, setFilterChannel] = useState<string>('all');

  const isUS = jurisdiction === 'US';

  // Market Threat Distribution State
  const [assetThreats, setAssetThreats] = useState<AssetClassThreat[]>(() => getDefaultAssetClassThreats(jurisdiction));
  const [selectedAssetId, setSelectedAssetId] = useState<string>(() => (jurisdiction === 'US' ? 'act-us-equities' : 'act-in-equities'));
  const [activeMetric, setActiveMetric] = useState<'riskScore' | 'incidentCount' | 'benchmarkScore'>('riskScore');
  const [assetCategoryFilter, setAssetCategoryFilter] = useState<string>('all');
  const [isLiveStream, setIsLiveStream] = useState<boolean>(true);
  const [simulatedAlertFired, setSimulatedAlertFired] = useState<boolean>(false);

  useEffect(() => {
    fetchThreatTelemetry()
      .then((data) => {
        setTelemetry(data);
        if (data.assetClassThreats && data.assetClassThreats.length > 0) {
          setAssetThreats(data.assetClassThreats);
          setSelectedAssetId(data.assetClassThreats[0].id);
        } else {
          const defaults = getDefaultAssetClassThreats(jurisdiction);
          setAssetThreats(defaults);
          setSelectedAssetId(defaults[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [jurisdiction]);

  // Real-time jitter telemetry stream simulation
  useEffect(() => {
    if (!isLiveStream) return;

    const interval = setInterval(() => {
      setAssetThreats((prev) => {
        if (!prev || prev.length === 0) return prev;
        const idx = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        const target = { ...updated[idx] };
        
        // Jitter score slightly (between -1.4 and +1.6)
        const jitter = Math.random() * 3 - 1.4;
        const newScore = Math.min(99, Math.max(30, Math.round((target.riskScore + jitter) * 10) / 10));
        const trendJitter = Math.round((target.riskTrend + (Math.random() * 0.4 - 0.2)) * 10) / 10;
        
        let newLevel = target.threatLevel;
        if (newScore >= 80) newLevel = 'CRITICAL';
        else if (newScore >= 65) newLevel = 'HIGH';
        else if (newScore >= 45) newLevel = 'MEDIUM';
        else newLevel = 'LOW';

        const bumpedIncidents = Math.random() > 0.65 ? target.incidentCount + 1 : target.incidentCount;

        updated[idx] = {
          ...target,
          riskScore: newScore,
          riskTrend: trendJitter,
          threatLevel: newLevel,
          incidentCount: bumpedIncidents
        };
        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveStream]);

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

  const filteredThreats = assetThreats.filter((item) => {
    if (assetCategoryFilter === 'all') return true;
    if (assetCategoryFilter === 'equities') {
      return item.shortName === 'Equities' || item.shortName === 'Derivatives' || item.shortName === 'Index F&O';
    }
    if (assetCategoryFilter === 'debt_fx') {
      return item.shortName === 'Govt Debt' || item.shortName === 'Treasuries' || item.shortName === 'Forex / FX' || item.shortName === 'Corp Credit';
    }
    if (assetCategoryFilter === 'commodities_ipo') {
      return item.shortName === 'Commodities' || item.shortName === 'IPOs & SME';
    }
    return true;
  });

  const selectedAsset = assetThreats.find((a) => a.id === selectedAssetId) || filteredThreats[0] || assetThreats[0];
  const highestRiskClass = assetThreats.reduce((max, cur) => (cur.riskScore > max.riskScore ? cur : max), assetThreats[0]);
  const fastestEscalating = assetThreats.reduce((max, cur) => (cur.riskTrend > max.riskTrend ? cur : max), assetThreats[0]);
  const mostResilient = assetThreats.reduce((min, cur) => (cur.riskScore < min.riskScore ? cur : min), assetThreats[0]);
  const totalThreatVolume = assetThreats.reduce((acc, cur) => acc + cur.incidentCount, 0);

  const getBarColor = (score: number) => {
    if (score >= 80) return '#ef4444';
    if (score >= 65) return '#f59e0b';
    return '#06b6d4';
  };

  const CustomThreatTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: AssetClassThreat = payload[0].payload;
      const scoreBadge =
        data.riskScore >= 80
          ? 'text-red-400 bg-red-500/10 border-red-500/30'
          : data.riskScore >= 65
          ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
          : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';

      return (
        <div className="bg-slate-950 border border-slate-700 rounded-xl p-3.5 shadow-2xl backdrop-blur-md max-w-xs text-xs space-y-2 pointer-events-none z-50">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div>
              <span className="font-bold text-white text-sm block">{data.assetClass}</span>
              <span className="text-[10px] text-slate-400 font-mono">{data.marketCode}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${scoreBadge}`}>
              {data.threatLevel} ({data.riskScore}%)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Active Incidents</span>
              <span className="text-white font-mono font-bold">{data.incidentCount}</span>
              <span className="text-[10px] text-emerald-400 ml-1">
                ({data.riskTrend > 0 ? `+${data.riskTrend}` : data.riskTrend}%)
              </span>
            </div>
            <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">30D Baseline</span>
              <span className="text-cyan-300 font-mono font-bold">{data.benchmarkScore}%</span>
              <span className="text-[10px] text-slate-400 block">Moving Average</span>
            </div>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="text-slate-400">
              <span className="text-slate-500">Target Entity:</span>{' '}
              <span className="text-slate-200 font-medium">{data.prominentTarget}</span>
            </div>
            <div className="text-slate-400">
              <span className="text-slate-500">Primary Attack:</span>{' '}
              <span className="text-slate-300">{data.primaryVector}</span>
            </div>
            <div className="text-slate-400">
              <span className="text-slate-500">Safeguard:</span>{' '}
              <span className="text-emerald-400 font-medium">{data.regulatoryAction}</span>
            </div>
          </div>

          <div className="pt-1 text-[10px] text-slate-500 italic border-t border-slate-800 flex justify-between">
            <span>Protected: {data.protectedVolume}</span>
            <span className="text-cyan-400 font-mono">Click bar to inspect</span>
          </div>
        </div>
      );
    }
    return null;
  };

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

      {/* Market Threat Distribution (Recharts Real-Time Risk Score Visualization) */}
      <div
        id="market-threat-distribution-card"
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6"
      >
        {/* Card Header & Live Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Market Threat Distribution
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isLiveStream ? 'animate-pulse' : ''}`} />
                {isLiveStream ? 'LIVE TELEMETRY STREAM' : 'FEED PAUSED'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Real-time synthetic risk scores, attack volume, and 30-day baseline deviations across {isUS ? 'U.S. capital market asset classes' : 'Indian & global capital market asset classes'}.
            </p>
          </div>

          {/* Metric Selector & Stream Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                id="threat-metric-toggle-risk"
                onClick={() => setActiveMetric('riskScore')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeMetric === 'riskScore'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Risk Score (%)
              </button>
              <button
                id="threat-metric-toggle-incidents"
                onClick={() => setActiveMetric('incidentCount')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeMetric === 'incidentCount'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Incidents (24h)
              </button>
              <button
                id="threat-metric-toggle-baseline"
                onClick={() => setActiveMetric('benchmarkScore')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeMetric === 'benchmarkScore'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                30D Baseline
              </button>
            </div>

            <button
              id="threat-stream-toggle-btn"
              onClick={() => setIsLiveStream(!isLiveStream)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isLiveStream
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              {isLiveStream ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Pause Stream
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Resume Live
                </>
              )}
            </button>
          </div>
        </div>

        {/* Category Filters & Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Filter Asset Classes:
            </span>
            {[
              { id: 'all', label: 'All Classes' },
              { id: 'equities', label: 'Equities & F&O' },
              { id: 'debt_fx', label: 'Debt & FX' },
              { id: 'commodities_ipo', label: 'Commodities & IPOs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAssetCategoryFilter(tab.id)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  assetCategoryFilter === tab.id
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-red-500" />
              <span>Critical (&gt;80%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-amber-500" />
              <span>High (65-80%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-cyan-500" />
              <span>Controlled (&lt;65%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 border-t-2 border-dashed border-sky-400" />
              <span>30D Baseline</span>
            </div>
          </div>
        </div>

        {/* Recharts Chart Visualization */}
        <div id="market-threat-distribution-chart-container" className="w-full h-80 min-h-[320px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredThreats}
              margin={{ top: 15, right: 20, left: -10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.35} vertical={false} />
              <XAxis
                dataKey="shortName"
                stroke="#64748b"
                tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 500 }}
                tickLine={{ stroke: '#334155' }}
                dy={8}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={{ stroke: '#334155' }}
                unit={activeMetric === 'incidentCount' ? '' : '%'}
              />
              <Tooltip content={<CustomThreatTooltip />} />
              <ReferenceLine
                y={75}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: isUS ? 'SEC/FINRA ACTION THRESHOLD (75%)' : 'SEBI SURVEILLANCE THRESHOLD (75%)',
                  fill: '#f87171',
                  fontSize: 10,
                  position: 'insideTopRight'
                }}
              />
              <ReferenceLine
                y={50}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                strokeWidth={1}
                label={{
                  value: 'ELEVATED VIGILANCE (50%)',
                  fill: '#fbbf24',
                  fontSize: 10,
                  position: 'insideTopRight'
                }}
              />
              <Bar
                dataKey={activeMetric}
                name={
                  activeMetric === 'riskScore'
                    ? 'Risk Score (%)'
                    : activeMetric === 'incidentCount'
                    ? 'Incident Count'
                    : '30-Day Baseline (%)'
                }
                radius={[6, 6, 0, 0]}
                barSize={40}
                onClick={(entry: any) => setSelectedAssetId(entry.id)}
              >
                {filteredThreats.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={selectedAssetId === entry.id ? '#38bdf8' : getBarColor(entry.riskScore)}
                    stroke={selectedAssetId === entry.id ? '#ffffff' : 'none'}
                    strokeWidth={selectedAssetId === entry.id ? 2 : 0}
                    className="transition-all duration-300 cursor-pointer hover:opacity-85"
                  />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="benchmarkScore"
                name="30-Day Baseline"
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">Highest Risk Asset Class</span>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-sm truncate">{highestRiskClass?.shortName || 'IPOs'}</span>
              <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                {highestRiskClass?.riskScore || 94}%
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 truncate">{highestRiskClass?.primaryVector?.slice(0, 32)}...</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">Fastest Escalating (24h)</span>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-sm truncate">{fastestEscalating?.shortName || 'Derivatives'}</span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                +{fastestEscalating?.riskTrend || 7.9}%
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 truncate">{fastestEscalating?.marketCode}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">Most Resilient Asset Class</span>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-sm truncate">{mostResilient?.shortName || 'Govt Debt'}</span>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                {mostResilient?.riskScore || 49}%
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-1 font-mono">{mostResilient?.riskTrend || -1.2}% (Negative Drift)</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">Total Intercepted Volume</span>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-sm font-mono">{totalThreatVolume} Payloads</span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                99.1% Halt
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 truncate">Capital volume guarded</span>
          </div>
        </div>

        {/* Selected Asset Class Deep-Dive Dossier */}
        {selectedAsset && (
          <div id="selected-asset-class-dossier" className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{selectedAsset.assetClass}</h4>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {selectedAsset.marketCode}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Surveillance Dossier & Automated Safeguard Profile
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                    selectedAsset.riskScore >= 80
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : selectedAsset.riskScore >= 65
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  }`}
                >
                  THREAT LEVEL: {selectedAsset.threatLevel} ({selectedAsset.riskScore}%)
                </span>
                <button
                  onClick={() => {
                    notifyHighRiskEntity({
                      entityName: selectedAsset.prominentTarget,
                      riskScore: selectedAsset.riskScore,
                      violation: selectedAsset.primaryVector,
                      statutoryRule: selectedAsset.regulatoryAction,
                      message: `Real-time risk surge detected in ${selectedAsset.assetClass} (${selectedAsset.marketCode})`
                    });
                    setSimulatedAlertFired(true);
                    setTimeout(() => setSimulatedAlertFired(false), 3000);
                  }}
                  className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Bell className="w-3.5 h-3.5" />
                  {simulatedAlertFired ? 'Alert Dispatched!' : 'Dispatch MII Alert'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block font-medium">Primary Generative Attack Modality</span>
                <p className="text-slate-200 font-semibold leading-snug">{selectedAsset.primaryVector}</p>
                <div className="pt-2 text-[11px] text-slate-400">
                  <span className="text-slate-500">Highest Risk Target:</span>{' '}
                  <span className="text-white font-mono font-bold">{selectedAsset.prominentTarget}</span>
                </div>
              </div>

              <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block font-medium">Automated Surveillance & Regulatory Mandate</span>
                <p className="text-emerald-400 font-semibold leading-snug">{selectedAsset.regulatoryAction}</p>
                <div className="pt-2 text-[11px] text-slate-400">
                  <span className="text-slate-500">Capital Volume Guarded:</span>{' '}
                  <span className="text-cyan-300 font-mono font-bold">{selectedAsset.protectedVolume}</span>
                </div>
              </div>

              <div className="space-y-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block font-medium">Telemetry Baseline Comparison</span>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Current Real-Time Score:</span>
                  <span className="text-white font-mono font-bold">{selectedAsset.riskScore}%</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">30-Day Moving Baseline:</span>
                  <span className="text-cyan-400 font-mono">{selectedAsset.benchmarkScore}%</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Active Incident Payloads:</span>
                  <span className="text-amber-400 font-mono">{selectedAsset.incidentCount} attacks</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800 mt-1">
                  <div
                    className={`h-full ${
                      selectedAsset.riskScore >= 80
                        ? 'bg-red-500'
                        : selectedAsset.riskScore >= 65
                        ? 'bg-amber-500'
                        : 'bg-cyan-500'
                    }`}
                    style={{ width: `${selectedAsset.riskScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
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
                <th className="py-2.5 px-3 text-right">Radar Toast</th>
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
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (inc.channel === 'audio_call') {
                          notifyVoiceSpoof({
                            entityName: inc.targetAsset,
                            confidence: inc.riskScore,
                            message: `${inc.threatType}. Flagged by: ${inc.flaggedBy}.`,
                            markers: ['Acoustic Vocoder Cutoff', 'Prosody Flattening', 'VoIP Spoofed Gateway'],
                            haltStatus: 'Telephonic Order Intercepted (<16ms)'
                          });
                        } else {
                          notifyHighRiskEntity({
                            entityName: inc.targetAsset,
                            riskScore: inc.riskScore,
                            message: `${inc.threatType}. Detection: ${inc.detectionMethod}.`,
                            haltStatus: 'Exchange Clearing Settlement Hold'
                          });
                        }
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 text-[10px] font-semibold flex items-center gap-1 ml-auto transition-colors"
                      title="Dispatch real-time toast alert for this incident"
                    >
                      <Bell className="w-3 h-3" />
                      <span>Alert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
