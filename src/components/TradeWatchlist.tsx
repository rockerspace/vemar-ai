import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Bell,
  BellRing,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Radio,
  Pause,
  Play,
  Search,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  FileDown,
  Check,
  RefreshCw,
  Activity,
  Layers,
  Database
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  YAxis,
  XAxis
} from 'recharts';
import { WatchlistTicker, PriceAlert, PriceAlertType, Jurisdiction } from '../types';
import {
  getInitialWatchlist,
  ADDABLE_ASSET_CATALOG,
  AddableAssetCatalogItem
} from '../data/tradeWatchlistData';
import { useNotificationToast } from '../context/NotificationToastContext';
import { playThreatChime } from '../utils/audioAlert';
import { downloadCryptographicallySignedPDF } from '../utils/pdfExport';
import { auditRecordToForensicFinding } from '../utils/cryptoSignature';

interface TradeWatchlistProps {
  jurisdiction: Jurisdiction;
  onNavigateToScanner?: (ticker?: string) => void;
}

export const TradeWatchlist: React.FC<TradeWatchlistProps> = ({
  jurisdiction,
  onNavigateToScanner
}) => {
  const { notifyVoiceSpoof, notifyHighRiskEntity } = useNotificationToast();
  const isUS = jurisdiction === 'US';
  const storageKey = `vemar_trade_watchlist_v2_${jurisdiction}`;

  // Watchlist State
  const [watchlist, setWatchlist] = useState<WatchlistTicker[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load watchlist from localStorage', e);
    }
    return getInitialWatchlist(jurisdiction);
  });

  // Streaming State
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [lastTickTimestamp, setLastTickTimestamp] = useState<string>(new Date().toISOString());

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'equities' | 'derivatives' | 'high_risk' | 'alerts_triggered'>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'change' | 'ticker' | 'price'>('risk');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [selectedTickerForAlert, setSelectedTickerForAlert] = useState<WatchlistTicker | null>(null);

  // Add Asset Modal Search
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [customTickerInput, setCustomTickerInput] = useState({
    ticker: '',
    name: '',
    exchange: isUS ? 'NASDAQ' : 'NSE',
    assetClass: 'Equities',
    price: ''
  });
  const [addMode, setAddMode] = useState<'catalog' | 'custom'>('catalog');

  // New Alert Modal Form State
  const [alertForm, setAlertForm] = useState<{
    type: PriceAlertType;
    targetValue: string;
    note: string;
    autoQuarantine: boolean;
  }>({
    type: 'PRICE_BELOW',
    targetValue: '',
    note: '',
    autoQuarantine: false
  });

  // Track triggered alerts for audio and visual notification debouncing
  const triggeredAlertsRef = useRef<Set<string>>(new Set());

  // Reset watchlist when jurisdiction prop changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`vemar_trade_watchlist_v2_${jurisdiction}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWatchlist(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    setWatchlist(getInitialWatchlist(jurisdiction));
  }, [jurisdiction]);

  // Save watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(watchlist));
    } catch (e) {
      console.warn('Failed to save watchlist to localStorage', e);
    }
  }, [watchlist, storageKey]);

  // Real-Time Ticker Price & Threat Jitter Engine
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      setWatchlist((prev) => {
        if (!prev || prev.length === 0) return prev;

        return prev.map((item) => {
          // Jitter price slightly (random -0.4% to +0.4%)
          const pctJitter = (Math.random() * 0.8 - 0.39) / 100;
          const rawNewPrice = item.currentPrice * (1 + pctJitter);
          const newPrice = Number(rawNewPrice.toFixed(item.currentPrice < 10 ? 2 : 1));
          const priceDiff = newPrice - (item.priceHistory[0]?.price || item.currentPrice);
          const newChange24h = Number((item.change24h + (newPrice - item.currentPrice)).toFixed(2));
          const newChangePct = Number(((newChange24h / (newPrice - newChange24h)) * 100).toFixed(2));

          // Jitter risk score occasionally
          let newRisk = item.riskScore;
          if (item.isFlaggedByVemar && Math.random() > 0.6) {
            const riskJitter = Math.floor(Math.random() * 5 - 2);
            newRisk = Math.min(99, Math.max(60, item.riskScore + riskJitter));
          }

          let newThreatLevel = item.threatLevel;
          if (newRisk >= 80) newThreatLevel = 'CRITICAL';
          else if (newRisk >= 65) newThreatLevel = 'HIGH';
          else if (newRisk >= 45) newThreatLevel = 'MEDIUM';
          else newThreatLevel = 'LOW';

          const newHistory = [...item.priceHistory, { time: timeLabel, price: newPrice, risk: newRisk }];
          if (newHistory.length > 10) newHistory.shift();

          // Evaluate alerts
          let newlyQuarantined = item.quarantined;
          const updatedAlerts = item.alerts.map((alt) => {
            if (!alt.active) return alt;

            let conditionMet = false;
            if (alt.type === 'PRICE_ABOVE' && newPrice >= alt.targetValue) conditionMet = true;
            else if (alt.type === 'PRICE_BELOW' && newPrice <= alt.targetValue) conditionMet = true;
            else if (alt.type === 'PERCENT_CHANGE_UP' && newChangePct >= alt.targetValue) conditionMet = true;
            else if (alt.type === 'PERCENT_CHANGE_DOWN' && newChangePct <= -Math.abs(alt.targetValue)) conditionMet = true;
            else if (alt.type === 'RISK_SCORE_ABOVE' && newRisk >= alt.targetValue) conditionMet = true;

            if (conditionMet && !alt.triggered) {
              const alertKey = `${item.id}-${alt.id}-${Math.floor(Date.now() / 60000)}`;
              if (!triggeredAlertsRef.current.has(alertKey)) {
                triggeredAlertsRef.current.add(alertKey);
                playThreatChime('pre_trade_halt');

                notifyHighRiskEntity({
                  entityName: `${item.ticker} (${item.exchange})`,
                  riskScore: newRisk,
                  message: `Watchlist Alert Triggered: ${alt.note || alt.type} (Target: ${alt.targetValue}). Current Price: ${item.currencySymbol}${newPrice}.`,
                  haltStatus: alt.autoQuarantine ? 'FIX 35=D Order Automatically Quarantined' : 'Watchlist Surveillance Warning'
                });

                if (alt.autoQuarantine) {
                  newlyQuarantined = true;
                }
              }

              return {
                ...alt,
                triggered: true,
                triggeredAt: new Date().toISOString()
              };
            }

            return alt;
          });

          return {
            ...item,
            currentPrice: newPrice,
            change24h: newChange24h,
            changePercent24h: newChangePct,
            dayHigh: Math.max(item.dayHigh, newPrice),
            dayLow: Math.min(item.dayLow, newPrice),
            riskScore: newRisk,
            threatLevel: newThreatLevel,
            priceHistory: newHistory,
            alerts: updatedAlerts,
            quarantined: newlyQuarantined,
            bidPrice: Number((newPrice - (item.currentPrice < 10 ? 0.05 : 0.3)).toFixed(2)),
            askPrice: Number((newPrice + (item.currentPrice < 10 ? 0.05 : 0.3)).toFixed(2))
          };
        });
      });

      setLastTickTimestamp(new Date().toISOString());
    }, 2200);

    return () => clearInterval(interval);
  }, [isStreaming, notifyHighRiskEntity]);

  // Filtered & Sorted Watchlist
  const filteredList = useMemo(() => {
    return watchlist
      .filter((item) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            item.ticker.toLowerCase().includes(q) ||
            item.name.toLowerCase().includes(q) ||
            item.exchange.toLowerCase().includes(q) ||
            item.primaryThreatVector.toLowerCase().includes(q);
          if (!matches) return false;
        }

        if (categoryFilter === 'equities' && item.assetClass !== 'Equities') return false;
        if (categoryFilter === 'derivatives' && item.assetClass !== 'Derivatives') return false;
        if (categoryFilter === 'high_risk' && item.riskScore < 70) return false;
        if (categoryFilter === 'alerts_triggered' && !item.alerts.some((a) => a.triggered)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'risk') return b.riskScore - a.riskScore;
        if (sortBy === 'change') return b.changePercent24h - a.changePercent24h;
        if (sortBy === 'price') return b.currentPrice - a.currentPrice;
        return a.ticker.localeCompare(b.ticker);
      });
  }, [watchlist, searchQuery, categoryFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = watchlist.length;
    const criticalCount = watchlist.filter((w) => w.threatLevel === 'CRITICAL' || w.riskScore >= 80).length;
    const highRiskCount = watchlist.filter((w) => w.riskScore >= 65).length;
    const quarantinedCount = watchlist.filter((w) => w.quarantined).length;
    const totalAlerts = watchlist.reduce((sum, w) => sum + w.alerts.length, 0);
    const triggeredAlerts = watchlist.reduce((sum, w) => sum + w.alerts.filter((a) => a.triggered).length, 0);

    return {
      total,
      criticalCount,
      highRiskCount,
      quarantinedCount,
      totalAlerts,
      triggeredAlerts
    };
  }, [watchlist]);

  // Action: Toggle Quarantine
  const handleToggleQuarantine = (tickerId: string) => {
    setWatchlist((prev) =>
      prev.map((t) => {
        if (t.id === tickerId) {
          const nextState = !t.quarantined;
          if (nextState) {
            playThreatChime('pre_trade_halt');
            notifyHighRiskEntity({
              entityName: `${t.ticker} (${t.exchange})`,
              riskScore: t.riskScore,
              message: `Pre-Trade Algorithmic Execution Quarantined. FIX 4.4 Tag 35=D locked in <14ms.`,
              haltStatus: 'DEFENSE HALT ACTIVE'
            });
          }
          return { ...t, quarantined: nextState };
        }
        return t;
      })
    );
  };

  // Action: Remove from Watchlist
  const handleRemoveTicker = (tickerId: string) => {
    setWatchlist((prev) => prev.filter((t) => t.id !== tickerId));
  };

  // Action: Open Alert Modal
  const handleOpenAlertModal = (ticker: WatchlistTicker) => {
    setSelectedTickerForAlert(ticker);
    setAlertForm({
      type: 'PRICE_BELOW',
      targetValue: (ticker.currentPrice * 0.95).toFixed(ticker.currentPrice < 10 ? 2 : 1),
      note: `Pre-Trade Volatility Floor for ${ticker.ticker}`,
      autoQuarantine: true
    });
    setIsAlertModalOpen(true);
  };

  // Action: Save New Alert
  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTickerForAlert || !alertForm.targetValue) return;

    const val = Number(alertForm.targetValue);
    if (isNaN(val)) return;

    const newAlert: PriceAlert = {
      id: `alt-${Date.now().toString(36)}`,
      type: alertForm.type,
      targetValue: val,
      note: alertForm.note || `${alertForm.type.replace('_', ' ')} ${val}`,
      createdAt: new Date().toISOString(),
      triggered: false,
      active: true,
      autoQuarantine: alertForm.autoQuarantine
    };

    setWatchlist((prev) =>
      prev.map((t) => {
        if (t.id === selectedTickerForAlert.id) {
          return {
            ...t,
            alerts: [...t.alerts, newAlert]
          };
        }
        return t;
      })
    );

    setIsAlertModalOpen(false);
  };

  // Action: Toggle Alert Active State
  const handleToggleAlert = (tickerId: string, alertId: string) => {
    setWatchlist((prev) =>
      prev.map((t) => {
        if (t.id === tickerId) {
          return {
            ...t,
            alerts: t.alerts.map((a) => (a.id === alertId ? { ...a, active: !a.active } : a))
          };
        }
        return t;
      })
    );
  };

  // Action: Delete Alert
  const handleDeleteAlert = (tickerId: string, alertId: string) => {
    setWatchlist((prev) =>
      prev.map((t) => {
        if (t.id === tickerId) {
          return {
            ...t,
            alerts: t.alerts.filter((a) => a.id !== alertId)
          };
        }
        return t;
      })
    );
  };

  // Action: Add Ticker from Catalog
  const handleAddCatalogAsset = (item: AddableAssetCatalogItem) => {
    // Check if already exists
    if (watchlist.some((w) => w.ticker === item.ticker && w.exchange === item.exchange)) {
      setIsAddModalOpen(false);
      return;
    }

    const newTicker: WatchlistTicker = {
      id: `wl-${Date.now().toString(36)}`,
      ticker: item.ticker,
      name: item.name,
      exchange: item.exchange,
      assetClass: item.assetClass,
      jurisdiction: item.jurisdiction,
      currentPrice: item.currentPrice,
      currency: item.currency,
      currencySymbol: item.currencySymbol,
      change24h: 0,
      changePercent24h: 0,
      dayHigh: item.dayHigh,
      dayLow: item.dayLow,
      volume24h: item.volume24h,
      vwap: item.currentPrice,
      bidPrice: Number((item.currentPrice * 0.999).toFixed(2)),
      askPrice: Number((item.currentPrice * 1.001).toFixed(2)),
      riskScore: item.riskScore,
      threatLevel: item.threatLevel,
      primaryThreatVector: item.primaryThreatVector,
      activeAttackDetected: item.isFlaggedByVemar,
      priceHistory: [
        { time: '09:30', price: item.currentPrice * 0.99, risk: item.riskScore },
        { time: '12:00', price: item.currentPrice, risk: item.riskScore }
      ],
      alerts: item.isFlaggedByVemar
        ? [
            {
              id: `alt-${Date.now()}`,
              type: 'RISK_SCORE_ABOVE',
              targetValue: 80,
              note: 'Automated VEMAR Surveillance Flag',
              createdAt: new Date().toISOString(),
              triggered: false,
              active: true
            }
          ]
        : [],
      isFlaggedByVemar: item.isFlaggedByVemar,
      quarantined: false,
      addedAt: new Date().toISOString(),
      statutoryRegime: item.statutoryRegime
    };

    setWatchlist((prev) => [newTicker, ...prev]);
    setIsAddModalOpen(false);
  };

  // Action: Add Custom Ticker
  const handleAddCustomAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTickerInput.ticker.trim() || !customTickerInput.price) return;

    const parsedPrice = parseFloat(customTickerInput.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) return;

    const cleanSymbol = customTickerInput.ticker.trim().toUpperCase();
    if (watchlist.some((w) => w.ticker === cleanSymbol)) {
      setIsAddModalOpen(false);
      return;
    }

    const isHighThreat = Math.random() > 0.4;
    const synthesizedRisk = isHighThreat ? Math.floor(Math.random() * 25 + 75) : Math.floor(Math.random() * 30 + 20);

    const newTicker: WatchlistTicker = {
      id: `wl-custom-${Date.now().toString(36)}`,
      ticker: cleanSymbol,
      name: customTickerInput.name.trim() || `${cleanSymbol} Security`,
      exchange: customTickerInput.exchange as any,
      assetClass: customTickerInput.assetClass as any,
      jurisdiction,
      currentPrice: parsedPrice,
      currency: isUS ? 'USD' : 'INR',
      currencySymbol: isUS ? '$' : '₹',
      change24h: 0,
      changePercent24h: 0,
      dayHigh: parsedPrice * 1.02,
      dayLow: parsedPrice * 0.98,
      volume24h: '1.2M',
      vwap: parsedPrice,
      bidPrice: Number((parsedPrice * 0.998).toFixed(2)),
      askPrice: Number((parsedPrice * 1.002).toFixed(2)),
      riskScore: synthesizedRisk,
      threatLevel: synthesizedRisk >= 80 ? 'CRITICAL' : synthesizedRisk >= 65 ? 'HIGH' : synthesizedRisk >= 45 ? 'MEDIUM' : 'LOW',
      primaryThreatVector: isHighThreat
        ? 'Real-Time Neural Synthetic Threat & Anomalous Spread Monitoring Active'
        : 'Nominal Market Maker Flow (Continuous Verification)',
      activeAttackDetected: isHighThreat,
      priceHistory: [
        { time: '09:30', price: parsedPrice * 0.995, risk: synthesizedRisk },
        { time: '12:00', price: parsedPrice, risk: synthesizedRisk }
      ],
      alerts: [
        {
          id: `alt-${Date.now()}`,
          type: 'PRICE_BELOW',
          targetValue: Number((parsedPrice * 0.95).toFixed(2)),
          note: `Pre-Trade Volatility Floor for ${cleanSymbol}`,
          createdAt: new Date().toISOString(),
          triggered: false,
          active: true,
          autoQuarantine: isHighThreat
        }
      ],
      isFlaggedByVemar: isHighThreat,
      quarantined: false,
      addedAt: new Date().toISOString(),
      statutoryRegime: isUS ? 'SEC Rule 10b-5 / FINRA Rule 2010' : 'SEBI PFUTP Reg 4(2)(k)'
    };

    setWatchlist((prev) => [newTicker, ...prev]);
    setCustomTickerInput({
      ticker: '',
      name: '',
      exchange: isUS ? 'NASDAQ' : 'NSE',
      assetClass: 'Equities',
      price: ''
    });
    setIsAddModalOpen(false);
  };

  // Action: Simulate Volatility Surge
  const handleSimulateAttackSurge = () => {
    setWatchlist((prev) =>
      prev.map((item, idx) => {
        if (idx === 0) {
          const spikedPrice = Number((item.currentPrice * 0.91).toFixed(2));
          return {
            ...item,
            currentPrice: spikedPrice,
            changePercent24h: -9.4,
            riskScore: 98,
            threatLevel: 'CRITICAL',
            activeAttackDetected: true,
            quarantined: true,
            alerts: item.alerts.map((a) => ({ ...a, triggered: true, triggeredAt: new Date().toISOString() }))
          };
        }
        return item;
      })
    );

    playThreatChime('voice_spoof');
    notifyVoiceSpoof({
      entityName: watchlist[0]?.ticker || (isUS ? 'NVDA (NASDAQ)' : 'TATAMOTORS (NSE)'),
      confidence: 98,
      message: 'Simulated AI Voice Clone & Volatility Ingress Surge Intercepted on Live Trading Grid.',
      haltStatus: 'PRE-TRADE FIX 35=D DROP-COPY HALTED'
    });
  };

  // Action: Export Signed PDF for Ticker
  const handleExportTickerDossier = (ticker: WatchlistTicker) => {
    const findingAnalysis = auditRecordToForensicFinding({
      id: `WATCHLIST-${ticker.ticker}-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      sequenceNumber: 10499,
      prevHash: '00000000000000000004f8a91bc7d3e5210984a1e94473ef90812bdcb89a2430',
      recordHash: '8b7f294029485710293847561928374659102938475610293847561928374650',
      operatorName: 'Watchlist Real-Time Surveillance Engine',
      operatorEmail: 'surveillance@vemar.internal',
      operatorRole: 'broker_compliance',
      action: 'PRE_TRADE_ORDER_HALTED',
      actionLabel: `Real-Time Asset Surveillance: ${ticker.ticker} (${ticker.exchange})`,
      category: 'Pre-Trade Surveillance',
      jurisdiction: ticker.jurisdiction,
      statutoryRegime: ticker.statutoryRegime || (ticker.jurisdiction === 'US' ? 'SEC Rule 10b-5 / FINRA 2010' : 'SEBI PFUTP Reg 4(2)(k)'),
      targetAssetOrEntity: `${ticker.ticker} (${ticker.name})`,
      severity: ticker.threatLevel === 'CRITICAL' ? 'CRITICAL' : ticker.threatLevel === 'HIGH' ? 'HIGH' : 'INFO',
      status: ticker.quarantined ? 'FLAGGED' : 'VERIFIED',
      ipAddress: '103.21.244.12',
      sessionId: 'sess_surv_live',
      userAgent: 'VEMAR-Radar-Watchlist/3.0.0',
      details: {
        summary: `Real-time watchlist threat dossier for ${ticker.ticker}. Current Price: ${ticker.currencySymbol}${ticker.currentPrice} (${ticker.changePercent24h}% 24h). Synthetic Risk: ${ticker.riskScore}%. Threat Vector: ${ticker.primaryThreatVector}.`,
        targetEntity: ticker.name,
        riskScore: ticker.riskScore,
        threatLevel: ticker.threatLevel,
        statutoryCode: ticker.statutoryRegime,
        metadata: {
          ticker: ticker.ticker,
          exchange: ticker.exchange,
          currentPrice: ticker.currentPrice,
          volume24h: ticker.volume24h,
          quarantined: ticker.quarantined,
          alertsCount: ticker.alerts.length
        }
      }
    });

    downloadCryptographicallySignedPDF(findingAnalysis, {
      caseTitle: `${ticker.ticker}-Watchlist-Dossier`,
      jurisdiction: ticker.jurisdiction,
      auditorRole: 'broker_compliance',
      auditorEmail: 'compliance@vemar.internal',
      engineSource: 'VEMAR Real-Time Surveillance Radar Engine'
    });
  };

  return (
    <div id="trade-watchlist-container" className="space-y-4">
      {/* Top Banner & Telemetry Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Real-Time High-Risk Trade Watchlist & Pre-Trade Defense
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                    VEMAR RADAR
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live multi-market asset surveillance, synthetic threat scoring, and automated price/risk threshold triggers.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Live Stream Controller */}
            <button
              id="toggle-watchlist-stream-btn"
              type="button"
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isStreaming
                  ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-amber-950/60 border border-amber-800/80 text-amber-300 hover:bg-amber-900/60'
              }`}
              title={isStreaming ? 'Pause real-time ticker tick updates' : 'Resume real-time ticker stream'}
            >
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span>{isStreaming ? 'Live Stream: Active (2.2s)' : 'Stream Paused'}</span>
              {isStreaming ? <Pause className="w-3 h-3 ml-0.5" /> : <Play className="w-3 h-3 ml-0.5" />}
            </button>

            {/* Attack Surge Simulation Button */}
            <button
              id="simulate-attack-surge-btn"
              type="button"
              onClick={handleSimulateAttackSurge}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Simulate a real-time deepfake & volatility breakout attack on watchlist"
            >
              <Zap className="w-3.5 h-3.5 text-red-400" />
              <span>Simulate Threat Spike</span>
            </button>

            {/* Add Asset Button */}
            <button
              id="open-add-asset-modal-btn"
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950/50 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Ticker Asset</span>
            </button>
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Watched Assets</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-white">{stats.total}</span>
              <span className="text-[10px] text-cyan-400 font-mono">{isUS ? 'US & CME' : 'NSE & BSE'}</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 block">Critical Threats</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-red-400">{stats.criticalCount}</span>
              <span className="text-[10px] text-red-300 font-mono">Risk ≥ 80%</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">Active Price Alerts</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-amber-300">{stats.totalAlerts}</span>
              <span className="text-[10px] text-slate-400 font-mono">({stats.triggeredAlerts} Triggered)</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 block">Pre-Trade Quarantines</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-purple-300">{stats.quarantinedCount}</span>
              <span className="text-[10px] text-purple-400 font-mono">FIX 35=D Locked</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">Feed Latency</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-emerald-400">12.8ms</span>
              <span className="text-[10px] text-emerald-300 font-mono">mTLS 1.3 Sync</span>
            </div>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: `All (${watchlist.length})` },
              { id: 'high_risk', label: `High Risk (≥65%)` },
              { id: 'alerts_triggered', label: `Alerts Triggered (${stats.triggeredAlerts})` },
              { id: 'equities', label: 'Equities' },
              { id: 'derivatives', label: 'Derivatives' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
            <div className="relative flex-grow sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticker, name, vector..."
                className="w-full pl-8 pr-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="risk">Sort: Highest Risk</option>
              <option value="change">Sort: 24h Change %</option>
              <option value="price">Sort: Price</option>
              <option value="ticker">Sort: Ticker A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Watchlist Grid View */}
      {filteredList.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Database className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-200">No watched tickers match the active filter criteria.</p>
          <p className="text-xs text-slate-500">Try clearing your search query or add a new security to your watchlist.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((item) => {
            const isNegative = item.change24h < 0;
            const isCritical = item.threatLevel === 'CRITICAL';
            const isHigh = item.threatLevel === 'HIGH';
            const hasTriggeredAlert = item.alerts.some((a) => a.triggered && a.active);

            return (
              <div
                key={item.id}
                className={`bg-slate-900 border rounded-2xl p-4.5 shadow-xl transition-all space-y-3.5 relative overflow-hidden ${
                  item.quarantined
                    ? 'border-purple-500/60 bg-gradient-to-b from-purple-950/20 via-slate-900 to-slate-900'
                    : hasTriggeredAlert
                    ? 'border-amber-500/60 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900'
                    : isCritical
                    ? 'border-red-500/50 hover:border-red-500'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Top Ticker Row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base text-white font-mono tracking-tight">
                        {item.ticker}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                        {item.exchange}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800/80 text-slate-400">
                        {item.assetClass}
                      </span>
                      {item.quarantined && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-900/80 text-purple-200 border border-purple-600 animate-pulse flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>PRE-TRADE HALTED</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block truncate max-w-xs mt-0.5">
                      {item.name}
                    </span>
                  </div>

                  {/* Price & Change */}
                  <div className="text-right shrink-0">
                    <div className="font-mono text-base font-bold text-white tabular-nums">
                      {item.currencySymbol}
                      {item.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`font-mono text-xs font-semibold tabular-nums flex items-center justify-end gap-0.5 ${
                        isNegative ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {isNegative ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      <span>
                        {isNegative ? '' : '+'}
                        {item.change24h.toFixed(2)} ({isNegative ? '' : '+'}
                        {item.changePercent24h.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* VEMAR Synthetic Risk Assessment Banner */}
                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                    isCritical
                      ? 'bg-red-950/30 border-red-500/40 text-red-200'
                      : isHigh
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <ShieldAlert className={`w-4 h-4 shrink-0 ${isCritical ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
                    <div className="truncate">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-75">
                        Synthetic Threat Vector
                      </span>
                      <span className="text-xs font-semibold truncate block">
                        {item.primaryThreatVector}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono block opacity-75">VEMAR RISK</span>
                    <span className="text-sm font-bold font-mono">
                      {item.riskScore}% [{item.threatLevel}]
                    </span>
                  </div>
                </div>

                {/* Live Intraday Sparkline Area Chart */}
                <div className="h-16 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={item.priceHistory} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`grad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isCritical ? '#ef4444' : isNegative ? '#f59e0b' : '#06b6d4'} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={isCritical ? '#ef4444' : isNegative ? '#f59e0b' : '#06b6d4'} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-black/90 border border-slate-700 rounded-lg p-1.5 text-[10px] font-mono text-white shadow-xl pointer-events-none">
                                <div>Time: {d.time}</div>
                                <div>Price: {item.currencySymbol}{d.price}</div>
                                <div className="text-red-400">Threat: {d.risk}%</div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={isCritical ? '#ef4444' : isNegative ? '#f59e0b' : '#06b6d4'}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#grad-${item.id})`}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Micro Metrics Strip: Bid/Ask, High/Low, Volume */}
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block">Bid / Ask</span>
                    <span className="text-slate-200">
                      {item.bidPrice} / {item.askPrice}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Day Range</span>
                    <span className="text-slate-200">
                      {item.dayLow} - {item.dayHigh}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">24h Volume</span>
                    <span className="text-slate-200">{item.volume24h}</span>
                  </div>
                </div>

                {/* Price Alerts Pill Area */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      <span>Price & Risk Triggers ({item.alerts.length})</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenAlertModal(item)}
                      className="text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Set Alert</span>
                    </button>
                  </div>

                  {item.alerts.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {item.alerts.map((alt) => (
                        <div
                          key={alt.id}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 border transition-all ${
                            alt.triggered
                              ? 'bg-amber-950/60 border-amber-500/60 text-amber-200 animate-pulse'
                              : alt.active
                              ? 'bg-slate-950 border-slate-800 text-slate-300'
                              : 'bg-slate-950/40 border-slate-900 text-slate-600 line-through'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleAlert(item.id, alt.id)}
                            className="text-amber-400 hover:text-amber-300 cursor-pointer"
                            title={alt.active ? 'Disable alert' : 'Enable alert'}
                          >
                            {alt.triggered ? <BellRing className="w-3 h-3 text-amber-400" /> : <Bell className="w-3 h-3" />}
                          </button>

                          <span>
                            {alt.type === 'PRICE_ABOVE' && `Price ≥ ${item.currencySymbol}${alt.targetValue}`}
                            {alt.type === 'PRICE_BELOW' && `Price ≤ ${item.currencySymbol}${alt.targetValue}`}
                            {alt.type === 'PERCENT_CHANGE_UP' && `Change ≥ +${alt.targetValue}%`}
                            {alt.type === 'PERCENT_CHANGE_DOWN' && `Change ≤ -${alt.targetValue}%`}
                            {alt.type === 'RISK_SCORE_ABOVE' && `Risk ≥ ${alt.targetValue}%`}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleDeleteAlert(item.id, alt.id)}
                            className="text-slate-500 hover:text-red-400 p-0.5 ml-0.5 cursor-pointer"
                            title="Remove alert"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 italic">
                      No price threshold or risk alerts configured for this ticker.
                    </div>
                  )}
                </div>

                {/* Card Action Controls Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  {/* Left Actions: Quarantine / Defense Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleQuarantine(item.id)}
                    className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                      item.quarantined
                        ? 'bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                    title="Toggle Pre-Trade Algorithmic Execution Quarantine (FIX Protocol Drop-Copy Intercept)"
                  >
                    {item.quarantined ? <Unlock className="w-3 h-3 text-purple-300" /> : <Lock className="w-3 h-3 text-cyan-400" />}
                    <span>{item.quarantined ? 'Release Halt' : 'Quarantine Order'}</span>
                  </button>

                  {/* Right Actions: Deep Scan & Signed PDF */}
                  <div className="flex items-center gap-1.5">
                    {onNavigateToScanner && (
                      <button
                        type="button"
                        onClick={() => onNavigateToScanner(item.ticker)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Run multi-modal neural forensic analysis on this ticker"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>Scan</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleExportTickerDossier(item)}
                      className="px-2 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Download cryptographically signed C2PA PDF evidence report"
                    >
                      <FileDown className="w-3 h-3 text-emerald-400" />
                      <span>Dossier</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveTicker(item.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Remove ticker from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ADD ASSET TO WATCHLIST MODAL                                            */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div
          id="add-watchlist-asset-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add Security to Surveillance Watchlist</h3>
                  <p className="text-xs text-slate-400">
                    Track real-time pricing, neural synthetic threat index, and automated price breakout alerts.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setAddMode('catalog')}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    addMode === 'catalog'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Flagged Asset Catalog ({isUS ? 'US Markets' : 'Indian MIIs'})
                </button>
                <button
                  type="button"
                  onClick={() => setAddMode('custom')}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    addMode === 'custom'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Custom Ticker Symbol
                </button>
              </div>

              {addMode === 'catalog' ? (
                <>
                  {/* Search catalog */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      Search Capital Markets Asset Catalog ({isUS ? 'US / NASDAQ / NYSE / CME' : 'NSE / BSE / MCX'})
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        placeholder="Search by symbol or company name (e.g., ZOMATO, PAYTM, META, MSFT)..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

              {/* Addable Catalog List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">
                  Select Flagged High-Risk Assets & Market Equities:
                </span>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {ADDABLE_ASSET_CATALOG.filter((item) => {
                    if (catalogSearch.trim()) {
                      const q = catalogSearch.toLowerCase();
                      return (
                        item.ticker.toLowerCase().includes(q) ||
                        item.name.toLowerCase().includes(q) ||
                        item.exchange.toLowerCase().includes(q) ||
                        item.primaryThreatVector.toLowerCase().includes(q)
                      );
                    }
                    return isUS ? item.jurisdiction === 'US' : item.jurisdiction === 'IN';
                  }).map((catItem) => {
                    const isAlreadyAdded = watchlist.some((w) => w.ticker === catItem.ticker);

                    return (
                      <div
                        key={catItem.ticker}
                        className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 text-xs transition-all"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-mono">{catItem.ticker}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-cyan-300">
                              {catItem.exchange}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800/80 text-slate-400">
                              {catItem.assetClass}
                            </span>
                            {catItem.isFlaggedByVemar && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-red-950 text-red-300 border border-red-800">
                                THREAT FLAGGED
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 block truncate max-w-sm">{catItem.name}</span>
                          <span className="text-[11px] text-slate-500 block truncate max-w-md">
                            {catItem.primaryThreatVector}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="font-mono font-bold text-white block">
                              {catItem.currencySymbol}{catItem.currentPrice.toLocaleString()}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold block ${
                                catItem.riskScore >= 70 ? 'text-red-400' : 'text-cyan-400'
                              }`}
                            >
                              Risk: {catItem.riskScore}%
                            </span>
                          </div>

                          <button
                            type="button"
                            disabled={isAlreadyAdded}
                            onClick={() => handleAddCatalogAsset(catItem)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isAlreadyAdded
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                            }`}
                          >
                            {isAlreadyAdded ? 'Added' : 'Track'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              </>
              ) : (
                /* Custom Ticker Entry Form */
                <form onSubmit={handleAddCustomAsset} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1 text-xs">
                        Ticker Symbol *
                      </label>
                      <input
                        type="text"
                        value={customTickerInput.ticker}
                        onChange={(e) => setCustomTickerInput({ ...customTickerInput, ticker: e.target.value.toUpperCase() })}
                        placeholder="e.g. COIN, HDFCLIFE, BTCUSD"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1 text-xs">
                        Exchange Venue
                      </label>
                      <select
                        value={customTickerInput.exchange}
                        onChange={(e) => setCustomTickerInput({ ...customTickerInput, exchange: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                      >
                        {isUS ? (
                          <>
                            <option value="NASDAQ">NASDAQ</option>
                            <option value="NYSE">NYSE</option>
                            <option value="CME">CME (Derivatives)</option>
                          </>
                        ) : (
                          <>
                            <option value="NSE">NSE</option>
                            <option value="BSE">BSE</option>
                            <option value="MCX">MCX (Commodities)</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 text-xs">
                      Company / Instrument Name
                    </label>
                    <input
                      type="text"
                      value={customTickerInput.name}
                      onChange={(e) => setCustomTickerInput({ ...customTickerInput, name: e.target.value })}
                      placeholder="e.g. Coinbase Global, Inc."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1 text-xs">
                        Asset Class
                      </label>
                      <select
                        value={customTickerInput.assetClass}
                        onChange={(e) => setCustomTickerInput({ ...customTickerInput, assetClass: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Equities">Equities</option>
                        <option value="Derivatives">Derivatives (F&O)</option>
                        <option value="Commodities">Commodities</option>
                        <option value="Forex">Forex</option>
                        <option value="Debt">Sovereign Debt</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1 text-xs">
                        Current Price ({isUS ? '$ USD' : '₹ INR'}) *
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={customTickerInput.price}
                        onChange={(e) => setCustomTickerInput({ ...customTickerInput, price: e.target.value })}
                        placeholder="e.g. 248.50"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-slate-400 space-y-1">
                    <span className="font-semibold text-cyan-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Automatic VEMAR AI Surveillance Integration
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      Custom symbols are instantly bound to the real-time jitter stream, continuous acoustic & deepfake sensor correlation, and initial stop-loss alerts.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-950/50 cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Watchlist</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CONFIGURE PRICE & VOLATILITY ALERT MODAL                               */}
      {/* ========================================================================= */}
      {isAlertModalOpen && selectedTickerForAlert && (
        <div
          id="configure-price-alert-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Set Price & Risk Alert for {selectedTickerForAlert.ticker}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Current Market Price: {selectedTickerForAlert.currencySymbol}
                    {selectedTickerForAlert.currentPrice} | Synthetic Risk: {selectedTickerForAlert.riskScore}%
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAlertModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlert} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Trigger Condition Type
                </label>
                <select
                  value={alertForm.type}
                  onChange={(e) => setAlertForm({ ...alertForm, type: e.target.value as PriceAlertType })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="PRICE_BELOW">Price Drops Below ≤ Target (Stop Loss / Breakdown)</option>
                  <option value="PRICE_ABOVE">Price Rises Above ≥ Target (Breakout / Surge)</option>
                  <option value="PERCENT_CHANGE_DOWN">24h Percentage Drop ≥ Target %</option>
                  <option value="PERCENT_CHANGE_UP">24h Percentage Surge ≥ Target %</option>
                  <option value="RISK_SCORE_ABOVE">VEMAR Synthetic Threat Risk Score ≥ Target %</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-300 font-semibold">
                    Target Threshold Value ({selectedTickerForAlert.currencySymbol} / %)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Current: {selectedTickerForAlert.currencySymbol}{selectedTickerForAlert.currentPrice}
                  </span>
                </div>
                <input
                  type="number"
                  step="any"
                  value={alertForm.targetValue}
                  onChange={(e) => setAlertForm({ ...alertForm, targetValue: e.target.value })}
                  placeholder={`e.g. ${(selectedTickerForAlert.currentPrice * 0.95).toFixed(2)}`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />

                {/* Quick Suggestion Chips */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] text-slate-500">Presets:</span>
                  {[
                    { label: '-3%', val: (selectedTickerForAlert.currentPrice * 0.97).toFixed(1) },
                    { label: '-5%', val: (selectedTickerForAlert.currentPrice * 0.95).toFixed(1) },
                    { label: '+5%', val: (selectedTickerForAlert.currentPrice * 1.05).toFixed(1) },
                    { label: '+10%', val: (selectedTickerForAlert.currentPrice * 1.10).toFixed(1) }
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setAlertForm({ ...alertForm, targetValue: chip.val })}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono cursor-pointer"
                    >
                      {chip.label} ({selectedTickerForAlert.currencySymbol}{chip.val})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Surveillance Notes & Statutory Description
                </label>
                <input
                  type="text"
                  value={alertForm.note}
                  onChange={(e) => setAlertForm({ ...alertForm, note: e.target.value })}
                  placeholder="e.g. SEBI CSCRF Pre-Trade Halt Trigger / Prime Wire Stop"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 bg-purple-950/20 border border-purple-800/40 rounded-xl space-y-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertForm.autoQuarantine}
                    onChange={(e) => setAlertForm({ ...alertForm, autoQuarantine: e.target.checked })}
                    className="rounded border-slate-700 text-purple-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-semibold text-purple-200">
                    Auto-Quarantine Pre-Trade (FIX Protocol Drop-Copy Intercept)
                  </span>
                </label>
                <p className="text-[10px] text-slate-400 pl-6 leading-relaxed">
                  Automatically isolates outbound FIX 4.4 Tag 35=D orders within 14ms if this threshold condition is breached.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAlertModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-950/50 cursor-pointer flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Activate Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
