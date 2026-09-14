import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Globe,
  Search,
  Check,
  X,
  ChevronDown,
  Sparkles,
  MapPin,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { useLocalization } from '../context/LocalizationContext';
import { Language, LanguageMeta } from '../types/languages';

interface LanguageSelectorProps {
  compact?: boolean;
  variant?: 'header' | 'modal-only' | 'inline-pills';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  compact = false,
  variant = 'header',
  className = ''
}) => {
  const {
    language,
    setLanguage,
    languageMeta,
    indianLanguages,
    globalLanguages,
    marketLanguages,
    market,
    isLanguageModalOpen,
    openLanguageModal,
    closeLanguageModal
  } = useLocalization();

  const [activeTab, setActiveTab] = useState<'INDIAN' | 'GLOBAL'>(() =>
    market === 'IN' ? 'INDIAN' : 'GLOBAL'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync tab if market changes and modal is opened
  useEffect(() => {
    setActiveTab(market === 'IN' ? 'INDIAN' : 'GLOBAL');
  }, [market]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isLanguageModalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 150);
    } else {
      setSearchQuery('');
    }
  }, [isLanguageModalOpen]);

  const filteredIndian = useMemo(() => {
    if (!searchQuery.trim()) return indianLanguages;
    const q = searchQuery.toLowerCase();
    return indianLanguages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        l.marketCenter.toLowerCase().includes(q) ||
        l.script.toLowerCase().includes(q)
    );
  }, [indianLanguages, searchQuery]);

  const filteredGlobal = useMemo(() => {
    if (!searchQuery.trim()) return globalLanguages;
    const q = searchQuery.toLowerCase();
    return globalLanguages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        l.marketCenter.toLowerCase().includes(q) ||
        l.script.toLowerCase().includes(q)
    );
  }, [globalLanguages, searchQuery]);

  // Top quick pills based on active market
  const quickPillCodes: Language[] = useMemo(() => {
    if (market === 'IN') {
      return ['en', 'hi', 'gu', 'mr', 'ta', 'te', 'bn'];
    }
    return ['en', 'es', 'zh', 'ja', 'de', 'fr', 'ar'];
  }, [market]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    closeLanguageModal();
  };

  return (
    <>
      {/* Trigger element in Header / Navbar */}
      {variant === 'header' && (
        <div className={`flex items-center gap-1.5 ${className}`}>
          {/* Quick pills on desktop */}
          {!compact && (
            <div className="hidden xl:flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-xl border border-slate-800/80">
              {quickPillCodes.map((code) => {
                const meta =
                  code === 'en'
                    ? { code: 'en', nativeName: 'EN', name: 'English' }
                    : indianLanguages.find((l) => l.code === code) ||
                      globalLanguages.find((l) => l.code === code);
                if (!meta) return null;
                const isSelected = language === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLanguage(code)}
                    title={`${meta.name} (${meta.nativeName})`}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <span>{meta.nativeName}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Language Menu Button */}
          <button
            type="button"
            id="global-language-selector-btn"
            onClick={openLanguageModal}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all cursor-pointer group"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="flex items-center gap-1">
              <span>{languageMeta.flag}</span>
              <span className="font-bold">{languageMeta.nativeName}</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
              {languageMeta.code}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Inline pills variant for small toolbars */}
      {variant === 'inline-pills' && (
        <div className={`flex flex-wrap items-center gap-1 ${className}`}>
          {quickPillCodes.slice(0, 5).map((code) => {
            const isSelected = language === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {code.toUpperCase()}
              </button>
            );
          })}
          <button
            type="button"
            onClick={openLanguageModal}
            className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-800/80 text-cyan-400 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50 flex items-center gap-1"
          >
            <Languages className="w-3 h-3" />
            <span>More ({indianLanguages.length + globalLanguages.length}+)</span>
          </button>
        </div>
      )}

      {/* Comprehensive Multi-Language Selection Dialog / Modal */}
      {isLanguageModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={closeLanguageModal}
        >
          <div
            className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[92vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                      <span>Select Platform Language / भाषा चुनें</span>
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                      24+ LANGUAGES
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Indian Regional Languages (SEBI / BSE / NSE) & Global Financial Capital Languages (SEC / FINRA).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeLanguageModal}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar and Tab Selector */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 space-y-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search language, script, or market hub (e.g. Gujarati, Marathi, Tamil, Spanish, Japanese, GIFT City, Tokyo)..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Tabs: Indian Regional vs Global Foreign */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('INDIAN')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'INDIAN'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>🇮🇳 Indian Regional Languages</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                      {indianLanguages.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('GLOBAL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'GLOBAL'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>🌐 Global Foreign Languages</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                      {globalLanguages.length}
                    </span>
                  </button>
                </div>

                {/* English Common Pin */}
                <button
                  type="button"
                  onClick={() => handleSelect('en')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 cursor-pointer transition-all ${
                    language === 'en'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>🌐 English (Global Standard)</span>
                  {language === 'en' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Language Grid Scroll Container */}
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[60vh] space-y-4">
              {activeTab === 'INDIAN' ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                      <span>🇮🇳 Indian Capital Market Regional Languages (SEBI Ecosystem)</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Covers Dalal Street, GIFT City, FinTech & Regional Investor Hubs
                    </span>
                  </div>

                  {filteredIndian.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No Indian regional language matches "{searchQuery}".
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {filteredIndian.map((lang) => {
                        const isSelected = language === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleSelect(lang.code)}
                            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2 group cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/50 shadow-md'
                                : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-base font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                                  <span>{lang.nativeName}</span>
                                  {isSelected && (
                                    <span className="p-0.5 rounded-full bg-amber-500 text-slate-950">
                                      <Check className="w-3 h-3" />
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-400 font-medium">
                                  {lang.name} • <span className="font-mono text-[10px] text-slate-500">{lang.code.toUpperCase()}</span>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                                {lang.script}
                              </span>
                            </div>

                            <div className="space-y-1 pt-1 border-t border-slate-800/60 text-[11px]">
                              <div className="flex items-center gap-1 text-slate-400 truncate">
                                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                                <span className="truncate">{lang.marketCenter}</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-500">
                                <span>{lang.jurisdictionTag}</span>
                                <span className="text-slate-400 font-medium italic">"{lang.sampleGreeting}"</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                      <span>🌐 Global Financial Capital Foreign Languages (SEC / FINRA Ecosystem)</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Covers Americas, Europe, Asia-Pacific & Middle East Exchanges
                    </span>
                  </div>

                  {filteredGlobal.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No global language matches "{searchQuery}".
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {filteredGlobal.map((lang) => {
                        const isSelected = language === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleSelect(lang.code)}
                            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2 group cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-500/10 border-cyan-500/60 ring-1 ring-cyan-500/50 shadow-md'
                                : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                                  <span>{lang.flag}</span>
                                  <span>{lang.nativeName}</span>
                                  {isSelected && (
                                    <span className="p-0.5 rounded-full bg-cyan-500 text-slate-950">
                                      <Check className="w-3 h-3" />
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-400 font-medium">
                                  {lang.name} • <span className="font-mono text-[10px] text-slate-500">{lang.code.toUpperCase()}</span>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                                {lang.script}
                              </span>
                            </div>

                            <div className="space-y-1 pt-1 border-t border-slate-800/60 text-[11px]">
                              <div className="flex items-center gap-1 text-slate-400 truncate">
                                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                                <span className="truncate">{lang.marketCenter}</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-500">
                                <span>{lang.jurisdictionTag}</span>
                                <span className="text-slate-400 font-medium italic">"{lang.sampleGreeting}"</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  Active Language: <strong className="text-white">{languageMeta.name} ({languageMeta.nativeName})</strong>
                  {languageMeta.dir === 'rtl' && <span className="ml-1 text-amber-400 font-mono">[RTL Enabled]</span>}
                </span>
              </div>
              <button
                type="button"
                onClick={closeLanguageModal}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
