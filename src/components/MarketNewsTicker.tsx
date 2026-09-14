import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCw,
  Zap,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  X,
  Volume2,
  VolumeX,
  Layers,
  ArrowUpRight,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { RegulatoryNewsItem, Jurisdiction, RegulatoryWireCategory, RegulatoryWireUrgency } from '../types';
import { newsApiClient } from '../services/newsService';
import { useLocalization } from '../context/LocalizationContext';

interface MarketNewsTickerProps {
  jurisdiction: Jurisdiction;
  onNavigateToScanner?: () => void;
}

export const MarketNewsTicker: React.FC<MarketNewsTickerProps> = ({
  jurisdiction,
  onNavigateToScanner
}) => {
  const { isHindi } = useLocalization();
  const [news, setNews] = useState<RegulatoryNewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RegulatoryNewsItem | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showExpandedFeed, setShowExpandedFeed] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<RegulatoryWireCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJurisdiction, setFilterJurisdiction] = useState<'ALL' | 'IN' | 'US'>('ALL');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initial jurisdiction with filter
  useEffect(() => {
    if (jurisdiction === 'IN') {
      setFilterJurisdiction('IN');
    } else if (jurisdiction === 'US') {
      setFilterJurisdiction('US');
    } else {
      setFilterJurisdiction('ALL');
    }
  }, [jurisdiction]);

  // Load news from simulated API client
  const loadNews = async () => {
    setIsLoading(true);
    try {
      const items = await newsApiClient.fetchNews({
        jurisdiction: filterJurisdiction,
        category: categoryFilter,
        search: searchQuery
      });
      setNews(items);
      if (currentIndex >= items.length) {
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Failed to fetch regulatory news:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [filterJurisdiction, categoryFilter, searchQuery]);

  // Subscribe to live updates from the news client
  useEffect(() => {
    const unsubscribe = newsApiClient.subscribe((allNews) => {
      // Re-filter according to current active view
      const filtered = allNews.filter(item => {
        const matchJ = filterJurisdiction === 'ALL' || item.jurisdiction === filterJurisdiction || item.jurisdiction === 'GLOBAL';
        const matchC = categoryFilter === 'ALL' || item.category === categoryFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchQ = !q || item.headline.toLowerCase().includes(q) || item.statutoryReference.toLowerCase().includes(q);
        return matchJ && matchC && matchQ;
      });
      setNews(filtered);
    });
    return () => unsubscribe();
  }, [filterJurisdiction, categoryFilter, searchQuery]);

  // Auto-advance ticker every 6 seconds when not paused
  useEffect(() => {
    if (isPaused || news.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, news.length]);

  const handlePrev = () => {
    if (news.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  const handleNext = () => {
    if (news.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const handleSimulateAlert = () => {
    const newAlert = newsApiClient.injectSimulatedBreakingAlert(
      filterJurisdiction === 'US' ? 'SEC' : 'SEBI'
    );
    setCurrentIndex(0);
    // Play subtle audio chime if unmuted
    if (!isMuted && typeof window !== 'undefined') {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } catch {
        // AudioContext disabled or blocked
      }
    }
  };

  const currentItem = news[currentIndex] || null;

  const getUrgencyBadge = (urgency: RegulatoryWireUrgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      case 'ALERT':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'UPDATE':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'ADVISORY':
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  const getSourceBadge = (source: string) => {
    if (source === 'SEBI') return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    if (source === 'SEC') return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (source === 'FINRA') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (source === 'NSE' || source === 'BSE') return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const copyToClipboard = (text: string, type: 'hash' | 'citation') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2000);
    }
  };

  return (
    <div className="relative z-20 w-full border-b border-cyan-900/30 bg-[#060a12]/95 backdrop-blur-md text-xs select-none">
      {/* Primary Ticker Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-11 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Live Indicator & Feed Title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] tracking-wider font-semibold text-cyan-300 uppercase">
              {isHindi ? 'नियामक वायर' : 'REG WIRE'}
            </span>
          </div>

          {/* Jurisdiction switch pills */}
          <div className="hidden md:flex items-center rounded-lg bg-slate-900/80 p-0.5 border border-slate-800 text-[10px]">
            <button
              onClick={() => setFilterJurisdiction('ALL')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filterJurisdiction === 'ALL'
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setFilterJurisdiction('IN')}
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                filterJurisdiction === 'IN'
                  ? 'bg-orange-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🇮🇳</span> SEBI
            </button>
            <button
              onClick={() => setFilterJurisdiction('US')}
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                filterJurisdiction === 'US'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🇺🇸</span> SEC
            </button>
          </div>
        </div>

        {/* Center: Dynamic Active Headline Display */}
        <div
          className="flex-1 min-w-0 mx-2 flex items-center gap-2 cursor-pointer group"
          onClick={() => currentItem && setSelectedItem(currentItem)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          title="Click to view complete statutory release & audit details"
        >
          {currentItem ? (
            <div className="flex items-center gap-2 truncate">
              {/* Urgency Badge */}
              <span className={`px-1.5 py-0.2 rounded border text-[9px] font-mono uppercase font-semibold shrink-0 ${getUrgencyBadge(currentItem.urgency)}`}>
                {currentItem.urgency}
              </span>

              {/* Source Badge */}
              <span className={`px-1.5 py-0.2 rounded border text-[10px] font-mono font-medium shrink-0 ${getSourceBadge(currentItem.source)}`}>
                {currentItem.source}
              </span>

              {/* Headline Text */}
              <span className="text-slate-200 group-hover:text-cyan-300 transition-colors font-medium truncate text-[11px] sm:text-xs">
                {isHindi && currentItem.hindiHeadline ? currentItem.hindiHeadline : currentItem.headline}
              </span>

              {/* Statutory Citation Ref */}
              <span className="hidden lg:inline-block font-mono text-[10px] text-slate-500 shrink-0 bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-800">
                {currentItem.statutoryReference}
              </span>

              {/* Timestamp */}
              <span className="hidden sm:inline-block text-[10px] text-slate-400 shrink-0 font-mono">
                {currentItem.displayTime}
              </span>

              {/* Hover Indicator */}
              <span className="hidden group-hover:inline-flex items-center text-cyan-400 text-[10px] shrink-0 font-mono">
                [Detail <ArrowUpRight className="w-3 h-3 ml-0.5" />]
              </span>
            </div>
          ) : (
            <span className="text-slate-500 italic text-[11px]">
              {isLoading ? 'Polling SEBI / SEC regulatory feeds...' : 'No news matching selected filters'}
            </span>
          )}
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Index Counter */}
          {news.length > 0 && (
            <span className="hidden sm:inline-block font-mono text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
              {String(currentIndex + 1).padStart(2, '0')}/{String(news.length).padStart(2, '0')}
            </span>
          )}

          {/* Steppers */}
          <button
            onClick={handlePrev}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Previous Headline"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Next Headline"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={isPaused ? 'Resume Ticker' : 'Pause Ticker'}
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
          </button>

          {/* Audio Chime Mute/Unmute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="hidden sm:inline-flex p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={isMuted ? 'Unmute Breaking Alert Chime' : 'Mute Breaking Alert Chime'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Simulate Flash Alert Button */}
          <button
            onClick={handleSimulateAlert}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono transition-colors"
            title="Simulate incoming breaking regulatory alert"
          >
            <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Sim Flash</span>
          </button>

          {/* Refresh */}
          <button
            onClick={loadNews}
            disabled={isLoading}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
            title="Refresh Regulatory Feed"
          >
            <RotateCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Toggle Expanded Wire Drawer */}
          <button
            onClick={() => setShowExpandedFeed(!showExpandedFeed)}
            className={`p-1 rounded border transition-colors flex items-center gap-1 text-[10px] font-mono ${
              showExpandedFeed
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Expanded Regulatory Wire Feed"
          >
            <Layers className="w-3 h-3" />
            <span className="hidden md:inline">Feed</span>
          </button>
        </div>
      </div>

      {/* Collapsible Expanded Wire Drawer */}
      {showExpandedFeed && (
        <div className="border-t border-slate-800 bg-[#050811] px-4 py-4 max-h-96 overflow-y-auto space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <div className="max-w-7xl mx-auto space-y-3">
            {/* Drawer Header & Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-sm font-semibold text-slate-200">
                  {isHindi ? 'लाइव नियामक इंटेलिजेंस वायर' : 'Live Institutional Regulatory Wire'}
                </h3>
                <span className="text-[10px] font-mono text-slate-500">
                  ({news.length} releases synchronized)
                </span>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isHindi ? 'सर्कुलर या कीवर्ड खोजें...' : 'Search circulars, rules...'}
                    className="pl-8 pr-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 px-2 py-1 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Categories</option>
                  <option value="DEEPFAKE_ALERT">Deepfake & AI Fraud</option>
                  <option value="ENFORCEMENT">Enforcement Actions</option>
                  <option value="CIRCULAR">Master Circulars</option>
                  <option value="CSCRF">CSCRF & Cybersecurity</option>
                  <option value="MARKET_ABUSE">Market Abuse & Spoofing</option>
                  <option value="LITIGATION">Litigation Releases</option>
                </select>

                <button
                  onClick={() => setShowExpandedFeed(false)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                  title="Close Wire Feed"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* News Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {news.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-semibold ${getUrgencyBadge(item.urgency)}`}>
                          {item.urgency}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-medium ${getSourceBadge(item.source)}`}>
                          {item.source}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{item.displayTime}</span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-relaxed">
                      {isHindi && item.hindiHeadline ? item.hindiHeadline : item.headline}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-normal">
                      {isHindi && item.hindiSummary ? item.hindiSummary : item.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="truncate max-w-[180px]">{item.statutoryReference}</span>
                    <span className="text-cyan-400 group-hover:underline flex items-center gap-0.5">
                      Inspect <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Regulatory News Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${getSourceBadge(selectedItem.source)}`}>
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${getUrgencyBadge(selectedItem.urgency)}`}>
                      {selectedItem.urgency}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {selectedItem.sourceFullName}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 mt-1">
                    {isHindi && selectedItem.hindiHeadline ? selectedItem.hindiHeadline : selectedItem.headline}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              {/* Statutory Reference Strip */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 font-mono">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Statutory / Gazette Reference</div>
                  <div className="text-xs text-cyan-300 font-semibold">{selectedItem.statutoryReference}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedItem.statutoryReference, 'citation')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                >
                  {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCitation ? 'Copied' : 'Copy Citation'}</span>
                </button>
              </div>

              {/* Full Summary */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  {isHindi ? 'नियामक सारांश एवं दायरा' : 'Executive Regulatory Summary & Scope'}
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  {isHindi && selectedItem.hindiSummary ? selectedItem.hindiSummary : selectedItem.summary}
                </p>
              </div>

              {/* Impacted Sector & Entities */}
              {selectedItem.impactedSectorOrEntity && (
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Impacted Market Entities / Sectors</div>
                  <div className="text-xs text-amber-300 font-mono p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30">
                    {selectedItem.impactedSectorOrEntity}
                  </div>
                </div>
              )}

              {/* Verified Digital Signature & Non-Repudiation */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    C2PA Verified SHA-256 Gazette Hash
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedItem.verifiedSignatureHash, 'hash')}
                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Digest Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="font-mono text-[10px] text-slate-500 break-all bg-slate-900/90 p-2 rounded border border-slate-800">
                  {selectedItem.verifiedSignatureHash}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[10px] font-mono text-slate-500">
                Timestamp: {new Date(selectedItem.timestamp).toLocaleString()} ({selectedItem.displayTime})
              </div>
              <div className="flex items-center gap-2">
                {selectedItem.officialDocUrl && (
                  <a
                    href={selectedItem.officialDocUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    <span>{isHindi ? 'आधिकारिक राजपत्र देखें' : 'View Gazette Circular'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {onNavigateToScanner && (
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      onNavigateToScanner();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 transition-all"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'स्कैनर में ऑडिट करें' : 'Audit In Forensic Scanner'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
